import { Container } from '@/shared/ui/container';
import { Text, Flex, Stack, Anchor, Box, Group } from '@mantine/core';
import { FOOTER_SOCIAL_LINKS, FOOTER_NAV_COLUMNS } from './footer.const';
import { ThemeToggle } from './ui/theme-toggle';
import { FaLinkedin, FaTwitter, FaYoutube, FaInstagram } from 'react-icons/fa';
import styles from './footer.module.css';

const socialIconMap = {
  linkedin: FaLinkedin,
  twitter: FaTwitter,
  youtube: FaYoutube,
  instagram: FaInstagram,
};

function Footer() {
  return (
    <footer className={styles.footer}>
      <Container>
        {/* Top Section */}
        <Flex
          direction={{ base: 'column', md: 'row' }}
          justify="space-between"
          gap={{ base: 'xl', md: 'lg' }}
          py={{ base: 'xl', md: 'xl' }}
          className={styles.topSection}
        >
          {/* Left Side - Logo, Tagline, Social */}
          <Stack
            gap="md"
            w={{ base: '100%', md: '30%' }}
            maw={{ base: '100%', md: 350 }}
          >
            <Text fw={700} fz={{ base: 'xl', md: 'xl' }} c="green.6">
              Agrofy
            </Text>
            <Text fz="sm" c="dimmed" lh={1.6}>
              The complete AI ecosystem for modern agriculture. Empowering
              farmers worldwide.
            </Text>
            <Group gap="sm" mt="xs">
              {FOOTER_SOCIAL_LINKS.map((social) => {
                const IconComponent =
                  socialIconMap[social.icon as keyof typeof socialIconMap];
                return (
                  <Anchor
                    key={social.name}
                    href={social.url}
                    className={styles.socialLink}
                    aria-label={social.name}
                  >
                    {IconComponent && <IconComponent size={18} />}
                  </Anchor>
                );
              })}
            </Group>
          </Stack>

          {/* Right Side - Navigation Columns */}
          <Box w={{ base: '100%', md: '70%' }} className={styles.navColumns}>
            {FOOTER_NAV_COLUMNS.map((column) => (
              <Stack key={column.title} gap="sm">
                <Text fw={600} fz="sm" className="textPrimary">
                  {column.title}
                </Text>
                <Stack gap="xs">
                  {column.links.map((link) => (
                    <Anchor
                      key={link.label}
                      href={link.href}
                      fz="sm"
                      c="dimmed"
                      className={styles.navLink}
                    >
                      {link.label}
                    </Anchor>
                  ))}
                </Stack>
              </Stack>
            ))}
          </Box>
        </Flex>

        {/* Bottom Section */}
        <Box
          className={styles.bottomSection}
          py="md"
          style={{
            borderTop: '1px solid var(--mantine-color-gray-3)',
          }}
        >
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            justify="space-between"
            align="center"
            gap="md"
          >
            <Text fz="sm" c="dimmed">
              © {new Date().getFullYear()} Agrofy. All rights reserved.
            </Text>
            <Flex align="center" gap="md">
              <Text fz="sm" c="dimmed">
                English USD
              </Text>
              <ThemeToggle />
            </Flex>
          </Flex>
        </Box>
      </Container>
    </footer>
  );
}

export default Footer;
