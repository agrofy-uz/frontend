import { ActionIcon, Flex, Text, useMantineColorScheme } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { useThemeStore } from '@/shared/store/themeStore';

function Header() {
  const { colorScheme } = useMantineColorScheme();
  const { toggleColorScheme } = useThemeStore();

  return (
    <header style={{ borderBottom: '1px solid var(--mantine-color-gray-3)' }}>
      <Container>
        <Flex justify="space-between" align="center" py="md">
          <Text fw={600} size="lg">
            Agrofy Template
          </Text>
          <ActionIcon
            variant="default"
            size="lg"
            onClick={toggleColorScheme}
            aria-label="Toggle color scheme"
          >
            {colorScheme === 'dark' ? '☀️' : '🌙'}
          </ActionIcon>
        </Flex>
      </Container>
    </header>
  );
}

export default Header;
