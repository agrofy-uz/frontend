import { Box, Text, Title } from '@mantine/core';

function Profile() {
  return (
    <Box>
      <Title order={2}>Profil</Title>
      <Text c="dimmed" mt="xs">
        Profil maʼlumotlari — tez orada.
      </Text>
    </Box>
  );
}

export default Profile;
