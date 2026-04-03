import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type MouseEvent,
} from 'react';
import { ActionIcon, Box, Button, Popover, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { notifications } from '@mantine/notifications';
import { AnimatePresence, motion } from 'framer-motion';
import { BsArrowLeft, BsPlus, BsThreeDots, BsPinAngle } from 'react-icons/bs';
import { HiOutlineTrash } from 'react-icons/hi';
import { useLocation, useNavigate } from 'react-router-dom';
import { chatApi, type ChatHistoryItem } from '@/shared/api';
import {
  AI_CHATS_LIST_SYNC,
  startAiChatsHub,
  stopAiChatsHub,
} from '@/shared/lib/aiChatsHub';
import {
  isChatPinned,
  notifyChatPinnedChanged,
  removePinnedChat,
  togglePinnedChat,
} from '@/shared/lib/aiChatPinned';
import { useAuthStore } from '@/shared/store/authStore';
import {
  SIDEBAR_TITLE_ANIM_GATE_MS,
  sortAiSidebarChats,
  mapHistoryToSidebarItems,
  type AiSidebarChatItem,
} from './sidebar.const';
import styles from './sidebar.module.css';
import { SidebarRevealTitle } from './ui';

function useAiSidebarChats() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuthStore();

  const [chats, setChats] = useState<AiSidebarChatItem[]>([]);
  const [chatPopovers, setChatPopovers] = useState<Record<string, boolean>>({});
  const [titleAnimGate, setTitleAnimGate] = useState(false);
  const [titleRevealIds, setTitleRevealIds] = useState(() => new Set<string>());
  const seededKnownChatIdsRef = useRef(false);
  const knownChatIdsRef = useRef<Set<string>>(new Set());

  const activeChatId = useMemo(() => {
    return new URLSearchParams(location.search).get('chat');
  }, [location.search]);

  useEffect(() => {
    if (!user?.id) {
      setTitleAnimGate(false);
      seededKnownChatIdsRef.current = false;
      knownChatIdsRef.current = new Set();
      setTitleRevealIds(new Set());
      return;
    }
    seededKnownChatIdsRef.current = false;
    setTitleAnimGate(false);
    const t = window.setTimeout(
      () => setTitleAnimGate(true),
      SIDEBAR_TITLE_ANIM_GATE_MS
    );
    return () => clearTimeout(t);
  }, [user?.id]);

  useEffect(() => {
    if (!titleAnimGate) return;

    if (!seededKnownChatIdsRef.current) {
      if (chats.length === 0) return;
      seededKnownChatIdsRef.current = true;
      knownChatIdsRef.current = new Set(chats.map((c) => c.id));
      return;
    }

    const known = knownChatIdsRef.current;
    const currentIds = new Set(chats.map((c) => c.id));
    const fresh: string[] = [];
    for (const id of currentIds) {
      if (!known.has(id)) {
        fresh.push(id);
        known.add(id);
      }
    }
    for (const id of [...known]) {
      if (!currentIds.has(id)) known.delete(id);
    }
    if (fresh.length > 0) {
      setTitleRevealIds((prev) => {
        const next = new Set(prev);
        for (const fid of fresh) next.add(fid);
        return next;
      });
    }
  }, [chats, titleAnimGate]);

  useEffect(() => {
    if (!user?.id) return undefined;
    const uid = user.id;
    let cancelled = false;

    const loadHistoryFromApi = async () => {
      try {
        const list = await chatApi.getChatHistory(uid);
        if (cancelled) return;
        window.dispatchEvent(
          new CustomEvent(AI_CHATS_LIST_SYNC, {
            detail: { chats: list },
          })
        );
      } catch {
        /* */
      }
    };

    void loadHistoryFromApi();
    void startAiChatsHub(uid).catch(() => {});

    return () => {
      cancelled = true;
      void stopAiChatsHub();
    };
  }, [user?.id]);

  useEffect(() => {
    const onSync = (e: Event) => {
      const ce = e as CustomEvent<{ chats: ChatHistoryItem[] }>;
      setChats(mapHistoryToSidebarItems(ce.detail?.chats ?? []));
    };
    window.addEventListener(AI_CHATS_LIST_SYNC, onSync);
    return () => window.removeEventListener(AI_CHATS_LIST_SYNC, onSync);
  }, []);

  useEffect(() => {
    const handleAddChatToHistory = (
      event: CustomEvent<{ sessionId: string; title: string }>
    ) => {
      const { sessionId, title } = event.detail;
      setChats((prev) => {
        if (prev.some((chat) => chat.id === sessionId)) {
          return prev.map((chat) =>
            chat.id === sessionId
              ? {
                  ...chat,
                  title,
                  updatedAt: Date.now(),
                  pinned: isChatPinned(sessionId),
                }
              : chat
          );
        }
        return [
          {
            id: sessionId,
            title,
            updatedAt: Date.now(),
            pinned: isChatPinned(sessionId),
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

  const sortedChats = useMemo(() => {
    const visible = chats.filter((c) => c.title.trim() !== '');
    return sortAiSidebarChats(visible);
  }, [chats]);

  const openChat = useCallback(
    (id: string) => {
      navigate({ pathname: '/dashboard/ai', search: `?chat=${id}` });
    },
    [navigate]
  );

  const createNewChat = useCallback(async () => {
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
            detail: {
              sessionId: createdChat.chatId,
              title: createdChat.title,
            },
          })
        );
      }
      navigate({
        pathname: '/dashboard/ai',
        search: `?chat=${createdChat.chatId}`,
      });
    } catch {
      navigate({ pathname: '/dashboard/ai', search: '' });
    }
  }, [navigate, user?.id]);

  const toggleChatPopover = useCallback((chatId: string, open?: boolean) => {
    setChatPopovers((prev) => ({
      ...prev,
      [chatId]: open !== undefined ? open : !prev[chatId],
    }));
  }, []);

  const handlePinChat = useCallback((chatId: string, e: MouseEvent) => {
    e.stopPropagation();
    const pinned = togglePinnedChat(chatId);
    const now = Date.now();
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === chatId
          ? {
              ...chat,
              pinned,
              updatedAt: pinned ? now : chat.updatedAt,
            }
          : chat
      )
    );
    notifyChatPinnedChanged({ chatId, pinned });
    setChatPopovers((p) => ({ ...p, [chatId]: false }));
  }, []);

  const handleDeleteChat = useCallback(
    async (chatId: string, e: MouseEvent) => {
      e.stopPropagation();
      setChatPopovers((p) => ({ ...p, [chatId]: false }));
      if (!user?.id) {
        notifications.show({
          title: 'Xatolik',
          message: 'Foydalanuvchi aniqlanmadi',
          color: 'red',
        });
        return;
      }
      try {
        await chatApi.deleteChat(chatId, user.id);
        removePinnedChat(chatId);
        setTitleRevealIds((prev) => {
          const next = new Set(prev);
          next.delete(chatId);
          return next;
        });
        setChats((prev) => prev.filter((chat) => chat.id !== chatId));
        if (activeChatId === chatId) {
          navigate({ pathname: '/dashboard/ai', search: '' });
        }
        notifications.show({
          title: 'Chat o‘chirildi',
          message: 'Chat tarixdan muvaffaqiyatli olib tashlandi.',
          color: 'teal',
          autoClose: 4000,
        });
      } catch (err: unknown) {
        const ax = err as {
          response?: { data?: { message?: string } };
          message?: string;
        };
        const msg =
          ax.response?.data?.message ||
          ax.message ||
          'Chatni o‘chirib bo‘lmadi';
        notifications.show({
          title: 'Xatolik',
          message: msg,
          color: 'red',
        });
      }
    },
    [activeChatId, navigate, user?.id]
  );

  const completeTitleReveal = useCallback((chatId: string) => {
    setTitleRevealIds((prev) => {
      const next = new Set(prev);
      next.delete(chatId);
      return next;
    });
  }, []);

  return {
    sortedChats,
    activeChatId,
    chatPopovers,
    titleRevealIds,
    openChat,
    createNewChat,
    toggleChatPopover,
    handlePinChat,
    handleDeleteChat,
    completeTitleReveal,
  };
}

