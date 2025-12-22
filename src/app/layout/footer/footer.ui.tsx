import { Container, Text } from '@mantine/core';
import { Container as CustomContainer } from '@/shared/ui/container';

function Footer() {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--mantine-color-gray-3)',
        marginTop: 'auto',
      }}
    >
      <CustomContainer py="md">
        <Text size="sm" c="dimmed" ta="center">
          © {new Date().getFullYear()} Agrofy Template. Minimal shablon.
        </Text>
      </CustomContainer>
    </footer>
  );
}

export default Footer;
