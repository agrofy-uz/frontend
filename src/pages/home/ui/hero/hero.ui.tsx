import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Badge } from '@/shared/ui/badge';
import { PlusPattern } from '@/shared/ui/plus-pattern';
import { Text, Box, Flex, Card } from '@mantine/core';
import theme from '@/shared/theme';
import { Mockup } from './ui/mockup';
import { IoChatbox } from 'react-icons/io5';
import {
  HERO_BADGE_TEXT,
  HERO_TITLE,
  HERO_DESCRIPTION,
  HERO_BUTTON_TEXT,
  HERO_STATS,
} from './hero.const';

function Hero() {
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
                {HERO_BADGE_TEXT}
              </Badge>
              <Text
                fz={{ base: 28, sm: 32, md: 60 }}
                fw={700}
                lh={1.1}
                ta={{ base: 'center', md: 'start' }}
              >
                {HERO_TITLE.prefix} <br />
                <span style={{ color: theme?.colors?.green?.[6] }}>
                  {HERO_TITLE.highlight}
                </span>
              </Text>
              <Text
                mb="lg"
                c="dimmed"
                ta={{ base: 'center', md: 'start' }}
                fz={{ base: 'sm', md: 'lg' }}
              >
                {HERO_DESCRIPTION}
              </Text>
              <Button
                onClick={() => console.log('Button clicked')}
                leftSection={<IoChatbox />}
                w={{ base: '100%', md: 'auto' }}
              >
                {HERO_BUTTON_TEXT}
              </Button>
              <Flex
                gap={{ base: 'sm', md: 'md' }}
                justify={{ base: 'center', md: 'center' }}
                mt="lg"
                wrap="wrap"
              >
                {HERO_STATS.map((stat, index) => (
                  <Card
                    key={index}
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
                      {stat.value}
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
                ))}
              </Flex>
            </Flex>
            <Flex direction="column" align="center" justify="center" gap="md">
              <Mockup />
            </Flex>
          </Flex>
        </Container>
      </Box>
    </Box>
  );
}

export default Hero;
