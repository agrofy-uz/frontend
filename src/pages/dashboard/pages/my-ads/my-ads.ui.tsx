import { useCallback, useEffect, useMemo, useState } from 'react';
import { ActionIcon, Box, Flex } from '@mantine/core';
import { useMediaQuery } from '@mantine/hooks';
import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getMyProducts, getMyServices } from '@/shared/api/services/my-ads';
import { Segmented } from '@/shared/ui/segmented';
import { Button } from '@/shared/ui/button';
import { MdAdd } from 'react-icons/md';
import { ServicesTab } from './ui/services-tab';
import { ProductsTab } from './ui/products-tab';
import { Create, type MyAdsEditDraft } from './ui/create';
import styles from './my-ads.module.css';

function MyAds() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(
    'services',
  );
  const [createOpened, setCreateOpened] = useState(false);
  const [editDraft, setEditDraft] = useState<MyAdsEditDraft | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1000px)', false, {
    getInitialValueInEffect: true,
  });

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

    setActiveTab(createType);
    setEditDraft(null);
    setCreateOpened(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('create');
      return next;
    });
  }, [searchParams, setSearchParams]);

  const fabAriaLabel = useMemo(() => createLabel, [createLabel]);

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
        {showHeaderCreateButton && (
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
        )}
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
      {showMobileFab ? (
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
      ) : null}
      <Create
        opened={createOpened}
        onClose={() => {
          setCreateOpened(false);
          setEditDraft(null);
        }}
        initialType={activeTab}
        editDraft={editDraft}
      />
    </Box>
  );
}

export default MyAds;
