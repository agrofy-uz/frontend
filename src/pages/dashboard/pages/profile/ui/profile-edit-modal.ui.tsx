import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Group,
  Image,
  Paper,
  Stack,
  Text,
  TextInput,
  ThemeIcon,
  UnstyledButton,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  FaCheckCircle,
  FaExclamationCircle,
  FaTrash,
  FaUndo,
  FaUpload,
  FaUser,
} from 'react-icons/fa';
import {
  getAuthMe,
  mapAuthMeToUser,
  updateProfileEdit,
  type AuthMeResponse,
  type ProfileEditResponse,
} from '@/shared/api';
import { useAuthStore } from '@/shared/store/authStore';
import { openNotification } from '@/shared/lib/notification';
import { getErrorMessage } from '@/shared/ui/login-modal/login-modal.const';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Modal } from '@/shared/ui/modal';

const MOBILE_BOTTOM_SHEET_MQ = '(max-width: 48em)';
const IMAGE_ACCEPT = 'image/png,image/jpeg,image/jpg,image/webp';
const MAX_IMAGE_BYTES = 10 * 1024 * 1024;

function isAuthMeResponse(v: ProfileEditResponse): v is AuthMeResponse {
  return (
    v != null &&
    typeof v === 'object' &&
    'id' in v &&
    typeof (v as AuthMeResponse).id === 'number'
  );
}

function displayNameFromUser(user: {
  first_name: string | null;
  last_name: string | null;
}) {
  return [user.first_name, user.last_name].filter(Boolean).join(' ').trim();
}

function validateImageFile(file: File): string | null {
  if (!file.type.startsWith('image/')) {
    return 'Faqat rasm fayli tanlansin';
  }
  if (file.size > MAX_IMAGE_BYTES) {
    return 'Rasm 10 MB dan kichik bo‘lsin';
  }
  return null;
}

