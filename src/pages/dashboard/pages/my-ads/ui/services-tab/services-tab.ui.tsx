import { useMemo, useState } from 'react';
import { Box, Stack, Title } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { MdDeleteOutline } from 'react-icons/md';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import { deleteMyService, getMyServices } from '@/shared/api/services/my-ads';
import type { MyServiceDto } from '@/shared/api/services/my-ads';
import { useAuthStore } from '@/shared/store/authStore';
import { Card } from '@/shared/ui/card';
import { openNotification } from '@/shared/lib/notification';
import { Confirmation } from '../confirmation';
import { EmptyState } from '../empty-state';
import { MY_ADS_MOBILE_MQ } from '../../my-ads.const';
import s from './services-tab.module.css';

type ServicesTabProps = {
  onCreate: () => void;
  onEdit: (service: MyServiceDto) => void;
};

function ServicesTab({ onCreate, onEdit }: ServicesTabProps) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  const { data, isLoading } = useQuery({
    queryKey: ['my-services'],
    queryFn: getMyServices,
  });
  const [deleteTarget, setDeleteTarget] = useState<MyServiceDto | null>(null);
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMyService(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-services'] });
      try {
        const me = await getAuthMe();
        updateUser(mapAuthMeToUser(me));
      } catch {
        /* limitlar keyingi /me da yangilanadi */
      }
      openNotification({
        title: "E'lon o‘chirildi",
        type: 'success',
        icon: <MdDeleteOutline size={22} />,
      });
      setDeleteTarget(null);
    },
    onError: () => {
      openNotification({
        title: "E'lonni o‘chirishda xatolik yuz berdi",
        type: 'error',
        icon: <MdDeleteOutline size={22} />,
      });
    },
  });

  const handleDeleteRequest = (item: MyServiceDto) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget?.id?.trim()) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const { premiumServices, regularServices } = useMemo(() => {
    const source = data ?? [];
    return {
      premiumServices: source.filter((item) => item.premium),
      regularServices: source.filter((item) => !item.premium),
    };
  }, [data]);

  const premiumCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `my-premium-loading-${index}`,
      }))
    : premiumServices;

  const regularCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `my-regular-loading-${index}`,
      }))
    : regularServices;

  const showPremiumSection = isLoading || premiumServices.length > 0;
  const showRegularSection = isLoading || regularServices.length > 0;

  return (
    <Stack gap="md" mt="md">
      {showPremiumSection ? (
        <Stack gap="xs">
          <Title order={isMobile ? 4 : 3}>Premium xizmatlarim</Title>
          <Box className={s.servicesGrid}>
            {premiumCardsToRender.map((item) => (
              <Box key={item.id} className={s.servicesGridItem} w="100%">
                <Card
                  {...item}
                  loading={isLoading}
                  actionMode="manage"
                  onDelete={
                    !isLoading && 'title' in item
                      ? () => handleDeleteRequest(item as MyServiceDto)
                      : undefined
                  }
                  onEdit={
                    !isLoading && 'title' in item
                      ? () => onEdit(item as MyServiceDto)
                      : undefined
                  }
                />
              </Box>
            ))}
          </Box>
        </Stack>
      ) : null}

      {showRegularSection ? (
        <Stack gap="xs">
          <Title order={isMobile ? 4 : 3}>Xizmatlarim</Title>
          <Box className={s.servicesGrid}>
            {regularCardsToRender.map((item) => (
              <Box key={item.id} className={s.servicesGridItem} w="100%">
                <Card
                  {...item}
                  loading={isLoading}
                  actionMode="manage"
                  onDelete={
                    !isLoading && 'title' in item
                      ? () => handleDeleteRequest(item as MyServiceDto)
                      : undefined
                  }
                  onEdit={
                    !isLoading && 'title' in item
                      ? () => onEdit(item as MyServiceDto)
                      : undefined
                  }
                />
              </Box>
            ))}
          </Box>
        </Stack>
      ) : null}

      {!isLoading && !showPremiumSection && !showRegularSection ? (
        <EmptyState
          title="Sizda hali xizmat e'lonlari yo‘q"
          description="Birinchi xizmatingizni qo‘shing va mijozlar uchun ko‘rinishni boshlang."
          actionLabel="E'lon qo‘shish"
          onAction={onCreate}
        />
      ) : null}

      <Confirmation
        opened={Boolean(deleteTarget)}
        onClose={() => {
          if (deleteMutation.isPending) return;
          setDeleteTarget(null);
        }}
        onConfirm={handleDeleteConfirm}
        loading={deleteMutation.isPending}
        title={deleteTarget?.title}
      />
    </Stack>
  );
}

export default ServicesTab;
