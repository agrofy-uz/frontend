import {
  Box,
  Textarea,
  ActionIcon,
  ScrollArea,
  Stack,
  Text,
} from '@mantine/core';
import { useLocation } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { IoMdSend } from 'react-icons/io';
import styles from './ai-assistant.module.css';

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
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

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

  // Scroll to bottom
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, chatId]);

  const currentMessages = chatId ? messages[chatId] || [] : [];

  const handleSend = async () => {
    if (!inputValue.trim() || !chatId || isLoading) return;

    const userMessage: Message = {
      id: makeMessageId(),
      role: 'user',
      content: inputValue.trim(),
      timestamp: Date.now(),
    };

    // User message'ni qo'shish
    setMessages((prev) => ({
      ...prev,
      [chatId]: [...(prev[chatId] || []), userMessage],
    }));

    setInputValue('');
    setIsLoading(true);

    // Simulate AI response (keyin API bilan almashtiriladi)
    setTimeout(() => {
      const aiMessage: Message = {
        id: makeMessageId(),
        role: 'assistant',
        content: `Bu demo javob. Sizning xabaringiz: "${userMessage.content}". Bu yerda AI API javobini qo'yishingiz mumkin.`,
        timestamp: Date.now(),
      };

      setMessages((prev) => ({
        ...prev,
        [chatId]: [...(prev[chatId] || []), aiMessage],
      }));

      setIsLoading(false);
    }, 1000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
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
      <ScrollArea className={styles.messagesArea} scrollbarSize={6}>
        <Stack gap="md" p="md" className={styles.messagesList}>
          {currentMessages.length === 0 ? (
            <Box className={styles.emptyChat}>
              <Text className={styles.emptyChatText}>
                Yangi suhbatni boshlang
              </Text>
            </Box>
          ) : (
            <AnimatePresence>
              {currentMessages.map((message, index) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
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
          )}

          {isLoading && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className={styles.assistantMessage}
            >
              <Box className={styles.messageContent}>
                <Box className={styles.typingIndicator}>
                  <span></span>
                  <span></span>
                  <span></span>
                </Box>
              </Box>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </Stack>
      </ScrollArea>

      {/* Input Area */}
      <Box className={styles.inputArea}>
        <Textarea
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="Xabar yozing..."
          minRows={1}
          maxRows={4}
          autosize
          className={styles.textarea}
          disabled={isLoading}
          rightSection={
            <ActionIcon
              variant="filled"
              color="green"
              onClick={handleSend}
              disabled={!inputValue.trim() || isLoading}
              className={styles.sendButton}
            >
              <IoMdSend size={20} />
            </ActionIcon>
          }
          rightSectionWidth={50}
          styles={{
            input: {
              paddingRight: '60px',
            },
          }}
        />
      </Box>
    </Box>
  );
}

export default AiAssistant;
