import { Group, Text, Box } from '@mantine/core';
import { FaLeaf } from 'react-icons/fa';

interface LogoProps {
  collapsed?: boolean;
}

const Logo = ({ collapsed = false }: LogoProps) => {
  return (
    <Group
      gap="xs"
      p="md"
      style={{ justifyContent: collapsed ? 'center' : 'flex-start' }}
    >
      <Box
        style={{
          color: 'var(--mantine-color-green-6)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <FaLeaf size={24} />
      </Box>
      {!collapsed && (
        <Text
          fw={700}
          size="lg"
          style={{ color: 'var(--mantine-color-green-6)' }}
        >
          Agrofy
        </Text>
      )}
    </Group>
  );
};

export default Logo;
