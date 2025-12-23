import {
  Flex,
  Text,
  Group,
  Anchor,
  ActionIcon,
  useMantineColorScheme,
} from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { MobileDrawer } from './ui/mobile';
import { FaBars } from 'react-icons/fa';
import { useEffect, useState } from 'react';

function Header() {
  const { colorScheme } = useMantineColorScheme();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'Product', href: '#product' },
    { label: 'AI', href: '#ai' },
    { label: 'Solutions', href: '#platforms' },
    { label: 'Pricing', href: '#cta' },
    { label: 'Partners', href: '#statistics' },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
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
    <>
      <header
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: scrolled
            ? colorScheme === 'dark'
              ? '#1A1B1E'
              : '#fcfcfd'
            : 'transparent',
          backdropFilter: scrolled ? 'blur(12px)' : 'none',
          WebkitBackdropFilter: scrolled ? 'blur(12px)' : 'none',
          transition:
            'background-color 0.4s cubic-bezier(0.4, 0, 0.2, 1), backdrop-filter 0.4s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.4s cubic-bezier(0.4, 0, 0.2, 1), border-bottom 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
          boxShadow: scrolled
            ? colorScheme === 'dark'
              ? '0 1px 3px rgba(0, 0, 0, 0.3)'
              : '0 1px 3px rgba(0, 0, 0, 0.1)'
            : 'none',
          borderBottom: scrolled
            ? colorScheme === 'dark'
              ? '1px solid rgba(255, 255, 255, 0.1)'
              : '1px solid rgba(0, 0, 0, 0.1)'
            : 'none',
          zIndex: 100,
        }}
      >
        <Container>
          <Flex justify="space-between" align="center" py="md" w="100%">
            {/* Chapda: Mobile logo yoki Desktop logo */}
            <Text fw={600} size="lg">
              Agrofy
            </Text>

            {/* O'rtada: Desktop navbar */}
            <Group gap="xl" visibleFrom="md">
              {navItems.map((item) => (
                <Anchor
                  key={item.label}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  style={{
                    textDecoration: 'none',
                    color: 'var(--mantine-color-text)',
                    fontWeight: 500,
                    fontSize: '14px',
                    transition: 'color 0.2s',
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color =
                      'var(--mantine-color-green-6)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = 'var(--mantine-color-text)';
                  }}
                >
                  {item.label}
                </Anchor>
              ))}
            </Group>

            {/* O'ngda: Mobile menu button yoki Desktop button */}
            <Flex align="center">
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setDrawerOpened(true)}
                hiddenFrom="md"
                aria-label="Open menu"
              >
                <FaBars size={18} />
              </ActionIcon>
              <Button h={35} visibleFrom="md">
                Start Free
              </Button>
            </Flex>
          </Flex>
        </Container>
      </header>

      {/* Mobile Drawer */}
      <MobileDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        navItems={navItems}
      />
    </>
  );
}

export default Header;
