import { Box } from '@mantine/core';
import { useMantineColorScheme } from '@mantine/core';
import { useThemeStore } from '@/shared/store/themeStore';
import { FaSun, FaMoon } from 'react-icons/fa';
import styles from './theme-toggle.module.css';

export function ThemeToggle() {
  const { colorScheme } = useMantineColorScheme();
  const { toggleColorScheme } = useThemeStore();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      className={styles.toggle}
      onClick={toggleColorScheme}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          toggleColorScheme();
        }
      }}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      <Box className={styles.toggleTrack}>
        <Box
          className={`${styles.toggleThumb} ${isDark ? styles.dark : styles.light}`}
        >
          {isDark ? (
            <FaMoon size={14} className={styles.icon} />
          ) : (
            <FaSun size={14} className={styles.icon} />
          )}
        </Box>
      </Box>
    </Box>
  );
}
