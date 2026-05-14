import { useCallback, useMemo, useState } from 'react';
import {
  Box,
  Button,
  Divider,
  Group,
  Select,
  Stack,
  Text,
} from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { FaExternalLinkAlt, FaSignOutAlt, FaUser } from 'react-icons/fa';
import { HiLightningBolt } from 'react-icons/hi';
import { logoutAuth } from '@/shared/api';
import { changeLocale, type TLocale } from '@/shared/lib/language';
import { localStorageHelper } from '@/shared/lib/localStorage';
import { useAuthStore } from '@/shared/store/authStore';
import { useSettingsModalStore } from '@/shared/store/settingsModalStore';
import { usePricingModalStore } from '@/shared/store/pricingModalStore';
import {
  ColorScheme,
  type ColorSchemeType,
  useThemeStore,
} from '@/shared/store/themeStore';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Modal } from '@/shared/ui/modal';
import { Segmented } from '@/shared/ui/segmented';

const MOBILE_BOTTOM_SHEET_MQ = '(max-width: 48em)';

const LANGUAGE_OPTIONS: { value: TLocale; label: string }[] = [
  { value: 'uz', label: 'O‘zbek (lotin)' },
  { value: 'uzc', label: 'Oʻzbek (kirill)' },
  { value: 'ru', label: 'Русский' },
  { value: 'en', label: 'English' },
];

function normalizeActiveLocale(lang: string | undefined): TLocale {
  const raw = (lang || 'uz').toLowerCase();
  if (raw === 'uzc' || raw.startsWith('uzc')) return 'uzc';
  const base = raw.split('-')[0];
  if (base === 'ru') return 'ru';
  if (base === 'en') return 'en';
  return 'uz';
}

export type SettingsModalProps = {
  opened: boolean;
  onClose: () => void;
};

export function SettingsModal({ opened, onClose }: SettingsModalProps) {
  const navigate = useNavigate();
  const { i18n } = useTranslation();
  const { colorScheme, setColorScheme } = useThemeStore();
  const { logout, refreshToken } = useAuthStore();
  const closeSettingsModal = useSettingsModalStore((s) => s.close);
  const openPricingModal = usePricingModalStore((s) => s.open);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const isMobileBottomSheet = useMediaQuery(MOBILE_BOTTOM_SHEET_MQ, false, {
    getInitialValueInEffect: true,
  });

  const activeLocale = useMemo(
    () => normalizeActiveLocale(i18n.language),
    [i18n.language]
  );

  const go = useCallback(
    (path: string) => {
      navigate(path, { replace: true });
      closeSettingsModal();
    },
    [navigate, closeSettingsModal]
  );

  const handleLogout = async () => {
    setLogoutLoading(true);
    try {
      if (refreshToken) {
        try {
          await logoutAuth(refreshToken);
        } catch {
          // server xatosi bo‘lsa ham sessiyani tozalaymiz
        }
      }
      logout();
      localStorageHelper.clear();
      onClose();
      navigate('/');
    } finally {
      setLogoutLoading(false);
    }
  };

  const formStack = (
    <Stack gap="lg">
      <Box>
        <Group gap={8} mb="xs">
          <Text fw={600} size="sm" c="dimmed" tt="uppercase">
            Ko‘rinish
          </Text>
        </Group>
        <Segmented
          fullWidth
          value={colorScheme}
          onChange={(v) => setColorScheme(v as ColorSchemeType)}
          data={[
            { value: ColorScheme.light, label: 'Yorug‘' },
            { value: ColorScheme.dark, label: 'Qorong‘u' },
          ]}
        />
      </Box>

      <Box>
        <Text fw={600} size="sm" c="dimmed" mb="xs" tt="uppercase">
          Til
        </Text>
        <Select
          allowDeselect={false}
          data={LANGUAGE_OPTIONS}
          value={activeLocale}
          onChange={(v) => {
            if (v) changeLocale(v as TLocale);
          }}
          comboboxProps={{ withinPortal: true }}
        />
      </Box>

      <Divider />

      <Box>
        <Text fw={600} size="sm" c="dimmed" mb="xs" tt="uppercase">
          Tezkor
        </Text>
        <Stack gap="xs">
          <Button
            variant="light"
            color="gray"
            justify="space-between"
            fullWidth
            rightSection={<FaExternalLinkAlt size={12} />}
            leftSection={<FaUser size={16} />}
            onClick={() => go('/dashboard/profile')}
          >
            Profil
          </Button>
          <Button
            variant="light"
            color="gray"
            justify="space-between"
            fullWidth
            rightSection={<FaExternalLinkAlt size={12} />}
            leftSection={<HiLightningBolt size={18} />}
            onClick={() => {
              openPricingModal();
              closeSettingsModal();
            }}
          >
            Tarif va premium
          </Button>
        </Stack>
      </Box>

      <Divider />

      <Button
        variant="light"
        color="red"
        fullWidth
        leftSection={<FaSignOutAlt size={16} />}
        loading={logoutLoading}
        onClick={() => void handleLogout()}
      >
        Chiqish
      </Button>
    </Stack>
  );

  if (isMobileBottomSheet) {
    return (
      <BottomSheet
        opened={opened}
        onClose={onClose}
        zIndex={1002}
        hiddenTitle="Sozlamalar"
        size="min(92dvh, 640px)"
      >
        {formStack}
      </BottomSheet>
    );
  }

  return (
    <Modal
      opened={opened}
      onClose={onClose}
      title="Sozlamalar"
      radius="md"
      size="min(100%, 440px)"
    >
      {formStack}
    </Modal>
  );
}
