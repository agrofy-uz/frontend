import { ActionIcon, Flex, useMantineColorScheme } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { useThemeStore } from '@/shared/store/themeStore';

function Header() {
  const { colorScheme } = useMantineColorScheme();
  const { toggleColorScheme } = useThemeStore();

  return (
    <Container>
      <Flex justify="space-between" align="center" py="md">
        <div>Header</div>
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
  );
}

export default Header;