export type ProfileEditModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function ProfileEditModal({ opened, onClose }: ProfileEditModalProps) {
  const queryClient = useQueryClient();
  const { user, updateUser } = useAuthStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const isMobileBottomSheet = useMediaQuery(MOBILE_BOTTOM_SHEET_MQ, false, {
    getInitialValueInEffect: true,
  });

  const [name, setName] = useState('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageRemoved, setImageRemoved] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const originalPhotoUrl = useMemo(
    () => (user?.photo_url?.trim() ? user.photo_url.trim() : ''),
    [user?.photo_url]
  );

  const applyPickedFile = useCallback((file: File | undefined | null) => {
    if (!file) return;
    const err = validateImageFile(file);
    if (err) {
      openNotification({
        title: err,
        type: 'warning',
        icon: <FaExclamationCircle size={24} />,
      });
      return;
    }
    setImageFile(file);
    setImageRemoved(false);
  }, []);

  useEffect(() => {
    if (!opened || !user) return;
    setName(displayNameFromUser(user) || '');
    setImageFile(null);
    setImageRemoved(false);
    setPreviewUrl(null);
    setDragOver(false);
  }, [opened, user]);

  useEffect(() => {
    if (!imageFile) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(imageFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [imageFile]);

  const avatarSrc = previewUrl
    ? previewUrl
    : imageRemoved
      ? undefined
      : originalPhotoUrl || undefined;

  const mutation = useMutation({
    mutationFn: async () => {
      const token = useAuthStore.getState().accessToken;
      if (!token) throw new Error('Sessiya topilmadi');
      const trimmedName = name.trim();
      if (!trimmedName) throw new Error('Ismni kiriting');

      if (imageFile) {
        return updateProfileEdit({
          firstName: trimmedName,
          image: '',
          imageFile,
        });
      }

      const imagePayload = imageRemoved ? '' : originalPhotoUrl;

      return updateProfileEdit({
        firstName: trimmedName,
        image: imagePayload,
      });
    },
    onSuccess: async (data) => {
      const token = useAuthStore.getState().accessToken;
      if (isAuthMeResponse(data)) {
        updateUser(mapAuthMeToUser(data));
      } else if (token) {
        const me = await getAuthMe();
        updateUser(mapAuthMeToUser(me));
      }
      await queryClient.invalidateQueries({ queryKey: ['auth', 'me'] });
      openNotification({
        title: 'Profil saqlandi',
        type: 'success',
        icon: <FaCheckCircle size={24} />,
      });
      onClose();
    },
    onError: (err: unknown) => {
      openNotification({
        title: getErrorMessage(err),
        type: 'error',
        icon: <FaExclamationCircle size={24} />,
      });
    },
  });

  const openFilePicker = () => fileInputRef.current?.click();

  const hasPreviewImage = Boolean(avatarSrc);

  const showRedRemove =
    hasPreviewImage &&
    (Boolean(imageFile) ||
      (Boolean(originalPhotoUrl) && !imageRemoved));

  const handleRedRemove = () => {
    if (imageFile) {
      setImageFile(null);
      return;
    }
    if (originalPhotoUrl && !imageRemoved) {
      setImageRemoved(true);
    }
  };

  const canRestorePhoto =
    imageRemoved && Boolean(originalPhotoUrl) && !imageFile;

  const formContent = !user ? (
    <Text size="sm" c="dimmed">
      Foydalanuvchi ma’lumoti topilmadi.
    </Text>
  ) : (
    <>
      <Paper withBorder p="lg" radius="md" shadow="xs">
        <Text fw={600} size="xs" tt="uppercase" c="dimmed" mb="md">
          Profil rasmi
        </Text>
        <Stack gap="sm" align="stretch">
          <input
            ref={fileInputRef}
            type="file"
            accept={IMAGE_ACCEPT}
            style={{ display: 'none' }}
            onChange={(e) => {
              const f = e.target.files?.[0];
              applyPickedFile(f ?? null);
              e.target.value = '';
            }}
          />

          <Box
            style={{
              borderRadius: 'var(--mantine-radius-md)',
              overflow: 'hidden',
              minHeight: 220,
              border:
                dragOver && hasPreviewImage
                  ? '2px solid var(--mantine-color-green-filled)'
                  : hasPreviewImage
                    ? '1px solid var(--mantine-color-default-border)'
                    : dragOver
                      ? '2px solid var(--mantine-color-green-filled)'
                      : '2px dashed var(--mantine-color-default-border)',
              background:
                !hasPreviewImage && dragOver
                  ? 'light-dark(var(--mantine-color-green-0), rgba(34, 139, 34, 0.12))'
                  : 'light-dark(var(--mantine-color-gray-0), var(--mantine-color-dark-6))',
              transition: 'border-color 0.15s ease, background 0.15s ease',
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={(e) => {
              e.preventDefault();
              if (!e.currentTarget.contains(e.relatedTarget as Node)) {
                setDragOver(false);
              }
            }}
            onDrop={(e) => {
              e.preventDefault();
              setDragOver(false);
              const f = e.dataTransfer.files?.[0];
              applyPickedFile(f ?? null);
            }}
          >
            {hasPreviewImage ? (
              <Image
                src={avatarSrc}
                alt="Profil rasmi"
                h={220}
                w="100%"
                fit="cover"
              />
            ) : (
              <UnstyledButton
                type="button"
                onClick={openFilePicker}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  minHeight: 220,
                  width: '100%',
                  cursor: 'pointer',
                }}
              >
                <Stack align="center" gap="xs" px="md">
                  <ThemeIcon size={64} radius="xl" variant="light" color="gray">
                    <FaUpload size={26} />
                  </ThemeIcon>
                  <Text size="sm" fw={600}>
                    Rasmni tanlash
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    Shu yerga torting yoki bosing
                  </Text>
                </Stack>
              </UnstyledButton>
            )}
          </Box>

          {showRedRemove ? (
            <Button
              type="button"
              color="red"
              variant="light"
              size="sm"
              leftSection={<FaTrash size={14} />}
              onClick={() => handleRedRemove()}
            >
              Olib tashlash
            </Button>
          ) : null}

          {canRestorePhoto ? (
            <Button
              type="button"
              variant="light"
              color="blue"
              size="sm"
              fullWidth
              leftSection={<FaUndo size={14} />}
              onClick={() => {
                setImageRemoved(false);
              }}
            >
              Orqaga qaytarish
            </Button>
          ) : null}
        </Stack>
      </Paper>

      <Paper withBorder p="lg" radius="md" shadow="xs">
        <Text fw={600} size="xs" tt="uppercase" c="dimmed" mb="md">
          Shaxsiy ma’lumot
        </Text>
        <TextInput
          label="To‘liq ism"
          placeholder="Ism va familiya"
          value={name}
          onChange={(e) => setName(e.currentTarget.value)}
          leftSection={<FaUser size={14} />}
          required
          size="md"
        />
      </Paper>
    </>
  );

  const actionFooter = (
    <Group
      justify="flex-end"
      gap="sm"
      grow={isMobileBottomSheet}
      wrap={isMobileBottomSheet ? 'nowrap' : 'wrap'}
    >
      <Button
        variant="default"
        onClick={onClose}
        disabled={mutation.isPending}
        size={isMobileBottomSheet ? 'md' : 'sm'}
        fullWidth={isMobileBottomSheet}
      >
        Bekor qilish
      </Button>
      <Button
        color="green"
        loading={mutation.isPending}
        disabled={!user || !name.trim()}
        onClick={() => void mutation.mutateAsync()}
        size={isMobileBottomSheet ? 'md' : 'sm'}
        fullWidth={isMobileBottomSheet}
      >
        Saqlash
      </Button>
    </Group>
  );

  if (isMobileBottomSheet) {
    return (
      <BottomSheet
        opened={opened}
        onClose={onClose}
        zIndex={1002}
        hiddenTitle="Profilni tahrirlash"
        size="min(92dvh, 640px)"
        footer={user ? actionFooter : undefined}
      >
        <Stack gap="lg" pb="md">
          <Text fw={700} size="lg" lh={1.25}>
            Profilni tahrirlash
          </Text>
          {formContent}
        </Stack>
      </BottomSheet>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Profilni tahrirlash"
      radius="md"
      size="min(100%, 480px)"
    >
      <Stack gap="lg">
        {formContent}
        {user ? (
          <>
            <Divider />
            {actionFooter}
          </>
        ) : null}
      </Stack>
    </Modal>
  );
}
