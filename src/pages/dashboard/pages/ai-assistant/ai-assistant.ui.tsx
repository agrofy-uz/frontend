import { Box, Text, Title } from '@mantine/core';
import { useLocation } from 'react-router-dom';

function AiAssistant() {
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const chatId = params.get('chat');

  return (
    <Box>
      <Title order={3}>AI Assistant</Title>
      <Text c="dimmed" mt="xs">
        {chatId
          ? `Opened chat: ${chatId}`
          : 'Select a chat from the sidebar or create a new one.'}
      </Text>
    </Box>
  );
}

export default AiAssistant;
