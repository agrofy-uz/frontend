import {
  Box,
  ActionIcon,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  Group,
  Modal,
} from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsMicMuteFill } from 'react-icons/bs';
import { IoArrowUp, IoChevronDown } from 'react-icons/io5';
import {
  // MdAttachFile,
  MdContentCopy,
  MdEdit,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import { useMediaQuery } from '@mantine/hooks';
import styles from './ai-assistant.module.css';
import {
  createChat,
  getChatMessages,
  sendChatMessage,
  type ChatMessage,
} from '@/shared/api';
import { useAuthStore, useAuthStoreHydrated } from '@/shared/store/authStore';
import {
  AI_ASSISTANT_MOBILE_MQ,
  AI_TRUST_DISCLAIMER,
  AI_TRUST_DISCLAIMER_MOBILE,
  KEYBOARD_INSET_STABLE_PX,
  MOBILE_SCROLL_PAD_TRIM_PX,
  MAX_TEXTAREA_HEIGHT,
  MESSAGE_ANIMATION_VARIANTS,
  TYPING_DOT_ANIMATION,
} from './ai-assistant.const';
import { VoiceModal } from './ui/voice-modal/voice-modal.ui';
// import { AttachMenu } from './ui/attach-menu';
import { ChatMarkdown } from './ui/chat-markdown';

const SCROLL_THRESHOLD_PX = 80;

type Message = ChatMessage & {
  id: string;
  timestamp: number;
};

function AiAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const authHydrated = useAuthStoreHydrated();
  const { user } = useAuthStore();
  const params = new URLSearchParams(location.search);
  const urlSessionId = params.get('chat');

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    urlSessionId
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const inputDockRef = useRef<HTMLDivElement>(null);
  const composerDockRef = useRef<HTMLDivElement>(null);
  const [inputDockHeight, setInputDockHeight] = useState(0);
  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_isInitializing, setIsInitializing] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [voiceModalOpened, setVoiceModalOpened] = useState(false);
  // const [attachMenuOpened, setAttachMenuOpened] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardOpenRef = useRef(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [composerFocused, setComposerFocused] = useState(false);
  const lastVvHeightRef = useRef(
    typeof window !== 'undefined' ? window.innerHeight : 0
  );
  const isMessagesScrollingRef = useRef(false);
  const messagesScrollEndTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const isMobile = useMediaQuery(AI_ASSISTANT_MOBILE_MQ, false, {
    getInitialValueInEffect: true,
  });

  // Rasm fayllar uchun object URL lar (thumbnaillar va preview uchun)
  useEffect(() => {
    const urls = attachments.map((f) =>
      f.type.startsWith('image/') ? URL.createObjectURL(f) : null
    );
    setImageUrls((prev) => {
      prev.forEach((u) => u && URL.revokeObjectURL(u));
      return urls;
    });
    return () => {
      urls.forEach((u) => u && URL.revokeObjectURL(u));
    };
  }, [attachments]);

  // Textarea-ni to'g'ridan-to'g'ri DOM orqali o'lchaymiz va o'zgartiramiz
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (!el) return;

    el.style.height = 'auto'; // Reset height
    const scrollH = el.scrollHeight;
    const maxH = MAX_TEXTAREA_HEIGHT;
    const newH = Math.min(scrollH, maxH);

    el.style.height = `${newH}px`;
    el.style.overflowY = scrollH > maxH ? 'auto' : 'hidden';
  }, [draft]);

  // Mobil: klaviatura — inputni ko‘tarish, sahifani emas
  useEffect(() => {
    if (!isMobile) {
      containerRef.current?.style.removeProperty('--ai-keyboard-inset');
      if (keyboardOpenRef.current) {
        keyboardOpenRef.current = false;
        setKeyboardOpen(false);
      }
      return undefined;
    }

    const vv = window.visualViewport;
    if (!vv) return undefined;

    const syncMobileLayout = (force = false) => {
      if (isMessagesScrollingRef.current && !force) return;

      const heightChanged =
        Math.abs(vv.height - lastVvHeightRef.current) >= KEYBOARD_INSET_STABLE_PX;
      if (!force && !heightChanged) return;
      lastVvHeightRef.current = vv.height;

      const container = containerRef.current;
      const inputEl = inputDockRef.current;
      if (!container) return;

      const inset = Math.max(0, window.innerHeight - vv.height);
      container.style.setProperty('--ai-keyboard-inset', `${inset}px`);

      const isOpen = inset > 50;
      if (isOpen !== keyboardOpenRef.current) {
        keyboardOpenRef.current = isOpen;
        setKeyboardOpen(isOpen);
      }

      // Kontent balandligi = viewport pasti − input (klaviatura inset ikki marta qo‘shilmasin)
      if (isOpen && inputEl) {
        const top = container.getBoundingClientRect().top;
        const vvBottom = vv.offsetTop + vv.height;
        const inputH = inputEl.getBoundingClientRect().height;
        const available = Math.round(vvBottom - top - inputH);
        container.style.height = `${Math.max(120, available)}px`;
      } else {
        container.style.height = '';
      }
    };

    const onResize = () => syncMobileLayout(false);

    // iOS: klaviatura ochilganda brauzer window-ni scroll qiladi →
    // header yuqoriga chiqadi. Buni darhol bekor qilamiz.
    const onVpScroll = () => {
      if (window.scrollX !== 0 || window.scrollY !== 0) {
        window.scrollTo({ top: 0, left: 0 });
      }
    };

    syncMobileLayout(true);
    vv.addEventListener('resize', onResize);
    vv.addEventListener('scroll', onVpScroll);
    return () => {
      vv.removeEventListener('resize', onResize);
      vv.removeEventListener('scroll', onVpScroll);
    };
  }, [isMobile]);

  // Mobil: yuqori scrollable ota-elementlarni qulflash.
  // Dashboard layout .content box-i overflow:auto — iOS uni scroll qiladi.
  // AI assistant sahifasida bu shart emas (ichki ScrollArea o'zi boshqaradi).
  useEffect(() => {
    if (!isMobile) return undefined;
    const container = containerRef.current;
    if (!container) return undefined;

    const locked: { el: HTMLElement; prevOverflow: string }[] = [];
    let el: HTMLElement | null = container.parentElement;
    while (el && el !== document.body) {
      const ov = getComputedStyle(el).overflowY;
      if (ov === 'auto' || ov === 'scroll') {
        locked.push({ el, prevOverflow: el.style.overflow });
        el.style.overflow = 'hidden';
      }
      el = el.parentElement;
    }

    return () => {
      locked.forEach(({ el: lockedEl, prevOverflow }) => {
        lockedEl.style.overflow = prevOverflow;
      });
    };
  }, [isMobile]);

  // Mobil: tashqi scroll va iOS zoom qolishini kamaytirish
  useEffect(() => {
    if (!isMobile) return undefined;

    const prevOverflow = document.body.style.overflow;
    const prevOverflowX = document.body.style.overflowX;
    document.body.style.overflow = 'hidden';
    document.body.style.overflowX = 'hidden';

    return () => {
      document.body.style.overflow = prevOverflow;
      document.body.style.overflowX = prevOverflowX;
    };
  }, [isMobile]);

  // Mobil: butun input bloki (composer + disclaimer) — scroll oralig‘i uchun
  useLayoutEffect(() => {
    if (!isMobile) {
      setInputDockHeight(0);
      return undefined;
    }

    const el = inputDockRef.current;
    if (!el) return undefined;

    const measure = () => {
      setInputDockHeight(el.getBoundingClientRect().height);
      const vv = window.visualViewport;
      if (!vv || !containerRef.current) return;
      const inset = Math.max(0, window.innerHeight - vv.height);
      if (inset <= 50) return;
      const container = containerRef.current;
      const top = container.getBoundingClientRect().top;
      const vvBottom = vv.offsetTop + vv.height;
      const inputH = el.getBoundingClientRect().height;
      const available = Math.round(vvBottom - top - inputH);
      container.style.height = `${Math.max(120, available)}px`;
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [isMobile, draft, messages.length, showScrollBtn, keyboardOpen]);

  const hasMessages = messages.length > 0;

  const welcomeLifted =
    isMobile && !hasMessages && (keyboardOpen || composerFocused);

  const mobileScrollPadHeight = Math.max(
    0,
    inputDockHeight - MOBILE_SCROLL_PAD_TRIM_PX
  );

  const dockHeightStyle = isMobile
    ? ({
        '--ai-input-dock-height': `${mobileScrollPadHeight}px`,
        // --ai-keyboard-inset: containerRef orqali (re-render siz)
      } as React.CSSProperties)
    : undefined;

  const focusComposerInput = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.focus({ preventScroll: true });
  }, []);

  const handleComposerPointerDown = useCallback(
    (e: React.PointerEvent<HTMLElement>) => {
      const target = e.target as HTMLElement;
      if (target.closest('button, a, [role="button"]')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      focusComposerInput();
    },
    [focusComposerInput]
  );

  const handleTextareaFocus = useCallback(() => {
    setComposerFocused(true);
    if (isMobile && (window.scrollX !== 0 || window.scrollY !== 0)) {
      window.scrollTo({ top: 0, left: 0 });
    }
  }, [isMobile]);

  const handleTextareaBlur = useCallback(() => {
    setComposerFocused(false);
    if (!isMobile) return;
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
    });
  }, [isMobile]);

  // Session yaratish yoki mavjud session history yuklash
  useEffect(() => {
    if (!authHydrated) return undefined;

    let cancelled = false;

    const initializeSession = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        if (urlSessionId) {
          setCurrentSessionId(urlSessionId);
          if (!user?.id?.trim()) {
            setMessages([]);
          } else {
            const envelope = await getChatMessages(urlSessionId, user.id);
            if (cancelled) return;
            const formattedMessages: Message[] = envelope.messages.map(
              (msg) => {
                const r = msg.role?.toLowerCase();
                const role: Message['role'] =
                  r === 'assistant'
                    ? 'assistant'
                    : r === 'system'
                      ? 'system'
                      : 'user';
                return {
                  id:
                    msg.id !== undefined && msg.id !== null
                      ? String(msg.id)
                      : `msg_${Date.now()}_${Math.random()}`,
                  role,
                  content: msg.text,
                  timestamp: msg.createdAt
                    ? new Date(msg.createdAt).getTime()
                    : Date.now(),
                };
              }
            );
            setMessages(formattedMessages);
          }
        } else {
          setCurrentSessionId(null);
          setMessages([]);
          if (user?.id?.trim()) {
            const createdChat = await createChat({ userId: user.id });
            if (cancelled) return;
            if (createdChat.chatId) {
              setCurrentSessionId(createdChat.chatId);
              navigate(`?chat=${createdChat.chatId}`, { replace: true });
              if (createdChat.title?.trim()) {
                window.dispatchEvent(
                  new CustomEvent('addChatToHistory', {
                    detail: {
                      sessionId: createdChat.chatId,
                      title: createdChat.title,
                    },
                  })
                );
              }
            }
          }
        }
      } catch (err: any) {
        if (cancelled) return;
        const errorMessage =
          err.response?.data?.message || err.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({
          title: 'Xatolik',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        if (!cancelled) {
          setIsInitializing(false);
        }
      }
    };

    void initializeSession();
    return () => {
      cancelled = true;
    };
  }, [authHydrated, urlSessionId, user?.id, navigate]);

  const syncScrollBtn = useCallback(() => {
    const vp = scrollViewportRef.current;
    if (!vp) {
      setShowScrollBtn(false);
      return;
    }
    const dist = vp.scrollHeight - vp.scrollTop - vp.clientHeight;
    setShowScrollBtn(
      vp.scrollHeight > vp.clientHeight + 1 && dist > SCROLL_THRESHOLD_PX
    );
  }, []);

  const handleMessagesScroll = useCallback(() => {
    syncScrollBtn();
    if (!isMobile) return;
    // Faqat ichki scroll — input inset va fokus o'zgarmaydi
    isMessagesScrollingRef.current = true;
    if (messagesScrollEndTimerRef.current) {
      clearTimeout(messagesScrollEndTimerRef.current);
    }
    messagesScrollEndTimerRef.current = setTimeout(() => {
      isMessagesScrollingRef.current = false;
      messagesScrollEndTimerRef.current = null;
    }, 180);
  }, [isMobile, syncScrollBtn]);

  useEffect(
    () => () => {
      if (messagesScrollEndTimerRef.current) {
        clearTimeout(messagesScrollEndTimerRef.current);
      }
    },
    []
  );

  const scrollToBottom = useCallback(() => {
    const vp = scrollViewportRef.current;
    if (!vp) return;
    vp.scrollTo({ top: vp.scrollHeight, behavior: 'smooth' });
    setTimeout(syncScrollBtn, 350);
  }, [syncScrollBtn]);

  useLayoutEffect(() => {
    if (!hasMessages && !isLoading) return;
    const id = requestAnimationFrame(syncScrollBtn);
    return () => cancelAnimationFrame(id);
  }, [messages, hasMessages, isLoading, syncScrollBtn]);

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const vp = scrollViewportRef.current;
      if (vp) {
        vp.scrollTo({ top: vp.scrollHeight, behavior: 'smooth' });
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading]);

  // Klaviatura ochilganda oxirgi xabar input ustida ko‘rinsin
  useEffect(() => {
    if (!isMobile || !keyboardOpen || !hasMessages) return undefined;
    const id = requestAnimationFrame(() => {
      const vp = scrollViewportRef.current;
      if (vp) vp.scrollTo({ top: vp.scrollHeight, behavior: 'auto' });
    });
    return () => cancelAnimationFrame(id);
  }, [isMobile, keyboardOpen, hasMessages, inputDockHeight]);

  const handleSend = async () => {
    if (!draft.trim() || isLoading) return;
    if (!user?.id) return;
    const content = draft.trim();

    const chatId = currentSessionId || urlSessionId;
    if (!chatId) return;

    // User xabarini darhol qo'shish
    const userMsg: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setAttachments([]);
    setIsLoading(true);
    setError(null);

    const assistantId = `msg_${Date.now()}_assistant`;
    setMessages((prev) => [
      ...prev,
      {
        id: assistantId,
        role: 'assistant',
        content: '',
        timestamp: Date.now(),
      },
    ]);

    try {
      const response = await sendChatMessage(
        chatId,
        {
          userId: user.id,
          text: content,
        },
        (accumulated) => {
          setMessages((prev) =>
            prev.map((m) =>
              m.id === assistantId ? { ...m, content: accumulated } : m
            )
          );
        }
      );

      const finalText = response.text?.trim() ?? '';
      setMessages((prev) => {
        const next = prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                id: response.id ?? m.id,
                content: finalText || m.content,
                timestamp: response.createdAt
                  ? new Date(response.createdAt).getTime()
                  : m.timestamp,
              }
            : m
        );
        if (
          !finalText &&
          !next.find((m) => m.id === assistantId)?.content.trim()
        ) {
          return next.filter((m) => m.id !== assistantId);
        }
        return next;
      });
    } catch (err: any) {
      const errorMessage =
        err.response?.data?.message || err.message || 'Xatolik yuz berdi';
      setError(errorMessage);
      notifications.show({
        title: 'Xatolik',
        message: errorMessage,
        color: 'red',
      });
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  // Xabar matnini nusxalash
  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      // Icon'ni check iconiga o'zgartirish
      setCopiedMessageId(messageId);
      // 2 soniyadan keyin qaytarish
      setTimeout(() => {
        setCopiedMessageId(null);
      }, 2000);
    } catch (err) {
      // Xatolik bo'lsa ham hech narsa qilmaymiz
    }
  };

  // Xabar matnini input'ga yozish
  const handleEditMessage = (content: string) => {
    setDraft(content);
    focusComposerInput();
  };

  const handleVoiceTranscribed = (text: string) => {
    setDraft((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <Box
      ref={containerRef}
      className={`${styles.container} ${messages.length === 0 ? styles.containerCentered : ''}`}
      data-mobile={isMobile || undefined}
      data-keyboard-open={isMobile && keyboardOpen ? true : undefined}
      style={dockHeightStyle}
    >
      {/* Messages Area */}
      {hasMessages || isLoading ? (
        <ScrollArea
          className={styles.messagesArea}
          scrollbarSize={12}
          viewportRef={scrollViewportRef}
          viewportProps={{ onScroll: handleMessagesScroll }}
        >
          <Stack gap="md" className={styles.messagesList}>
            <AnimatePresence mode="popLayout">
              {messages.map((message, index) => {
                const isUser = message.role === 'user';
                const isCopied = copiedMessageId === message.id;
                const showStreamingTyping =
                  !isUser &&
                  isLoading &&
                  index === messages.length - 1 &&
                  !message.content.trim();

                return (
                  <motion.div
                    key={message.id}
                    {...MESSAGE_ANIMATION_VARIANTS}
                    className={
                      isUser ? styles.userMessage : styles.assistantMessage
                    }
                  >
                    <Box className={styles.messageContentWrapper}>
                      <Box className={styles.messageContent}>
                        {showStreamingTyping ? (
                          <motion.div {...TYPING_DOT_ANIMATION}>
                            <Box className={styles.typingIndicator}>
                              <span />
                              <span />
                              <span />
                            </Box>
                          </motion.div>
                        ) : isUser ? (
                          <Text className={styles.messageText}>
                            {message.content}
                          </Text>
                        ) : (
                          <ChatMarkdown content={message.content} />
                        )}
                      </Box>

                      {/* Copy va Edit tugmalari — xabarga hover qilganda chiqadi */}
                      {!showStreamingTyping && (
                        <Box className={styles.messageActions}>
                          <Tooltip label="Nusxa olish" position="top">
                            <ActionIcon
                              variant="subtle"
                              size="md"
                              onClick={() =>
                                handleCopyMessage(message.content, message.id)
                              }
                              aria-label="Copy message"
                              color={isCopied ? 'green' : undefined}
                              className={styles.actionIcon}
                            >
                              {isCopied ? (
                                <MdCheck size={20} />
                              ) : (
                                <MdContentCopy size={20} />
                              )}
                            </ActionIcon>
                          </Tooltip>

                          {isUser && (
                            <Tooltip label="Tahrirlash" position="top">
                              <ActionIcon
                                variant="subtle"
                                size="md"
                                onClick={() =>
                                  handleEditMessage(message.content)
                                }
                                aria-label="Edit message"
                                className={styles.actionIcon}
                              >
                                <MdEdit size={20} />
                              </ActionIcon>
                            </Tooltip>
                          )}
                        </Box>
                      )}
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            <div ref={messagesEndRef} />
            {isMobile && mobileScrollPadHeight > 0 ? (
              <div aria-hidden className={styles.scrollPad} />
            ) : null}
          </Stack>
        </ScrollArea>
      ) : (
        <Box
          className={`${styles.welcomeState} ${welcomeLifted ? styles.welcomeStateKeyboard : ''}`}
        >
          <Text className={styles.welcomeTitle}>
            Nima bilan yordam bera olaman?
          </Text>
          {error && (
            <Text className={styles.errorText} mt="md" c="red">
              {error}
            </Text>
          )}
        </Box>
      )}

      {/* Input Area */}
      <Box
        ref={inputDockRef}
        className={`${styles.inputArea} ${messages.length === 0 ? styles.inputAreaCentered : ''}`}
        style={dockHeightStyle}
      >
        <AnimatePresence>
          {showScrollBtn && (
            <motion.div
              key="scroll-btn"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ duration: 0.18, ease: 'easeOut' }}
              className={styles.scrollToBottomDock}
            >
              <ActionIcon
                variant="subtle"
                color="gray"
                radius="50%"
                size="lg"
                className={styles.scrollToBottomBtn}
                onClick={scrollToBottom}
                aria-label="Pastga tushirish"
              >
                <IoChevronDown size={18} />
              </ActionIcon>
            </motion.div>
          )}
        </AnimatePresence>
        <Box
          ref={composerDockRef}
          className={styles.composerDock}
        >
          <div
            className={styles.composer}
            onPointerDown={handleComposerPointerDown}
          >
            {attachments.length > 0 && (
              <Group
                gap={8}
                wrap="wrap"
                mb="xs"
                className={styles.attachmentsRow}
              >
                {attachments.map((file, index) => {
                  const isImage = file.type.startsWith('image/');
                  const thumbUrl = isImage ? imageUrls[index] : null;
                  return isImage && thumbUrl ? (
                    <Box
                      key={`${file.name}-${index}`}
                      className={styles.attachmentImageWrap}
                      onClick={() => setPreviewImageUrl(thumbUrl)}
                    >
                      <img
                        src={thumbUrl}
                        alt={file.name}
                        className={styles.attachmentImage}
                      />
                      <ActionIcon
                        size={12}
                        variant="filled"
                        color="gray"
                        aria-label="O'chirish"
                        className={styles.attachmentImageRemove}
                        onClick={(e) => {
                          e.stopPropagation();
                          setAttachments((prev) =>
                            prev.filter((_, i) => i !== index)
                          );
                        }}
                      >
                        <MdClose size={16} />
                      </ActionIcon>
                    </Box>
                  ) : (
                    <Box
                      key={`${file.name}-${index}`}
                      className={styles.attachmentChip}
                      component="span"
                    >
                      <Text size="xs" truncate style={{ maxWidth: 120 }}>
                        {file.name}
                      </Text>
                      <ActionIcon
                        size={12}
                        variant="subtle"
                        color="gray"
                        aria-label="O'chirish"
                        onClick={() =>
                          setAttachments((prev) =>
                            prev.filter((_, i) => i !== index)
                          )
                        }
                      >
                        <MdClose size={14} />
                      </ActionIcon>
                    </Box>
                  );
                })}
              </Group>
            )}
            <Box className={styles.textareaWrap}>
              <textarea
                ref={textareaRef}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onFocus={handleTextareaFocus}
                onBlur={handleTextareaBlur}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey && !isMobile) {
                    e.preventDefault();
                    handleSend();
                  }
                }}
                rows={1}
                placeholder="Xabar yozing..."
                className={styles.textareaInput}
                enterKeyHint={isMobile ? 'enter' : 'send'}
                autoComplete="off"
                autoCorrect="on"
              />
            </Box>

            <Box className={styles.actionsContainer}>
              {/* <AttachMenu
              opened={attachMenuOpened}
              onOpenChange={setAttachMenuOpened}
              onFilesSelected={(files) =>
                setAttachments((prev) => [...prev, ...files])
              }
            >
              <ActionIcon
                className={styles.plusBtn}
                size="lg"
                radius="xl"
                variant="subtle"
                aria-label="Qo'shish"
                onClick={() => setAttachMenuOpened((o) => !o)}
              >
                <MdAttachFile size={18} />
              </ActionIcon>
            </AttachMenu> */}

              <Box className={styles.actions}>
                <ActionIcon
                  className={styles.micBtn}
                  size="lg"
                  radius="xl"
                  variant="subtle"
                  aria-label="Ovoz"
                  onClick={() => setVoiceModalOpened(true)}
                >
                  <BsMicMuteFill size={18} />
                </ActionIcon>

                <ActionIcon
                  className={styles.sendBtn}
                  size="lg"
                  radius="xl"
                  variant="filled"
                  aria-label="Yuborish"
                  disabled={!draft.trim() || isLoading}
                  onClick={handleSend}
                >
                  <IoArrowUp size={18} />
                </ActionIcon>
              </Box>
            </Box>
          </div>
        </Box>

        <Text
          className={`${styles.disclaimer} ${isMobile ? styles.disclaimerMobile : ''} ${keyboardOpen ? styles.disclaimerHidden : ''}`}
          component="p"
        >
          {isMobile ? AI_TRUST_DISCLAIMER_MOBILE : AI_TRUST_DISCLAIMER}
        </Text>
      </Box>

      <VoiceModal
        opened={voiceModalOpened}
        onClose={() => setVoiceModalOpened(false)}
        onTranscribed={handleVoiceTranscribed}
      />
      <Modal
        opened={!!previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
        withCloseButton
        size="auto"
        padding={0}
        radius="md"
        centered
        styles={{
          content: { overflow: 'hidden' },
          body: { padding: 0 },
          header: { display: 'none' },
        }}
      >
        {previewImageUrl && (
          <img
            src={previewImageUrl}
            alt="Katta ko'rinish"
            style={{
              maxWidth: '100vw',
              maxHeight: '100vh',
              objectFit: 'contain',
              display: 'block',
            }}
          />
        )}
      </Modal>
    </Box>
  );
}

export default AiAssistant;
