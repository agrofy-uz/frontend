import { Text, Title, Stack } from '@mantine/core';

function Settings() {
  return (
    <Stack gap="md">
      <Title order={2}>Sozlamalar</Title>
      <Text c="dimmed">Hisob sozlamalari — tez orada.</Text>
    </Stack>
  );
}

export default Settings;
