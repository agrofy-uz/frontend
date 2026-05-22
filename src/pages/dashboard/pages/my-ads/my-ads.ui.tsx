import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMyProducts, getMyServices } from '@/shared/api/services/my-ads';
import { useAuthStore } from '@/shared/store/authStore';
import { Segmented } from '@/shared/ui/segmented';
import { Button } from '@/shared/ui/button';
import { MdAdd } from 'react-icons/md';
import { ServicesTab } from './ui/services-tab';
import { ProductsTab } from './ui/products-tab';
import { Create, type MyAdsEditDraft } from './ui/create';
import styles from './my-ads.module.css';
import { MY_ADS_MOBILE_MQ } from './my-ads.const';

function MyAds() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(
    'services',
  );
  const [createOpened, setCreateOpened] = useState(false);
  const [editDraft, setEditDraft] = useState<MyAdsEditDraft | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery(MY_ADS_MOBILE_MQ, false, {
    getInitialValueInEffect: true,
  });

  const productsLimit = useAuthStore((s) => Boolean(s.user?.products_limit));
  const servicesLimit = useAuthStore((s) => Boolean(s.user?.services_limit));

  const servicesQuery = useQuery({
    queryKey: ['my-services'],
    queryFn: getMyServices,
  });

  const productsQuery = useQuery({
    queryKey: ['my-products'],
    queryFn: getMyProducts,
  });

  const activeListQuery =
    activeTab === 'services' ? servicesQuery : productsQuery;

  const activeItemCount = activeListQuery.data?.length ?? 0;

  const hasActiveItems =
    !activeListQuery.isLoading && activeItemCount > 0;

  const createLimitReached =
    activeTab === 'products' ? productsLimit : servicesLimit;

  const createLimitBlocked = createLimitReached && !editDraft;

  /** Mobil: faqat pastdagi FAB (≥1 e’lon); tepada tugma yo‘q. */
  const showMobileFab = Boolean(isMobile) && hasActiveItems;

  /** Desktop: har doim tepada yaratish tugmasi. */
  const showHeaderCreateButton = !isMobile;

  const createLabel =
    activeTab === 'services' ? 'Xizmat yaratish' : 'Mahsulot yaratish';

  const openCreate = useCallback(() => {
    setEditDraft(null);
    setCreateOpened(true);
  }, []);

  useEffect(() => {
    const createType = searchParams.get('create');
    if (createType !== 'services' && createType !== 'products') return;

    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('create');
      return next;
    });

    setActiveTab(createType);
    setEditDraft(null);
    setCreateOpened(true);
  }, [searchParams, setSearchParams]);

  const fabAriaLabel = useMemo(() => createLabel, [createLabel]);

  const headerCreateButton = showHeaderCreateButton ? (
    <Button
      type="button"
      w={isMobile ? '100%' : 'auto'}
      variant="filled"
      color="green"
      h={isMobile ? 34 : 36}
      leftSection={<MdAdd size={18} />}
      onClick={openCreate}
    >
      {createLabel}
    </Button>
  ) : null;

  const mobileFab = showMobileFab ? (
    <span className={styles.fabWrap}>
      <ActionIcon
        type="button"
        className={styles.fab}
        variant="filled"
        color="green"
        size={56}
        radius="xl"
        aria-label={fabAriaLabel}
        onClick={openCreate}
      >
        <MdAdd size={28} />
      </ActionIcon>
    </span>
  ) : null;

  return (
    <Box className={styles.root}>
      <Flex
        direction={isMobile ? 'column' : 'row'}
        justify="space-between"
        align="center"
        gap="md"
      >
        <Segmented
          w={isMobile ? '100%' : '600px'}
          style={{ flex: isMobile ? '1 1 auto' : undefined }}
          value={activeTab}
          onChange={(value) => setActiveTab(value as 'services' | 'products')}
          data={[
            { label: 'Xizmatlar', value: 'services' },
            { label: 'Mahsulotlar', value: 'products' },
          ]}
        />
        {headerCreateButton}
      </Flex>
      {activeTab === 'services' ? (
        <ServicesTab
          onCreate={openCreate}
          onEdit={(service) => {
            setEditDraft({ kind: 'services', item: service });
            setCreateOpened(true);
          }}
        />
      ) : (
        <ProductsTab
          onCreate={openCreate}
          onEdit={(product) => {
            setEditDraft({ kind: 'products', item: product });
            setCreateOpened(true);
          }}
        />
      )}
      {mobileFab}
      <Create
        opened={createOpened}
        onClose={() => {
          setCreateOpened(false);
          setEditDraft(null);
        }}
        initialType={activeTab}
        editDraft={editDraft}
        limitBlocked={createLimitBlocked}
      />
    </Box>
  );
}

export default MyAds;
