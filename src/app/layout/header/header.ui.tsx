import {
  Flex,
  Group,
  Anchor,
  ActionIcon,
  useMantineColorScheme,
  Select,
} from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { Button } from '@/shared/ui/button';
import { MobileDrawer } from './ui/mobile';
import { LoginModal } from '@/shared/ui/login-modal';
import { FaBars } from 'react-icons/fa';
import { IoChevronDownOutline } from 'react-icons/io5';
import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { changeLocale } from '@/shared/lib/language';
import { useAuthStore } from '@/shared/store/authStore';
import { LANGUAGES } from './header.const';
import logo1 from '@/assets/images/logo1.png';
import logo2 from '@/assets/images/logo2.png';

function Header() {
  const { colorScheme } = useMantineColorScheme();
  const [scrolled, setScrolled] = useState(false);
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const navigate = useNavigate();
  const { i18n, t } = useTranslation();
  const { isAuthenticated } = useAuthStore();
  const [navItems, setNavItems] = useState([
    { label: '', href: '#product' },
    { label: '', href: '#ai' },
    { label: '', href: '#platforms' },
    { label: '', href: '#cta' },
    { label: '', href: '#statistics' },
  ]);

  useEffect(() => {
    setNavItems([
      { label: t('header.nav.product'), href: '#product' },
      { label: t('header.nav.ai'), href: '#ai' },
      { label: t('header.nav.solutions'), href: '#platforms' },
      { label: t('header.nav.pricing'), href: '#cta' },
      { label: t('header.nav.partners'), href: '#statistics' },
    ]);
  }, [t]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setScrolled(scrollPosition > 30);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
            <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
              <img
                src={colorScheme === 'dark' ? logo2 : logo1}
                alt="Agrofy Logo"
                style={{ height: '32px', width: 'auto', objectFit: 'contain' }}
              />
            </Link>

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
            <Flex align="center" gap="md">
              <Select
                value={i18n.language}
                onChange={(value) => changeLocale(value as any)}
                data={LANGUAGES.map((l) => ({ value: l.value, label: `${l.icon} ${l.label}` }))}
                variant="unstyled"
                size="sm"
                allowDeselect={false}
                rightSection={<IoChevronDownOutline size={14} />}
                className="lang-select"
                styles={{
                  root: {
                    display: 'flex',
                    alignItems: 'center',
                    backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.03)',
                    borderRadius: 'var(--mantine-radius-md)',
                    paddingLeft: '12px',
                    paddingRight: '8px',
                    height: '35px',
                    cursor: 'pointer',
                    transition: 'background-color 0.2s',
                    '&:hover': {
                      backgroundColor: colorScheme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)',
                    },
                  },
                  input: {
                    border: 'none',
                    backgroundColor: 'transparent',
                    fontSize: '14px',
                    fontWeight: 500,
                    width: '140px',
                    cursor: 'pointer',
                    padding: 0,
                    minHeight: 'auto',
                    height: 'auto',
                  },
                }}
                visibleFrom="sm"
              />
              <ActionIcon
                variant="subtle"
                size="lg"
                onClick={() => setDrawerOpened(true)}
                hiddenFrom="md"
                aria-label="Open menu"
              >
                <FaBars size={18} />
              </ActionIcon>
              <Button
                h={35}
                visibleFrom="md"
                onClick={() => {
                  if (isAuthenticated) {
                    navigate('/dashboard');
                  } else {
                    setLoginModalOpened(true);
                  }
                }}
              >
                {isAuthenticated ? t('header.dashboard') : t('header.startFree')}
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
        onLoginClick={() => {
          setDrawerOpened(false);
          setLoginModalOpened(true);
        }}
      />

      {/* Login Modal */}
      <LoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </>
  );
}

export default Header;
