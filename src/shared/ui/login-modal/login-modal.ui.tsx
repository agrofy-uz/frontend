import { useState } from 'react';
import {
  Modal,
  Stack,
  Text,
  Button as MantineButton,
  Alert,
  Group,
  Anchor,
  Skeleton,
} from '@mantine/core';
import { Button } from '@/shared/ui/button';
import { FaCheckCircle, FaTelegram, FaTimesCircle } from 'react-icons/fa';
import { authApi } from '@/shared/api/auth';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import { OtpInput } from './components/otp-input';
import {
  TELEGRAM_BOT_USERNAME,
  getErrorMessage,
  getTelegramBotLink,
} from './login-modal.const';
import type { ViewState } from './login-modal.const';
import { openNotification } from '@/shared/lib/notification';

interface LoginModalProps {
  opened: boolean;
  onClose: () => void;
}

export function LoginModal({ opened, onClose }: LoginModalProps) {
  const [viewState, setViewState] = useState<ViewState>('initial');
  const [loginSessionId, setLoginSessionId] = useState<string | null>(null);
  const [otp, setOtp] = useState('');
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { login } = useAuthStore();

  // Session boshlash
  const handleStartSession = async () => {
    setError(null);
    setViewState('loading');

    try {
      const response = await authApi.startSession();
      setLoginSessionId(response.login_session_id);
      setViewState('otp');
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setViewState('error');
      openNotification({
        title: errorMessage,
        type: 'error',
        icon: <FaTimesCircle size={24} />,
      });
    }
  };

  // OTP tasdiqlash
  const handleOtpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!loginSessionId) {
      setError('Session topilmadi. Qayta boshlang.');
      return;
    }

    if (otp.length !== 6) {
      setError("OTP kodni to'liq kiriting");
      return;
    }

    setViewState('loading');

    try {
      const response = await authApi.verifyOtp(loginSessionId, otp);

      if (response.user && response.access_token && response.refresh_token) {
        // API response'ni authStore formatiga transform qilish
        const nameParts = response.user.name?.split(' ') || [];
        const userData = {
          id: response.user.id,
          phone_number: response.user.phone || '',
          telegram_id: response.user.telegram_id || 0,
          first_name: nameParts[0] || null,
          last_name: nameParts.slice(1).join(' ') || null,
          username: response.user.username || null,
          created_at: response.user.created_at || null,
          is_active: response.user.is_active ?? true,
        };

        // Auth store'ga saqlash
        login(userData, response.access_token, response.refresh_token);

        openNotification({
          title: 'Muvaffaqiyatli kirildi!',
          type: 'success',
          icon: <FaCheckCircle size={24} />,
        });

        // Modal'ni yopish
        onClose();

        // Redirect qilish
        navigate('/dashboard');
      }
    } catch (err: unknown) {
      const errorMessage = getErrorMessage(err);
      setError(errorMessage);
      setViewState('error');
      openNotification({
        title: errorMessage,
        type: 'error',
        icon: <FaTimesCircle size={24} />,
      });

      // Agar 404 bo'lsa, initial state'ga qaytish
      if (errorMessage === 'Session topilmadi. Qayta boshlang.') {
        setViewState('initial');
        setLoginSessionId(null);
      }
    }
  };

  const handleReset = () => {
    setViewState('initial');
    setLoginSessionId(null);
    setOtp('');
    setError(null);
  };

  const handleClose = () => {
    handleReset();
    onClose();
  };

  // Telegram bot link
  const telegramBotLink = getTelegramBotLink(loginSessionId);

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      title={
        <Text fw={600} fz="lg">
          Tizimga kirish
        </Text>
      }
      centered
      size="sm"
      radius="lg"
    >
      <Stack gap="md">
        {/* Initial state - Telegram orqali kirish tugmasi */}
        {viewState === 'initial' && (
          <Stack gap="md">
            <Text fz="sm" c="dimmed" ta="center">
              Telegram bot orqali tizimga kiring
            </Text>

            <Button
              onClick={handleStartSession}
              fullWidth
              size="md"
              leftSection={<FaTelegram size={18} />}
            >
              Telegram orqali kirish
            </Button>
          </Stack>
        )}

        {/* OTP input state */}
        {viewState === 'otp' && loginSessionId && (
          <form onSubmit={handleOtpSubmit}>
            <Stack gap="md">
              <Text fz="sm" c="dimmed" ta="center">
                Telegram botdan olgan OTP kodni kiriting
              </Text>

              <Alert color="blue" radius="md">
                <Stack gap="xs">
                  <Text fz="sm" fw={500}>
                    Telegram botga o'ting:
                  </Text>
                  <Anchor
                    href={telegramBotLink}
                    target="_blank"
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '8px',
                    }}
                  >
                    <FaTelegram size={20} />
                    <Text fz="sm" fw={500}>
                      @{TELEGRAM_BOT_USERNAME}
                    </Text>
                  </Anchor>
                </Stack>
              </Alert>

              <Stack gap="xs" align="center">
                <OtpInput value={otp} onChange={setOtp} disabled={false} />
              </Stack>

              {error && (
                <Alert color="red" radius="md">
                  <Text fz="sm">{error}</Text>
                </Alert>
              )}

              <Group gap="sm">
                <MantineButton
                  variant="subtle"
                  onClick={handleReset}
                  style={{ flex: 1 }}
                >
                  Orqaga
                </MantineButton>
                <Button
                  type="submit"
                  style={{ flex: 1 }}
                  size="md"
                  disabled={otp.length !== 6}
                >
                  Tasdiqlash
                </Button>
              </Group>
            </Stack>
          </form>
        )}

        {/* Loading state - skeleton */}
        {viewState === 'loading' && (
          <Stack gap="md">
            {/* Text skeleton */}
            <Skeleton height={20} width="80%" radius="sm" mx="auto" />

            {/* Bot alert skeleton */}
            <Skeleton height={60} radius="md" />

            {/* OTP inputs skeleton */}
            <Stack gap="xs" align="center">
              <Group gap="xs" justify="center">
                {[...Array(6)].map((_, i) => (
                  <Skeleton key={i} height={56} width={48} radius="md" />
                ))}
              </Group>
            </Stack>

            {/* Button skeleton */}
            <Skeleton height={44} radius="md" />
          </Stack>
        )}

        {/* Error state */}
        {viewState === 'error' && (
          <Stack gap="md" align="center">
            <Alert color="red" radius="md" style={{ width: '100%' }}>
              <Text fz="sm">
                {error || "Xatolik yuz berdi. Qayta urinib ko'ring."}
              </Text>
            </Alert>
            <Button onClick={handleReset} fullWidth>
              Qayta urinish
            </Button>
          </Stack>
        )}
      </Stack>
    </Modal>
  );
}
