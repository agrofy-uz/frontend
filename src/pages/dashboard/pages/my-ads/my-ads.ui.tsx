import { useEffect, useState } from 'react';
import { Box, Flex } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { useMediaQuery } from '@mantine/hooks';
import { useSearchParams } from 'react-router-dom';
import { ServicesTab } from './ui/services-tab';
import { ProductsTab } from './ui/products-tab';
import { Button } from '@/shared/ui/button';
import { MdAdd } from 'react-icons/md';
import { Create } from './ui/create';
import type { MyServiceDto } from '@/shared/api/services/my-ads';

function MyAds() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(
    'services'
  );
  const [createOpened, setCreateOpened] = useState(false);
  const [editService, setEditService] = useState<MyServiceDto | null>(null);
  const [searchParams, setSearchParams] = useSearchParams();
  const isMobile = useMediaQuery('(max-width: 1000px)');

  useEffect(() => {
    const createType = searchParams.get('create');
    if (createType !== 'services' && createType !== 'products') return;

    setActiveTab(createType);
    setEditService(null);
    setCreateOpened(true);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.delete('create');
      return next;
    });
  }, [searchParams, setSearchParams]);

  return (
    <Box>
      <Flex
        direction={isMobile ? 'column-reverse' : 'row'}
        justify="space-between"
        align="center"
        gap="md"
      >
        <Segmented
          w={isMobile ? '100%' : '600px'}
          value={activeTab}
          onChange={(value) => setActiveTab(value as 'services' | 'products')}
          data={[
            { label: 'Xizmatlar', value: 'services' },
            { label: 'Mahsulotlar', value: 'products' },
          ]}
        />
        <Button
          type="button"
          w={isMobile ? '100%' : 'auto'}
          variant="filled"
          color="green"
          h={isMobile ? 34 : 36}
          leftSection={<MdAdd size={18} />}
          onClick={() => {
            setEditService(null);
            setCreateOpened(true);
          }}
        >
          {activeTab === 'services' ? 'Xizmat yaratish' : 'Mahsulot yaratish'}
        </Button>
      </Flex>
      {activeTab === 'services' ? (
        <ServicesTab
          onCreate={() => {
            setEditService(null);
            setCreateOpened(true);
          }}
          onEdit={(service) => {
            setEditService(service);
            setCreateOpened(true);
          }}
        />
      ) : (
        <ProductsTab
          onCreate={() => {
            setEditService(null);
            setCreateOpened(true);
          }}
        />
      )}
      <Create
        opened={createOpened}
        onClose={() => {
          setCreateOpened(false);
          setEditService(null);
        }}
        initialType={activeTab}
        editService={editService}
      />
    </Box>
  );
}

export default MyAds;