export default function AiSidebar({ collapsed }: { collapsed: boolean }) {
  const navigate = useNavigate();
  const [historyOpen, { toggle: toggleHistoryOpen }] = useDisclosure(true);

  const {
    sortedChats,
    activeChatId,
    chatPopovers,
    titleRevealIds,
    openChat,
    createNewChat,
    toggleChatPopover,
    handlePinChat,
    handleDeleteChat,
    completeTitleReveal,
  } = useAiSidebarChats();

  return (
    <Box className={styles.root}>
      {!collapsed && (
        <Box className={styles.topRow}>
          <Text className={styles.title}>AI yordamchi</Text>
        </Box>
      )}

      <Box className={styles.backButton}>
        {collapsed ? (
          <ActionIcon
            variant="subtle"
            onClick={() => navigate('/dashboard/home')}
            aria-label="Orqaga"
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
            aria-label="Yangi chat"
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
            Yangi chat
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
            Chat tarixi
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
                      Hozircha chat tarixi yo‘q
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
                          {c.pinned && (
                            <span
                              className={styles.chatPinIcon}
                              aria-hidden
                              title="Qadalgan chat"
                            >
                              <BsPinAngle size={14} />
                            </span>
                          )}
                          {titleRevealIds.has(c.id) ? (
                            <SidebarRevealTitle
                              className={styles.chatTitle}
                              text={c.title}
                              onComplete={() => completeTitleReveal(c.id)}
                            />
                          ) : (
                            <span className={styles.chatTitle}>{c.title}</span>
                          )}
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
                                aria-label="Chat parametrlari"
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
