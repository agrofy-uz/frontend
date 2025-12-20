import { Container } from '@/shared/ui/container';
import { Box, Flex } from '@mantine/core';
import { Outlet } from 'react-router-dom';

function ProfileLayout() {
  return (
    <main>
      <Container mb={80}>
        <Flex gap={33} align="flex-start">
          <Box w="calc(100% - 263px - 33px)">
            <Outlet />
          </Box>
        </Flex>
      </Container>
    </main>
  );
}

export default ProfileLayout;
