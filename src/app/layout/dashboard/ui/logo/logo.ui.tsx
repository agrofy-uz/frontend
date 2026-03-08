import { Box, useMantineColorScheme } from '@mantine/core';
import logo1 from '@/assets/images/logo1.png';
import logo2 from '@/assets/images/logo2.png';
import logo3 from '@/assets/images/logo3.png';

interface LogoProps {
  collapsed?: boolean;
}

const Logo = ({ collapsed = false }: LogoProps) => {
  const { colorScheme } = useMantineColorScheme();

  const getLogo = () => {
    if (collapsed) return logo3;
    return colorScheme === 'dark' ? logo2 : logo1;
  };

  return (
    <Box
      p="md"
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: collapsed ? 'center' : 'flex-start',
        height: '100%',
      }}
    >
      <img
        src={getLogo()}
        alt="Agrofy Logo"
        style={{
          height: collapsed ? '40px' : '30px',
          width: 'auto',
          objectFit: 'contain',
        }}
      />
    </Box>
  );
};

export default Logo;
