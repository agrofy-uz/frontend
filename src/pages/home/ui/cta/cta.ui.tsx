import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Text, Box, Flex, Stack, Title } from '@mantine/core';
import { FaArrowRight } from 'react-icons/fa6';
import { LoginModal } from '@/shared/ui/login-modal';
import { useState } from 'react';
import styles from './cta.module.css';

function CTA() {
  const [loginModalOpened, setLoginModalOpened] = useState(false);

  return (
    <Box className={styles.section}>
      <Container>
        <Stack align="center" gap="xl" py={{ base: 'xl', md: 80 }}>
          {/* Title */}
          <Title
            order={1}
            fz={{ base: 32, sm: 40, md: 56 }}
            fw={700}
            ta="center"
            lh={1.2}
            className="textPrimary"
          >
            Start Growing Smarter with <br />
            Agrofy
          </Title>
          {/* Description */}
          <Text
            fz={{ base: 'md', md: 'lg' }}
            ta="center"
            className={styles.description}
            maw={700}
            lh={1.6}
          >
            Join over 1 million farmers and agribusinesses already using AI to
            transform their operations. Get started for free — no credit card
            required.
          </Text>
          {/* Buttons */}
          <Flex
            direction={{ base: 'column', sm: 'row' }}
            gap="md"
            align="center"
            mt="md"
          >
            <Button
              rightSection={<FaArrowRight size={16} />}
              size="lg"
              w={{ base: '100%', sm: 'auto' }}
              onClick={() => setLoginModalOpened(true)}
            >
              Start Free
            </Button>
          </Flex>
        </Stack>
      </Container>
      <LoginModal
        opened={loginModalOpened}
        onClose={() => setLoginModalOpened(false)}
      />
    </Box>
  );
}

export default CTA;
