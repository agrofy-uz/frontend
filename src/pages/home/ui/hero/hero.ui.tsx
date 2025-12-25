import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Badge } from '@/shared/ui/badge';
import { PlusPattern } from '@/shared/ui/plus-pattern';
import { LoginModal } from '@/shared/ui/login-modal';
import { Text, Box, Flex, Card } from '@mantine/core';
import theme from '@/shared/theme';
import { Mockup } from './ui/mockup';
import { IoChatbox } from 'react-icons/io5';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/shared/store/authStore';
import { HERO_STATS, formatNumber } from './hero.const';
import { motion } from 'framer-motion';

function Hero() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState([0, 0, 0]);
  const [loginModalOpened, setLoginModalOpened] = useState(false);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 soniya
    const steps = 60;
    const stepDuration = duration / steps;

    const timers: NodeJS.Timeout[] = [];

    HERO_STATS.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.target / steps;

      const timer = setInterval(() => {
        currentStep++;
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.target) {
            newCounts[index] = Math.min(
              newCounts[index] + increment,
              stat.target
            );
          }
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [isVisible]);

  return (
    <Box
      style={{
        position: 'relative',
        minHeight: '100vh',
        zIndex: 0,
      }}
    >
      {/* Hero background - header orqasiga o'tadi */}
      <PlusPattern
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          zIndex: 0,
        }}
      >
        {/* Gradient overlay - yuqoridan pastga shaffoflashib boradi */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background:
              'linear-gradient(to bottom, rgba(166, 239, 103, 0.09) 0%, rgba(166, 239, 103, 0.03) 30%, rgba(166, 239, 103, 0.03) 60%, transparent 100%)',
            pointerEvents: 'none',
            zIndex: 0,
          }}
        />
      </PlusPattern>

      {/* Content - header ustida */}
      <Box
        ref={sectionRef}
        style={{
          position: 'relative',
          zIndex: 1,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '100vh',
          paddingTop: '80px',
          paddingBottom: '40px',
        }}
      >
        <Container py={{ base: '100px', md: 'xl' }} w="100%">
          <Flex
            w="100%"
            direction={{ base: 'column', md: 'row' }}
            align={{ base: 'center', md: 'center' }}
            justify={{ base: 'center', md: 'space-between' }}
            gap={{ base: '100px', md: 'md' }}
            wrap="nowrap"
          >
            <Flex
              maw={{ base: '100%', md: 600 }}
              w="100%"
              direction="column"
              align={{ base: 'center', md: 'start' }}
              justify="start"
              gap={6}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <Badge
                  bg={theme?.colors?.green?.[2]}
                  c={theme?.colors?.green?.[8]}
                  size="lg"
                  leftSection={
                    <Box
                      w={10}
                      h={10}
                      style={{
                        borderRadius: '50%',
                        marginRight: 4,
                        backgroundColor: theme?.colors?.green?.[5],
                        animation: 'pulse-green 2s ease-in-out infinite',
                      }}
                    />
                  }
                >
                  AI-Powered Agriculture Platform
                </Badge>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Text
                  fz={{ base: 28, sm: 32, md: 60 }}
                  fw={700}
                  lh={1.1}
                  ta={{ base: 'center', md: 'start' }}
                  className="textPrimary"
                >
                  The complete AI ecosystem for <br />
                  <motion.span
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 }}
                    style={{ color: theme?.colors?.green?.[6] }}
                  >
                    modern agriculture
                  </motion.span>
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Text
                  mb="lg"
                  c="dimmed"
                  ta={{ base: 'center', md: 'start' }}
                  fz={{ base: 'sm', md: 'lg' }}
                >
                  Agrofy helps farmers and agribusinesses increase productivity
                  using artificial intelligence. From chat assistance to smart
                  irrigation — all in one platform.
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  onClick={() => {
                    if (isAuthenticated) {
                      navigate('/dashboard');
                    } else {
                      setLoginModalOpened(true);
                    }
                  }}
                  leftSection={<IoChatbox />}
                  w={{ base: '100%', md: 'auto' }}
                >
                  Start with AI Chat
                </Button>
              </motion.div>
              <Flex
                gap={{ base: 'sm', md: 'md' }}
                justify={{ base: 'center', md: 'center' }}
                mt="lg"
                wrap="wrap"
              >
                {HERO_STATS.map((stat, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                  >
                    <Card
                      bg="transparent"
                      bdrs={0}
                      withBorder={false}
                      style={
                        index < 2
                          ? {
                              borderRight:
                                '1px solid var(--mantine-color-gray-3)',
                              paddingRight: '1rem',
                            }
                          : undefined
                      }
                    >
                      <Text
                        ta="center"
                        fz={{ base: 20, md: 24 }}
                        fw={700}
                        lh={1.2}
                      >
                        {formatNumber(counts[index], stat.target)}
                        {stat.suffix}
                        <Text
                          span
                          c="dimmed"
                          display="block"
                          fz={{ base: 12, md: 14 }}
                          fw={400}
                          mt={2}
                        >
                          {stat.label}
                        </Text>
                      </Text>
                    </Card>
                  </motion.div>
                ))}
              </Flex>
            </Flex>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
            >
              <Flex direction="column" align="center" justify="center" gap="md">
                <Mockup />
              </Flex>
            </motion.div>
          </Flex>
        </Container>
      </Box>

      {/* Login Modal */}
      <LoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </Box>
  );
}

export default Hero;
