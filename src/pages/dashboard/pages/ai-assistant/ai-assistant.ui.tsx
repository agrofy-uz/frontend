import {
  Box,
  Textarea,
  ActionIcon,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useMemo, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsMicMuteFill } from 'react-icons/bs';
import { IoArrowUp } from 'react-icons/io5';
import styles from './ai-assistant.module.css';
import { MdAttachFile } from 'react-icons/md';

type Message = {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
};

const MESSAGES_STORAGE_KEY = 'agrofy_ai_messages_v1';

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeMessageId() {
  return `msg_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function AiAssistant() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get('chat');

  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // localStorage'dan messages'larni o'qish
  useEffect(() => {
    const stored = safeParse<Record<string, Message[]>>(
      localStorage.getItem(MESSAGES_STORAGE_KEY),
      {}
    );
    setMessages(stored);
  }, []);

  // Messages o'zgarganda localStorage'ga saqlash
  useEffect(() => {
    localStorage.setItem(MESSAGES_STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  const currentMessages = useMemo(() => {
    return chatId ? messages[chatId] || [] : [];
  }, [messages, chatId]);

  const hasMessages = currentMessages.length > 0;

  // Scroll to bottom when messages change or loading state changes
  useEffect(() => {
    // Kichik kechikish bilan scroll qilish, DOM yangilanishini kutish uchun
    const timeoutId = setTimeout(() => {
      if (messagesEndRef.current) {
        messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
      }
    }, 50);

    return () => clearTimeout(timeoutId);
  }, [currentMessages.length, isLoading]);

  const isComposerExpanded = useMemo(() => {
    if (!draft) return false;
    if (draft.includes('\n')) return true;
    const el = textareaRef.current;
    if (!el) return false;
    // Autosize bo'lganda scrollHeight oshadi; 1 qatorlik holatni taxminiy 36-40px atrofida ushlaymiz.
    return el.scrollHeight >= 56;
  }, [draft]);

  const handleSend = async () => {
    if (!chatId || !draft.trim() || isLoading) return;
    const content = draft.trim();

    const newMsg: Message = {
      id: makeMessageId(),
      role: 'user',
      content,
      timestamp: Date.now(),
    };

    setMessages((prev) => {
      const next = { ...prev };
      const list = next[chatId] ? [...next[chatId]] : [];
      list.push(newMsg);
      next[chatId] = list;
      return next;
    });
    setDraft('');
    setIsLoading(true);

    // Mock API call - keyinroq real API bilan almashtiriladi
    setTimeout(() => {
      const assistantMsg: Message = {
        id: makeMessageId(),
        role: 'assistant',
        content: 'Bu mock javob. Keyinroq real API bilan almashtiriladi.',
        timestamp: Date.now(),
      };

      setMessages((prev) => {
        const next = { ...prev };
        const list = next[chatId] ? [...next[chatId]] : [];
        list.push(assistantMsg);
        next[chatId] = list;
        return next;
      });

      setIsLoading(false);
    }, 1500);
  };

  if (!chatId) {
    return (
      <Box className={styles.emptyState}>
        <Text className={styles.emptyStateText}>
          Chatni tanlang yoki yangi chat yarating
        </Text>
      </Box>
    );
  }

  return (
    <Box className={styles.container}>
      {/* Messages Area */}
      {hasMessages || isLoading ? (
        <ScrollArea className={styles.messagesArea} scrollbarSize={12}>
          <Stack gap="md" p="md" className={styles.messagesList}>
            <AnimatePresence mode="popLayout">
              {currentMessages.map((message) => (
                <motion.div
                  key={message.id}
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
              ))}
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
