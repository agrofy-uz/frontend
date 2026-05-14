import { Box, Text, Title } from '@mantine/core';

export function PricingView() {
  return (
    <Box>
      <Title order={2}>Tariflar</Title>
      <Text c="dimmed" mt="xs">
        Tarif rejalar va toʻlov — tez orada.
      </Text>
    </Box>
  );
}
