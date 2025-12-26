import {
  Box,
  Textarea,
  ActionIcon,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useLocation, useNavigate } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsMicMuteFill } from 'react-icons/bs';
import { IoArrowUp } from 'react-icons/io5';
import { MdAttachFile, MdContentCopy, MdEdit, MdCheck } from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import styles from './ai-assistant.module.css';
import { chatApi } from '@/shared/api/chat';
import type { ChatMessage } from '@/shared/api/chat';

type Message = ChatMessage & {
  id: string;
  timestamp: number;
};

function AiAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const urlSessionId = params.get('chat');

  const [currentSessionId, setCurrentSessionId] = useState<string | null>(
    urlSessionId
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [_isInitializing, setIsInitializing] = useState(true);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);

  // Session yaratish yoki mavjud session history yuklash
  useEffect(() => {
    const initializeSession = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        if (urlSessionId) {
          // URL'dan session_id bor, state ni yangilash va history yuklash
          setCurrentSessionId(urlSessionId);
          const history = await chatApi.getSessionHistory(urlSessionId);
          const formattedMessages: Message[] = history.messages.map((msg) => ({
            id: msg.id || `msg_${Date.now()}_${Math.random()}`,
            role: msg.role,
            content: msg.content,
            timestamp:
              msg.timestamp ||
              (msg.created_at
                ? new Date(msg.created_at).getTime()
                : Date.now()),
          }));
          setMessages(formattedMessages);

          // Agar xabarlar bo'lsa, birinchi AI javobidan chat nomini olish
          const firstAssistantMsg = formattedMessages.find(
            (msg) => msg.role === 'assistant'
          );
          if (firstAssistantMsg && firstAssistantMsg.content) {
            const chatTitle = generateChatTitle(firstAssistantMsg.content);
            // Sidebar'ga chat nomini yangilash uchun event yuborish
            window.dispatchEvent(
              new CustomEvent('updateChatTitle', {
                detail: { sessionId: urlSessionId, title: chatTitle },
              })
            );
          }

          // Agar chat mavjud bo'lsa va title bo'lsa, sidebar'da ko'rinadi
          // Bu yerda hech narsa qilmaymiz, chunki chat allaqachon tarixda bo'lishi kerak
        } else {
          // URL'dan session_id yo'q, session yaratilmaydi
          // Faqat input ko'rsatiladi, birinchi xabar yuborilganda session yaratiladi
          setCurrentSessionId(null);
          setMessages([]);
        }
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({
          title: 'Xatolik',
          message: errorMessage,
          color: 'red',
        });
      } finally {
        setIsInitializing(false);
      }
    };

    initializeSession();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [urlSessionId]);

  const hasMessages = messages.length > 0;

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Kichik kechikish bilan scroll qilish, DOM yangilanishini kutish uchun
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [messages.length, isLoading]);

  const isComposerExpanded = useMemo(() => {
    if (!draft) return false;
    if (draft.includes('\n')) return true;
    const el = textareaRef.current;
    if (!el) return false;
    // Autosize bo'lganda scrollHeight oshadi; 1 qatorlik holatni taxminiy 36-40px atrofida ushlaymiz.
    return el.scrollHeight >= 56;
  }, [draft]);

  const handleSend = async () => {
    if (!draft.trim() || isLoading) return;
    const content = draft.trim();

    // Agar session_id yo'q bo'lsa, avval yangi session yaratish (loading ko'rsatmasdan)
    let sessionId = currentSessionId;
    if (!sessionId) {
      try {
        // Session yaratish - loading ko'rsatilmaydi, orqada o'zi bajarsin
        const response = await chatApi.createSession();
        sessionId = response.session_id;
        setCurrentSessionId(sessionId);
        // URL ni yangilash
        navigate(`?chat=${sessionId}`, { replace: true });
      } catch (err: any) {
        const errorMessage =
          err.response?.data?.message || err.message || 'Xatolik yuz berdi';
        setError(errorMessage);
        notifications.show({
          title: 'Xatolik',
          message: errorMessage,
          color: 'red',
        });
        return;
      }
    }

    // User xabarini darhol qo'shish
    const userMsg: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setDraft('');
    setIsLoading(true); // Faqat xabar yuborilganda loading ko'rsatiladi
    setError(null);

    try {
      // ChatGPT-style messages array yaratish
      const messagesForApi = [
        ...messages.map((msg) => ({
          role: msg.role as 'user' | 'assistant' | 'system',
          content: msg.content,
        })),
        {
          role: 'user' as const,
          content,
        },
      ];

      // API ga xabar yuborish (ChatGPT formatida)
      const response = await chatApi.sendMessage({
        session_id: sessionId,
        messages: messagesForApi,
        model: 'gpt-3.5-turbo', // Backend'ga mos model nomi
      });

      // ChatGPT-style response'dan AI javobini olish
      const assistantMessage =
        response.choices?.[0]?.message ||
        response.message ||
        (response.reply
          ? { role: 'assistant' as const, content: response.reply }
          : null);

      if (!assistantMessage) {
        throw new Error('AI javob olinmadi');
      }

      const replyContent = assistantMessage.content || '';
      const assistantMsg: Message = {
        id:
          response.id ||
          response.message?.id ||
          `msg_${Date.now()}_${Math.random()}`,
        role: 'assistant',
        content: replyContent,
        timestamp:
          response.message?.timestamp ||
          (response.created
            ? response.created * 1000
            : response.message?.created_at
              ? new Date(response.message.created_at).getTime()
              : Date.now()),
      };

      setMessages((prev) => {
        const newMessages = [...prev, assistantMsg];

        // Agar bu birinchi AI javobi bo'lsa (faqat user va assistant xabarlari bor), chat nomini yangilash va tarixga qo'shish
        if (prev.length === 1 && replyContent) {
          const chatTitle = generateChatTitle(replyContent);
          // Sidebar'ga chat nomini yangilash va tarixga qo'shish uchun event yuborish
          window.dispatchEvent(
            new CustomEvent('addChatToHistory', {
              detail: { sessionId: sessionId, title: chatTitle },
            })
          );
        }

        return newMessages;
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
      // Xatolik bo'lganda user xabarini olib tashlash (yoki qoldirish mumkin)
    } finally {
      setIsLoading(false);
    }
  };

  // Chat nomini AI javobidan olish funksiyasi
  const generateChatTitle = (content: string): string => {
    // Matndan birinchi 3-5 so'zni olish
    const words = content.trim().split(/\s+/).slice(0, 5);
    return words.join(' ') || 'Yangi chat';
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
    // Textarea'ga focus qilish
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  return (
    <Box className={styles.container}>
      {/* Messages Area */}
      {hasMessages || isLoading ? (
        <ScrollArea className={styles.messagesArea} scrollbarSize={12}>
          <Stack gap="md" className={styles.messagesList}>
            <AnimatePresence mode="popLayout">
              {messages.map((message) => {
                const isCopied = copiedMessageId === message.id;
                return (
                  <Box
                    key={message.id}
                    style={{ position: 'relative' }}
                    onMouseEnter={(e) => {
                      const actionsBox = e.currentTarget.querySelector(
                        '[data-message-actions]'
                      ) as HTMLElement;
                      if (actionsBox) {
                        actionsBox.style.opacity = '1';
                      }
                    }}
                    onMouseLeave={(e) => {
                      const actionsBox = e.currentTarget.querySelector(
                        '[data-message-actions]'
                      ) as HTMLElement;
                      if (actionsBox) {
                        actionsBox.style.opacity = '0';
                      }
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className={
                        message.role === 'user'
                          ? styles.userMessage
                          : styles.assistantMessage
                      }
                    >
                      <Box className={styles.messageContent}>
                        <Text className={styles.messageText}>
                          {message.content}
                        </Text>
                      </Box>
                    </motion.div>
                    {/* Copy va Edit tugmalari - absolute position, hover qilganda ko'rsatiladi */}
                    <Box
                      data-message-actions
                      style={{
                        position: 'absolute',
                        bottom: '-25px',
                        right: message.role === 'user' ? '8px' : 'auto',
                        left: message.role === 'user' ? 'auto' : '8px',
                        display: 'flex',
                        gap: '8px',
                        justifyContent:
                          message.role === 'user' ? 'flex-end' : 'flex-start',
                        opacity: 0,
                        transition: 'opacity 0.2s ease',
                        zIndex: 10,
                      }}
                    >
                      <ActionIcon
                        variant="subtle"
                        size="sm"
                        onClick={() =>
                          handleCopyMessage(message.content, message.id)
                        }
                        aria-label="Copy message"
                        color={isCopied ? 'green' : undefined}
                      >
                        {isCopied ? (
                          <MdCheck size={16} />
                        ) : (
                          <MdContentCopy size={16} />
                        )}
                      </ActionIcon>
                      {/* Edit tugmasi faqat user xabarlarida */}
                      {message.role === 'user' && (
                        <ActionIcon
                          variant="subtle"
                          size="sm"
                          onClick={() => handleEditMessage(message.content)}
                          aria-label="Edit message"
                        >
                          <MdEdit size={16} />
                        </ActionIcon>
                      )}
                    </Box>
                  </Box>
                );
              })}
            </AnimatePresence>

            {/* Loading Indicator */}
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={styles.assistantMessage}
              >
                <Box className={styles.messageContent}>
                  <Box className={styles.typingIndicator}>
                    <span />
                    <span />
                    <span />
                  </Box>
                </Box>
              </motion.div>
            )}

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

      {/* Error message in messages area */}
      {error && hasMessages && (
        <Box p="md" className={styles.errorBanner}>
          <Text c="red" size="sm">
            {error}
          </Text>
        </Box>
      )}

      {/* Input Area */}
      <Box className={styles.inputArea}>
        <motion.div
          layout
          transition={{
            layout: { duration: 0.3, ease: [0.16, 1, 0.3, 1] },
          }}
          animate={{
            borderRadius: isComposerExpanded ? 20 : 18,
            padding: isComposerExpanded ? '12px' : '8px',
          }}
          className={`${styles.composer} ${
            isComposerExpanded
              ? styles.composerExpanded
              : styles.composerCollapsed
          }`}
        >
          <ActionIcon
            className={styles.plusBtn}
            size="lg"
            radius="xl"
            variant="subtle"
            aria-label="Qo'shish"
          >
            <MdAttachFile size={18} />
          </ActionIcon>

          <Box className={styles.textareaWrap}>
            <Textarea
              ref={(node) => {
                // Mantine Textarea ref'ni textarea elementga bog'laydi
                textareaRef.current = node;
              }}
              value={draft}
              onChange={(e) => setDraft(e.currentTarget.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              autosize
              minRows={1}
              maxRows={6}
              placeholder="Xabar yozing..."
              classNames={{ input: styles.textareaInput }}
            />
          </Box>

          <Box className={styles.actions}>
            <ActionIcon
              className={styles.micBtn}
              size="lg"
              radius="xl"
              variant="subtle"
              aria-label="Ovoz"
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
        </motion.div>
      </Box>
    </Box>
  );
}

export default AiAssistant;
