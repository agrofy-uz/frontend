import { useMemo, useState } from 'react';
import { Box, Stack, Title } from '@mantine/core';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { useMediaQuery } from '@mantine/hooks';
import { MdDeleteOutline } from 'react-icons/md';
import { getAuthMe, mapAuthMeToUser } from '@/shared/api';
import { deleteMyProduct, getMyProducts } from '@/shared/api/services/my-ads';
import type { MyProductDto } from '@/shared/api/services/my-ads';
import { useAuthStore } from '@/shared/store/authStore';
import { Card } from '@/shared/ui/card';
import { openNotification } from '@/shared/lib/notification';
import { Confirmation } from '../confirmation';
import { EmptyState } from '../empty-state';
import { MY_ADS_MOBILE_MQ } from '../../my-ads.const';
import s from '../services-tab/services-tab.module.css';

type ProductsTabProps = {
  onCreate: () => void;
  onEdit: (product: MyProductDto) => void;
};

function ProductsTab({ onCreate, onEdit }: ProductsTabProps) {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((s) => s.updateUser);
  const { data, isLoading } = useQuery({
    queryKey: ['my-products'],
    queryFn: getMyProducts,
  });
  const [deleteTarget, setDeleteTarget] = useState<MyProductDto | null>(null);
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => deleteMyProduct(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ['my-products'] });
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

  const handleDeleteRequest = (item: MyProductDto) => {
    setDeleteTarget(item);
  };

  const handleDeleteConfirm = () => {
    if (!deleteTarget?.id?.trim()) return;
    deleteMutation.mutate(deleteTarget.id);
  };

  const { premiumProducts, regularProducts } = useMemo(() => {
    const source = data ?? [];
    return {
      premiumProducts: source.filter((item) => item.premium),
      regularProducts: source.filter((item) => !item.premium),
    };
  }, [data]);

  const premiumCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `my-product-premium-loading-${index}`,
      }))
    : premiumProducts;

  const regularCardsToRender = isLoading
    ? Array.from({ length: 6 }, (_, index) => ({
        id: `my-product-regular-loading-${index}`,
      }))
    : regularProducts;

  const showPremiumSection = isLoading || premiumProducts.length > 0;
  const showRegularSection = isLoading || regularProducts.length > 0;

  return (
    <Stack gap="md" mt="md">
      {showPremiumSection ? (
        <Stack gap="xs">
          <Title order={isMobile ? 4 : 3}>Premium mahsulotlarim</Title>
          <Box className={s.servicesGrid}>
            {premiumCardsToRender.map((item) => (
              <Box key={item.id} className={s.servicesGridItem} w="100%">
                <Card
                  {...item}
                  loading={isLoading}
                  actionMode="manage"
                  detailType="market"
                  onDelete={
                    !isLoading && 'title' in item
                      ? () => handleDeleteRequest(item as MyProductDto)
                      : undefined
                  }
                  onEdit={
                    !isLoading && 'title' in item
                      ? () => onEdit(item as MyProductDto)
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
          <Title order={isMobile ? 4 : 3}>Mahsulotlarim</Title>
          <Box className={s.servicesGrid}>
            {regularCardsToRender.map((item) => (
              <Box key={item.id} className={s.servicesGridItem} w="100%">
                <Card
                  {...item}
                  loading={isLoading}
                  actionMode="manage"
                  detailType="market"
                  onDelete={
                    !isLoading && 'title' in item
                      ? () => handleDeleteRequest(item as MyProductDto)
                      : undefined
                  }
                  onEdit={
                    !isLoading && 'title' in item
                      ? () => onEdit(item as MyProductDto)
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
          title="Sizda hali mahsulot e'lonlari yo‘q"
          description="Mahsulotingizni joylang va xaridorlar uni tezroq topishi uchun e'lon yarating."
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

export default ProductsTab;
