import { useState } from 'react';
import { Box, Flex } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { useMediaQuery } from '@mantine/hooks';
import { ServicesTab } from './ui/services-tab';
import { ProductsTab } from './ui/products-tab';
import { Button } from '@/shared/ui/button';
import { MdAdd } from 'react-icons/md';
import { Create } from './ui/create';

function MyAds() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(
    'services'
  );
  const [createOpened, setCreateOpened] = useState(false);
  const isMobile = useMediaQuery('(max-width: 1000px)');
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
            setCreateOpened(true);
          }}
        >
          {activeTab === 'services' ? 'Xizmat yaratish' : 'Mahsulot yaratish'}
        </Button>
      </Flex>
      {activeTab === 'services' ? (
        <ServicesTab onCreate={() => setCreateOpened(true)} />
      ) : (
        <ProductsTab onCreate={() => setCreateOpened(true)} />
      )}
      <Create
        opened={createOpened}
        onClose={() => setCreateOpened(false)}
        initialType={activeTab}
      />
    </Box>
  );
}

export default MyAds;
