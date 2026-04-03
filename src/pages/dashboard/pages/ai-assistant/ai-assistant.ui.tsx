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
import { useState, useEffect, useRef, useLayoutEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BsMicMuteFill } from 'react-icons/bs';
import { IoArrowUp } from 'react-icons/io5';
import {
  MdAttachFile,
  MdContentCopy,
  MdEdit,
  MdCheck,
  MdClose,
} from 'react-icons/md';
import { notifications } from '@mantine/notifications';
import styles from './ai-assistant.module.css';
import { chatApi, type ChatMessage } from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import {
  MAX_TEXTAREA_HEIGHT,
  MESSAGE_ANIMATION_VARIANTS,
  TYPING_DOT_ANIMATION,
} from './ai-assistant.const';
import { VoiceModal } from './ui/voice-modal/voice-modal.ui';
import { AttachMenu } from './ui/attach-menu';

type Message = ChatMessage & {
  id: string;
  timestamp: number;
};

function AiAssistant() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuthStore();
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
  const [voiceModalOpened, setVoiceModalOpened] = useState(false);
  const [attachMenuOpened, setAttachMenuOpened] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [imageUrls, setImageUrls] = useState<(string | null)[]>([]);

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

  // Session yaratish yoki mavjud session history yuklash
  useEffect(() => {
    const initializeSession = async () => {
      setIsInitializing(true);
      setError(null);

      try {
        if (urlSessionId) {
          setCurrentSessionId(urlSessionId);
          const historyMessages = await chatApi.getChatMessages(urlSessionId);
          const formattedMessages: Message[] = historyMessages.map((msg) => ({
            id: msg.id || `msg_${Date.now()}_${Math.random()}`,
            role: msg.role,
            content: msg.text,
            timestamp: msg.createdAt ? new Date(msg.createdAt).getTime() : Date.now(),
          }));
          setMessages(formattedMessages);
        } else {
          setCurrentSessionId(null);
          setMessages([]);
          if (user?.id) {
            const createdChat = await chatApi.createChat({ userId: user.id });
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
  }, [urlSessionId, user?.id, navigate]);

  // Chat history ni backenddan olib, sidebar tarixiga ulash
  useEffect(() => {
    if (!user?.id) return;

    const loadChatHistory = async () => {
      try {
        const chats = await chatApi.getChatHistory(user.id);
        chats.forEach((chat) => {
          if (!chat.title?.trim()) return;
          window.dispatchEvent(
            new CustomEvent('addChatToHistory', {
              detail: { sessionId: chat.chatId, title: chat.title },
            })
          );
        });
      } catch (err) {
        // History yuklanmasa, chat ishlashiga ta'sir qilmasin
      }
    };

    loadChatHistory();
  }, [user?.id]);

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

    try {
      const response = await chatApi.sendChatMessage(chatId, {
        userId: user.id,
        text: content,
        role: 'user',
      });

      if (response.role === 'assistant' && response.text?.trim()) {
        const assistantMsg: Message = {
          id: response.id || `msg_${Date.now()}_${Math.random()}`,
          role: 'assistant',
          content: response.text,
          timestamp: response.createdAt
            ? new Date(response.createdAt).getTime()
            : Date.now(),
        };
        setMessages((prev) => [...prev, assistantMsg]);
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
      // Xatolik bo'lganda user xabarini olib tashlash (yoki qoldirish mumkin)
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
    // Textarea'ga focus qilish
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };

  const handleVoiceTranscribed = (text: string) => {
    setDraft((prev) => (prev ? `${prev} ${text}` : text));
  };

  return (
    <Box
      className={`${styles.container} ${messages.length === 0 ? styles.containerCentered : ''}`}
    >
      {/* Messages Area */}
      {hasMessages || isLoading ? (
        <ScrollArea className={styles.messagesArea} scrollbarSize={12}>
          <Stack gap="md" className={styles.messagesList}>
            <AnimatePresence mode="popLayout">
              {messages.map((message) => {
                const isUser = message.role === 'user';
                const isCopied = copiedMessageId === message.id;

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
                        <Text className={styles.messageText}>
                          {message.content}
                        </Text>
                      </Box>

                      {/* Copy va Edit tugmalari — xabarga hover qilganda chiqadi */}
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
                              onClick={() => handleEditMessage(message.content)}
                              aria-label="Edit message"
                              className={styles.actionIcon}
                            >
                              <MdEdit size={20} />
                            </ActionIcon>
                          </Tooltip>
                        )}
                      </Box>
                    </Box>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {isLoading && (
              <motion.div
                {...TYPING_DOT_ANIMATION}
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

      {/* Input Area */}
      <Box
        className={`${styles.inputArea} ${messages.length === 0 ? styles.inputAreaCentered : ''}`}
      >
        <div className={styles.composer}>
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
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              rows={1}
              placeholder="Xabar yozing..."
              className={styles.textareaInput}
            />
          </Box>

          <Box className={styles.actionsContainer}>
            <AttachMenu
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
            </AttachMenu>

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
