import { ActionIcon, Box, Button, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { BsArrowLeft, BsPlus, BsThreeDots, BsPinAngle } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from './ai-sidebar.module.css';

type ChatItem = {
  id: string;
  title: string;
  updatedAt: number;
  pinned?: boolean;
};

const STORAGE_KEY = 'agrofy_ai_chats_v1';

function safeParse<T>(value: string | null, fallback: T): T {
  if (!value) return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}

function makeChatId() {
  return `chat_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export default function AiSidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();

  const [historyOpen, { toggle: toggleHistoryOpen }] = useDisclosure(true);
  const [chatPopovers, setChatPopovers] = useState<Record<string, boolean>>({});

  const [chats, setChats] = useState<ChatItem[]>(() => {
    const initial = safeParse<ChatItem[]>(
      localStorage.getItem(STORAGE_KEY),
      []
    );
    return Array.isArray(initial) ? initial : [];
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chats));
  }, [chats]);

  const activeChatId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('chat') || null;
  }, [location.search]);

  const openChat = (id: string) => {
    navigate({ pathname: '/dashboard/ai', search: `?chat=${id}` });
  };

  const createNewChat = () => {
    const id = makeChatId();
    const newChat: ChatItem = {
      id,
      title: 'New chat',
      updatedAt: Date.now(),
    };
    setChats((prev) => [newChat, ...prev]);
    openChat(id);
  };

  const toggleChatPopover = (chatId: string, open?: boolean) => {
    setChatPopovers((prev) => ({
      ...prev,
      [chatId]: open !== undefined ? open : !prev[chatId],
    }));
  };

  const handlePinChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId ? { ...chat, pinned: !chat.pinned } : chat
      )
    );
    toggleChatPopover(chatId, false);
  };

  const handleDeleteChat = (chatId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setChats((prev) => prev.filter((chat) => chat.id !== chatId));
    if (activeChatId === chatId) {
      navigate({ pathname: '/dashboard/ai', search: '' });
    }
    toggleChatPopover(chatId, false);
  };

  // Pinned chatlar birinchi bo'lib, keyin boshqalar
  const sortedChats = useMemo(() => {
    return [...chats].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [chats]);

  return (
    <Box className={styles.root}>
      {!collapsed && (
        <Box className={styles.topRow}>
          <Text className={styles.title}>AI Assistant</Text>
        </Box>
      )}

      <Box className={styles.backButton}>
        {collapsed ? (
          <ActionIcon
            variant="subtle"
            onClick={() => navigate('/dashboard/home')}
            aria-label="Back"
            w="100%"
          >
            <BsArrowLeft size={18} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            variant="subtle"
            leftSection={<BsArrowLeft size={16} />}
            onClick={() => navigate('/dashboard/home')}
            bd="2px solid var(--mantine-color-green-3)"
          >
            Orqaga qaytish
          </Button>
        )}
      </Box>

      <Box className={styles.newChatBtn}>
        {collapsed ? (
          <ActionIcon
            variant="light"
            color="green"
            onClick={createNewChat}
            aria-label="New chat"
            w="100%"
          >
            <BsPlus size={18} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            leftSection={<BsPlus size={16} />}
            color="green"
            onClick={createNewChat}
          >
            New chat
          </Button>
        )}
      </Box>

      {!collapsed && (
        <Box className={styles.historyHeaderRow}>
          <Text
            className={styles.historyHeaderText}
            onClick={toggleHistoryOpen}
            style={{ cursor: 'pointer' }}
          >
            Chat history
          </Text>
        </Box>
      )}

      {!collapsed && (
        <>
          <AnimatePresence initial={false}>
            {historyOpen && (
              <motion.div
                key="history"
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ overflow: 'hidden' }}
              >
                <Box className={styles.chatList}>
                  {sortedChats.length === 0 ? (
                    <Text size="sm" c="dimmed" p="sm">
                      No chats yet
                    </Text>
                  ) : (
                    sortedChats.map((c) => {
                      const isActive = activeChatId === c.id;
                      const popoverOpen = chatPopovers[c.id] || false;
                      return (
                        <div
                          key={c.id}
                          className={`${styles.chatItem} ${isActive ? styles.chatItemActive : ''} ${styles.chatItemWrapper}`}
                          onClick={() => openChat(c.id)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ')
                              openChat(c.id);
                          }}
                        >
                          <span className={styles.chatTitle}>{c.title}</span>
                          <Popover
                            opened={popoverOpen}
                            onChange={(o) => toggleChatPopover(c.id, o)}
                            position="right"
                            offset={8}
                            shadow="md"
                            withinPortal
                          >
                            <Popover.Target>
                              <ActionIcon
                                variant="subtle"
                                size="sm"
                                className={styles.chatItemDots}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  toggleChatPopover(c.id);
                                }}
                                aria-label="Chat options"
                              >
                                <BsThreeDots size={14} />
                              </ActionIcon>
                            </Popover.Target>
                            <Popover.Dropdown
                              className={styles.chatPopoverDropdown}
                            >
                              <div
                                className={styles.chatPopoverItem}
                                onClick={(e) => handlePinChat(c.id, e)}
                              >
                                <BsPinAngle size={14} />
                                <span>
                                  {c.pinned
                                    ? 'Qadashdan olib tashlash'
                                    : 'Qadash'}
                                </span>
                              </div>
                              <div
                                className={styles.chatPopoverItem}
                                onClick={(e) => handleDeleteChat(c.id, e)}
                              >
                                <HiOutlineTrash size={16} />
                                <span>O'chirish</span>
                              </div>
                            </Popover.Dropdown>
                          </Popover>
                        </div>
                      );
                    })
                  )}
                </Box>
              </motion.div>
            )}
          </AnimatePresence>
        </>
      )}
    </Box>
  );
}
