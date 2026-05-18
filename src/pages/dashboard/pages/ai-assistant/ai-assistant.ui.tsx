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
  MAX_TEXTAREA_HEIGHT,
  MIN_TEXTAREA_HEIGHT,
  MESSAGE_ANIMATION_VARIANTS,
  TYPING_DOT_ANIMATION,
} from './ai-assistant.const';
import { VoiceModal } from './ui/voice-modal/voice-modal.ui';
import { ChatMarkdown } from './ui/chat-markdown';

const SCROLL_THRESHOLD_PX = 80;
const KEYBOARD_OPEN_THRESHOLD_PX = 60;

type Message = ChatMessage & {
  id: string;
  timestamp: number;
};

/** Klaviatura balandligi (px) — iOS Safari uchun */
function getKeyboardInset(vv: VisualViewport): number {
  return Math.max(
    0,
    Math.round(window.innerHeight - vv.height - vv.offsetTop)
  );
}

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
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const keyboardOpenRef = useRef(false);

  const [showScrollBtn, setShowScrollBtn] = useState(false);
  const [draft, setDraft] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_isInitializing, setIsInitializing] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const [voiceModalOpened, setVoiceModalOpened] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);
  const [keyboardOpen, setKeyboardOpen] = useState(false);

  const isMobile = useMediaQuery(AI_ASSISTANT_MOBILE_MQ, false, {
    getInitialValueInEffect: true,
  });

  const hasMessages = messages.length > 0;

  // ─── CSS var: --ai-kb (DOM ga, re-render yo'q) ───
  const applyMobileCssVars = useCallback(() => {
    const root = containerRef.current;
    const dock = inputDockRef.current;
    const vv = window.visualViewport;
    if (!root || !vv) return;

    // iOS: window.innerHeight o'zgarmaydi, vv.height kichrayadi
    const rawKb = getKeyboardInset(vv);
    // Browser address-bar (≤ 60px) dan farqlash — faqat haqiqiy klaviatura insetini olish
    const kb = rawKb > KEYBOARD_OPEN_THRESHOLD_PX ? rawKb : 0;
    root.style.setProperty('--ai-kb', `${kb}px`);
    dock?.style.setProperty('--ai-kb', `${kb}px`);

    const isOpen = rawKb > KEYBOARD_OPEN_THRESHOLD_PX;
    if (isOpen !== keyboardOpenRef.current) {
      keyboardOpenRef.current = isOpen;
      setKeyboardOpen(isOpen);
    }
  }, []);

  const clearMobileCssVars = useCallback(() => {
    const root = containerRef.current;
    const dock = inputDockRef.current;
    root?.style.removeProperty('--ai-kb');
    dock?.style.removeProperty('--ai-kb');
    if (keyboardOpenRef.current) {
      keyboardOpenRef.current = false;
      setKeyboardOpen(false);
    }
  }, []);

  // ─── Mobil: viewport + dock o'lchamlari ───
  useEffect(() => {
    if (!isMobile) {
      clearMobileCssVars();
      return undefined;
    }

    const vv = window.visualViewport;
    if (!vv) return undefined;

    // rAF bilan batching — tez ketma-ket eventlarda ortiqcha reflow yo'q
    let rafId = 0;
    const schedule = () => {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(() => {
        if (window.scrollY !== 0 || window.scrollX !== 0) window.scrollTo(0, 0);
        applyMobileCssVars();
      });
    };

    applyMobileCssVars();
    vv.addEventListener('resize', schedule);
    vv.addEventListener('scroll', schedule);
    window.addEventListener('resize', schedule);
    window.addEventListener('orientationchange', schedule);

    const dock = inputDockRef.current;
    const ro =
      dock &&
      new ResizeObserver(() => {
        applyMobileCssVars();
      });
    if (ro && dock) ro.observe(dock);

    return () => {
      cancelAnimationFrame(rafId);
      vv.removeEventListener('resize', schedule);
      vv.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      window.removeEventListener('orientationchange', schedule);
      ro?.disconnect();
      clearMobileCssVars();
    };
  }, [isMobile, applyMobileCssVars, clearMobileCssVars]);

  // ─── Mobil: body va ota scroll qulflash ───
  useEffect(() => {
    if (!isMobile) return undefined;

    const prevBody = document.body.style.overflow;
    const prevBodyX = document.body.style.overflowX;
    document.body.style.overflow = 'hidden';
    document.body.style.overflowX = 'hidden';

    const locked: { el: HTMLElement; prev: string }[] = [];
    let node: HTMLElement | null = containerRef.current?.parentElement ?? null;
    while (node && node !== document.body) {
      const ov = getComputedStyle(node).overflowY;
      if (ov === 'auto' || ov === 'scroll') {
        locked.push({ el: node, prev: node.style.overflow });
        node.style.overflow = 'hidden';
      }
      node = node.parentElement;
    }

    return () => {
      document.body.style.overflow = prevBody;
      document.body.style.overflowX = prevBodyX;
      locked.forEach(({ el, prev }) => {
        el.style.overflow = prev;
      });
    };
  }, [isMobile]);

  // ─── Textarea balandligi ───
  const syncTextareaHeight = useCallback(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = '0px';
    const scrollH = el.scrollHeight;
    const newH = Math.min(
      Math.max(scrollH, MIN_TEXTAREA_HEIGHT),
      MAX_TEXTAREA_HEIGHT
    );
    el.style.height = `${newH}px`;
    el.style.overflowY = scrollH > MAX_TEXTAREA_HEIGHT ? 'auto' : 'hidden';
  }, []);

  // Mount va draft o'zgarganda sync
  useLayoutEffect(() => {
    syncTextareaHeight();
  }, [draft, syncTextareaHeight]);

  // Mount: textarea ni 32px dan boshlash (CSS field-sizing yo'q)
  useLayoutEffect(() => {
    const el = textareaRef.current;
    if (el) {
      el.style.height = `${MIN_TEXTAREA_HEIGHT}px`;
      el.style.overflowY = 'hidden';
    }
  }, []);

  // Klaviatura ochilganda dock qayta o'lchanadi + xabarlar pastga
  useLayoutEffect(() => {
    if (!isMobile) return;
    const id = requestAnimationFrame(() => {
      applyMobileCssVars();
      if (keyboardOpenRef.current && hasMessages) {
        scrollViewportRef.current?.scrollTo({
          top: scrollViewportRef.current.scrollHeight,
          behavior: 'auto',
        });
      }
    });
    return () => cancelAnimationFrame(id);
  }, [isMobile, keyboardOpen, hasMessages, applyMobileCssVars]);

  // ─── Attachments URLs ───
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

  const focusComposerInput = useCallback(() => {
    textareaRef.current?.focus({ preventScroll: true });
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
    window.scrollTo(0, 0);
    // Klaviatura chiqishini kutib vars yangilaymiz
    requestAnimationFrame(() => {
      applyMobileCssVars();
      syncTextareaHeight();
    });
    // iOS ba'zan kechroq trigger qiladi
    setTimeout(applyMobileCssVars, 300);
  }, [applyMobileCssVars, syncTextareaHeight]);

  const handleTextareaBlur = useCallback(() => {
    requestAnimationFrame(() => {
      window.scrollTo(0, 0);
      applyMobileCssVars();
    });
    // Klaviatura yopilgach yana bir marta check
    setTimeout(applyMobileCssVars, 150);
  }, [applyMobileCssVars]);

  // ─── Session ───
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
            setMessages(
              envelope.messages.map((msg) => {
                const r = msg.role?.toLowerCase();
                const role: Message['role'] =
                  r === 'assistant'
                    ? 'assistant'
                    : r === 'system'
                      ? 'system'
                      : 'user';
                return {
                  id:
                    msg.id != null ? String(msg.id) : `msg_${Date.now()}`,
                  role,
                  content: msg.text,
                  timestamp: msg.createdAt
                    ? new Date(msg.createdAt).getTime()
                    : Date.now(),
                };
              })
            );
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
      } catch (err: unknown) {
        if (cancelled) return;
        const e = err as { response?: { data?: { message?: string } }; message?: string };
        const errorMessage =
          e.response?.data?.message || e.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({ title: 'Xatolik', message: errorMessage, color: 'red' });
      } finally {
        if (!cancelled) setIsInitializing(false);
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
  }, [syncScrollBtn]);

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

  useEffect(() => {
    const t = setTimeout(() => {
      scrollViewportRef.current?.scrollTo({
        top: scrollViewportRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }, 50);
    return () => clearTimeout(t);
  }, [messages.length, isLoading]);

  const handleSend = async () => {
    if (!draft.trim() || isLoading || !user?.id) return;
    const content = draft.trim();
    const chatId = currentSessionId || urlSessionId;
    if (!chatId) return;

    setMessages((prev) => [
      ...prev,
      {
        id: `msg_${Date.now()}`,
        role: 'user',
        content,
        timestamp: Date.now(),
      },
    ]);
    setDraft('');
    setAttachments([]);
    setIsLoading(true);
    setError(null);

    const assistantId = `msg_${Date.now()}_assistant`;
    setMessages((prev) => [
      ...prev,
      { id: assistantId, role: 'assistant', content: '', timestamp: Date.now() },
    ]);

    try {
      const response = await sendChatMessage(
        chatId,
        { userId: user.id, text: content },
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
        if (!finalText && !next.find((m) => m.id === assistantId)?.content.trim()) {
          return next.filter((m) => m.id !== assistantId);
        }
        return next;
      });
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      const errorMessage =
        e.response?.data?.message || e.message || 'Xatolik yuz berdi';
      setError(errorMessage);
      notifications.show({ title: 'Xatolik', message: errorMessage, color: 'red' });
      setMessages((prev) => prev.filter((m) => m.id !== assistantId));
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyMessage = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <Box
      ref={containerRef}
      className={`${styles.container} ${messages.length === 0 ? styles.containerCentered : ''}`}
      data-mobile={isMobile || undefined}
      data-keyboard-open={isMobile && keyboardOpen ? true : undefined}
    >
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
                                onClick={() => {
                                  setDraft(message.content);
                                  focusComposerInput();
                                }}
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
          </Stack>
        </ScrollArea>
      ) : (
        <Box className={styles.welcomeState}>
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

      <Box
        ref={inputDockRef}
        className={`${styles.inputArea} ${messages.length === 0 ? styles.inputAreaCentered : ''}`}
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

        <Box ref={composerDockRef} className={styles.composerDock}>
          <div
            className={styles.composer}
            onPointerDown={handleComposerPointerDown}
          >
            {attachments.length > 0 && (
              <Group gap={8} wrap="wrap" mb="xs" className={styles.attachmentsRow}>
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
        onTranscribed={(text) => setDraft((p) => (p ? `${p} ${text}` : text))}
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
