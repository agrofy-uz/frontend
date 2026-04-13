import { useState } from 'react';
import { Box, Stack, Text } from '@mantine/core';
import { Segmented } from '@/shared/ui/segmented';
import { useMediaQuery } from '@mantine/hooks';

function MyAds() {
  const [activeTab, setActiveTab] = useState<'services' | 'products'>(
    'services'
  );
  const isMobile = useMediaQuery('(max-width: 1000px)');
  return (
    <Box>
      <Segmented
        w={isMobile ? '100%' : '600px'}
        value={activeTab}
        onChange={(value) => setActiveTab(value as 'services' | 'products')}
        data={[
          { label: 'Xizmatlar', value: 'services' },
          { label: 'Mahsulotlar', value: 'products' },
        ]}
      />
      <Stack gap="xs" mt="md">
        <Text c="dimmed" mt="xs">
          {activeTab === 'services'
            ? "Xizmatlar e'lonlari — tez orada."
            : "Mahsulotlar e'lonlari — tez orada."}
        </Text>
      </Stack>
    </Box>
  );
}

export default MyAds;
