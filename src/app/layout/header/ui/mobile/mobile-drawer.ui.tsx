import { Drawer, Flex, Stack, Anchor, Text, ActionIcon } from '@mantine/core';
import { Button } from '@/shared/ui/button';
import { FaTimes } from 'react-icons/fa';

interface NavItem {
  label: string;
  href: string;
}

interface MobileDrawerProps {
  opened: boolean;
  onClose: () => void;
  navItems: NavItem[];
}

const MobileDrawer = ({ opened, onClose, navItems }: MobileDrawerProps) => {
  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    onClose();
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition =
        elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth',
      });
    }
  };
  return (
    <Drawer
      opened={opened}
      onClose={onClose}
      position="top"
      padding={0}
      withCloseButton={false}
      styles={{
        body: {
          padding: 0,
        },
        content: {
          height: 'auto',
          maxHeight: '90vh',
        },
      }}
    >
      {/* Header - Logo va X icon */}
      <Flex
        justify="space-between"
        align="center"
        px="md"
        py="md"
        style={{
          borderBottom: '1px solid var(--mantine-color-gray-3)',
        }}
      >
        <Text fw={600} size="lg">
          Agrofy
        </Text>
        <ActionIcon
          variant="subtle"
          size="lg"
          onClick={onClose}
          aria-label="Close menu"
        >
          <FaTimes size={18} />
        </ActionIcon>
      </Flex>

      {/* Navigation items */}
      <Stack gap={0} p="md">
        {navItems.map((item) => (
          <Anchor
            key={item.label}
            href={item.href}
            onClick={(e) => handleNavClick(e, item.href)}
            style={{
              textDecoration: 'none',
              color: 'var(--mantine-color-text)',
              fontWeight: 500,
              fontSize: '16px',
              padding: '1rem 0',
              borderBottom: '1px solid var(--mantine-color-gray-2)',
              transition: 'color 0.2s',
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.color = 'var(--mantine-color-green-6)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.color = 'var(--mantine-color-text)';
            }}
          >
            {item.label}
          </Anchor>
        ))}
      </Stack>

      {/* Start button - eng pastida */}
      <Flex justify="center" p="md" pb="xl">
        <Button w="100%" h={44}>
          Start Free
        </Button>
      </Flex>
    </Drawer>
  );
};

export default MobileDrawer;
