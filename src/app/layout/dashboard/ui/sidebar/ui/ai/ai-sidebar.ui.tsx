import { ActionIcon, Box, Button, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useMemo, useState } from 'react';
import { BsArrowLeft, BsPlus, BsThreeDots, BsPinAngle } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatApi } from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import styles from './ai-sidebar.module.css';

type ChatItem = {
  id: string;
  title: string;
  updatedAt: number;
  pinned?: boolean;
};

export default function AiSidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [historyOpen, { toggle: toggleHistoryOpen }] = useDisclosure(true);
  const [chatPopovers, setChatPopovers] = useState<Record<string, boolean>>({});

  const [chats, setChats] = useState<ChatItem[]>([]);

  // Chat nomini yangilash va chat qo'shish uchun event listener
  useEffect(() => {
    const handleAddChatToHistory = (
      event: CustomEvent<{ sessionId: string; title: string }>
    ) => {
      const { sessionId, title } = event.detail;
      setChats((prev) => {
        // Agar chat allaqachon mavjud bo'lsa, faqat nomini yangilash
        if (prev.some((chat) => chat.id === sessionId)) {
          return prev.map((chat) =>
            chat.id === sessionId
              ? { ...chat, title, updatedAt: Date.now() }
              : chat
          );
        }
        // Yangi chat qo'shish (faqat birinchi xabar yuborilgandan keyin)
        return [
          {
            id: sessionId,
            title,
            updatedAt: Date.now(),
          },
          ...prev,
        ];
      });
    };

    window.addEventListener(
      'addChatToHistory',
      handleAddChatToHistory as EventListener
    );
    return () => {
      window.removeEventListener(
        'addChatToHistory',
        handleAddChatToHistory as EventListener
      );
    };
  }, []);

  const activeChatId = useMemo(() => {
    const params = new URLSearchParams(location.search);
    return params.get('chat') || null;
  }, [location.search]);

  const openChat = (id: string) => {
    navigate({ pathname: '/dashboard/ai', search: `?chat=${id}` });
  };

  const createNewChat = async () => {
    if (!user?.id) {
      navigate({ pathname: '/dashboard/ai', search: '' });
      return;
    }
    try {
      const createdChat = await chatApi.createChat({ userId: user.id });
      if (!createdChat.chatId) {
        navigate({ pathname: '/dashboard/ai', search: '' });
        return;
      }
      if (createdChat.title?.trim()) {
        window.dispatchEvent(
          new CustomEvent('addChatToHistory', {
            detail: { sessionId: createdChat.chatId, title: createdChat.title },
          })
        );
      }
      navigate({ pathname: '/dashboard/ai', search: `?chat=${createdChat.chatId}` });
    } catch {
      navigate({ pathname: '/dashboard/ai', search: '' });
    }
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

  // Faqat title bo'lgan chatlarni ko'rsatish (bo'sh title'lilar tarixda ko'rinmaydi)
  const visibleChats = useMemo(() => {
    return chats.filter((chat) => chat.title.trim() !== '');
  }, [chats]);

  // Pinned chatlar birinchi bo'lib, keyin boshqalar
  const sortedChats = useMemo(() => {
    return [...visibleChats].sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return b.updatedAt - a.updatedAt;
    });
  }, [visibleChats]);

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
            h={36}
            bd="1.5px solid var(--mantine-color-green-3)"
          >
            <BsArrowLeft size={18} />
          </ActionIcon>
        ) : (
          <Button
            fullWidth
            h={36}
            variant="subtle"
            leftSection={<BsArrowLeft size={16} />}
            onClick={() => navigate('/dashboard/home')}
            bd="1.5px solid var(--mantine-color-green-3)"
          >
            Orqaga qaytish
          </Button>
        )}
      </Box>

      <Box className={styles.newChatBtn}>
        {collapsed ? (
          <ActionIcon
            h={36}
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
            h={36}
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
