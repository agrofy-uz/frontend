import {
  Box,
  ActionIcon,
  Button,
  ScrollArea,
  Stack,
  Text,
  Tooltip,
  Group,
} from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
  useMemo,
} from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsMicMuteFill } from 'react-icons/bs';
import { IoArrowUp, IoChevronDown } from 'react-icons/io5';
import { MdContentCopy, MdEdit, MdCheck, MdClose } from 'react-icons/md';
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
  AiChatLimitError,
  applyAiChatLimitedFromPayload,
  applyAiChatLimitedUntil,
  formatAiChatLimitCountdown,
  isAiChatSendBlocked,
} from '@/shared/lib/aiChatLimit';
import { refetchAuthMe } from '@/shared/lib/authSession';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import {
  AI_ASSISTANT_MOBILE_MQ,
  AI_CHAT_LIMIT_MESSAGE,
  AI_CHAT_LIMIT_NEXT_WRITE,
  AI_CHAT_LIMIT_TITLE,
  AI_CHAT_LIMIT_UPGRADE,
  AI_TRUST_DISCLAIMER,
  AI_TRUST_DISCLAIMER_MOBILE,
  MAX_TEXTAREA_HEIGHT,
  MIN_TEXTAREA_HEIGHT,
  MESSAGE_ANIMATION_VARIANTS,
  TYPING_DOT_ANIMATION,
} from './ai-assistant.const';
import { VoiceModal } from './ui/voice-modal/voice-modal.ui';
import { ImagePreviewModal } from './ui/image-preview-modal';
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
  const openPricingModal = usePricingModalStore((s) => s.open);
  const params = new URLSearchParams(location.search);
  const urlSessionId = params.get('chat');

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    urlSessionId
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const scrollViewportRef = useRef<HTMLDivElement | null>(null);
  const scrollBottomAfterHistoryRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

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
  const isMobile = useMediaQuery(AI_ASSISTANT_MOBILE_MQ, false, {
    getInitialValueInEffect: true,
  });

  const hasMessages = messages.length > 0;

  const chatLimitUntil = user?.ai_chat_limited_until;
  const isChatLimitActive = isAiChatSendBlocked(chatLimitUntil);

  const [limitCountdownTick, setLimitCountdownTick] = useState(0);

  const chatLimitCountdown = useMemo(() => {
    if (!isChatLimitActive) return null;
    return formatAiChatLimitCountdown(chatLimitUntil);
  }, [isChatLimitActive, chatLimitUntil, limitCountdownTick]);

  useEffect(() => {
    if (!authHydrated) return undefined;
    void refetchAuthMe();
    return undefined;
  }, [authHydrated]);

  useEffect(() => {
    if (!isChatLimitActive || !chatLimitUntil?.trim()) return undefined;
    setLimitCountdownTick((t) => t + 1);
    const id = window.setInterval(() => {
      setLimitCountdownTick((t) => t + 1);
    }, 1000);
    return () => window.clearInterval(id);
  }, [isChatLimitActive, chatLimitUntil]);

  useEffect(() => {
    if (!chatLimitUntil?.trim() || !isChatLimitActive) return undefined;
    const ms = Date.parse(chatLimitUntil.trim()) - Date.now();
    if (ms <= 0) {
      void refetchAuthMe();
      return undefined;
    }
    const timer = window.setTimeout(() => {
      void refetchAuthMe();
    }, ms + 500);
    return () => window.clearTimeout(timer);
  }, [chatLimitUntil, isChatLimitActive]);

  // ─── Mobil: faqat dashboard content scroll qulfi (klaviatura — brauzerga) ───
  useEffect(() => {
    if (!isMobile) return undefined;

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
      if (target.closest('button, a, [role="button"], textarea')) return;
      if (e.pointerType === 'mouse' && e.button !== 0) return;
      focusComposerInput();
    },
    [focusComposerInput]
  );

  const handleTextareaFocus = useCallback(() => {
    requestAnimationFrame(syncTextareaHeight);
  }, [syncTextareaHeight]);

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
                  id: msg.id != null ? String(msg.id) : `msg_${Date.now()}`,
                  role,
                  content: msg.text,
                  timestamp: msg.createdAt
                    ? new Date(msg.createdAt).getTime()
                    : Date.now(),
                };
              })
            );
            scrollBottomAfterHistoryRef.current = true;
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
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          e.response?.data?.message || e.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({
          title: 'Xatolik',
          message: errorMessage,
          color: 'red',
        });
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

  /** Stream: yangi matn input ustida qoladi, eski qatorlar yuqoriga siljiydi */
  const scrollToBottomInstant = useCallback(() => {
    const vp = scrollViewportRef.current;
    if (!vp) return;
    vp.scrollTop = vp.scrollHeight;
    syncScrollBtn();
  }, [syncScrollBtn]);

  useLayoutEffect(() => {
    if (!hasMessages && !isLoading) return;
    const id = requestAnimationFrame(syncScrollBtn);
    return () => cancelAnimationFrame(id);
  }, [messages, hasMessages, isLoading, syncScrollBtn]);

  useLayoutEffect(() => {
    if (!isLoading || !hasMessages) return;
    scrollToBottomInstant();
  }, [messages, isLoading, hasMessages, scrollToBottomInstant]);

  /** Chat tarixi yuklanganda — oxirgi xabarga */
  useLayoutEffect(() => {
    if (!scrollBottomAfterHistoryRef.current || isLoading) return;
    scrollBottomAfterHistoryRef.current = false;
    const id = requestAnimationFrame(() => {
      scrollToBottom();
    });
    return () => cancelAnimationFrame(id);
  }, [messages, isLoading, scrollToBottom]);

  const handleSend = async () => {
    if (!draft.trim() || isLoading || !user?.id) return;
    if (isChatLimitActive) {
      notifications.show({
        title: AI_CHAT_LIMIT_TITLE,
        message: chatLimitCountdown
          ? `${AI_CHAT_LIMIT_MESSAGE} ${chatLimitCountdown}`
          : AI_CHAT_LIMIT_MESSAGE,
        color: 'orange',
      });
      return;
    }
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
        if (
          !finalText &&
          !next.find((m) => m.id === assistantId)?.content.trim()
        ) {
          return next.filter((m) => m.id !== assistantId);
        }
        return next;
      });

      applyAiChatLimitedFromPayload(response);
    } catch (err: unknown) {
      if (err instanceof AiChatLimitError) {
        applyAiChatLimitedUntil(err.limitedUntil);
        const limitMsg = err.limitedUntil
          ? `${AI_CHAT_LIMIT_MESSAGE} ${formatAiChatLimitCountdown(err.limitedUntil)}`
          : AI_CHAT_LIMIT_MESSAGE;
        setError(limitMsg);
        notifications.show({
          title: AI_CHAT_LIMIT_TITLE,
          message: limitMsg,
          color: 'orange',
        });
        setMessages((prev) => {
          const withoutAssistant = prev.filter((m) => m.id !== assistantId);
          const last = withoutAssistant[withoutAssistant.length - 1];
          if (last?.role === 'user' && last.content === content) {
            return withoutAssistant.slice(0, -1);
          }
          return withoutAssistant;
        });
        setDraft(content);
      } else {
        const e = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const errorMessage =
          e.response?.data?.message || e.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({
          title: 'Xatolik',
          message: errorMessage,
          color: 'red',
        });
        setMessages((prev) => prev.filter((m) => m.id !== assistantId));
      }
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
                    data-message-id={message.id}
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

        <Box className={styles.composerDock}>
          {isChatLimitActive && (
            <Box className={styles.chatLimitStrip} aria-live="polite">
              <Box className={styles.chatLimitStripInner}>
                <Box className={styles.chatLimitStripInfo}>
                  <Text className={styles.chatLimitStripTitle} component="p">
                    {AI_CHAT_LIMIT_TITLE}
                  </Text>
                  <Text className={styles.chatLimitStripMeta} component="p">
                    {AI_CHAT_LIMIT_NEXT_WRITE}
                    {chatLimitCountdown ? (
                      <>
                        :{' '}
                        <strong className={styles.chatLimitCountdown}>
                          {chatLimitCountdown}
                        </strong>
                      </>
                    ) : null}
                  </Text>
                </Box>
                <Button
                  type="button"
                  // size="compact-sm"
                  h={30}
                  radius={22}
                  variant="filled"
                  color="green"
                  className={styles.chatLimitUpgradeBtn}
                  onClick={openPricingModal}
                >
                  {AI_CHAT_LIMIT_UPGRADE}
                </Button>
              </Box>
            </Box>
          )}
          <div
            className={`${styles.composer} ${isChatLimitActive ? styles.composerWithLimitStrip : ''}`}
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
                  disabled={isChatLimitActive}
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
                  disabled={isChatLimitActive || !draft.trim() || isLoading}
                  onClick={handleSend}
                >
                  <IoArrowUp size={18} />
                </ActionIcon>
              </Box>
            </Box>
          </div>
        </Box>

        <Text
          className={`${styles.disclaimer} ${isMobile ? styles.disclaimerMobile : ''}`}
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
      <ImagePreviewModal
        imageUrl={previewImageUrl}
        onClose={() => setPreviewImageUrl(null)}
      />
    </Box>
  );
}

export default AiAssistant;
