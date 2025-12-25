import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Text, Box, Flex, Stack, Title } from '@mantine/core';
import { FaArrowRight } from 'react-icons/fa6';
import { LoginModal } from '@/shared/ui/login-modal';
import { useState } from 'react';
import styles from './cta.module.css';
import { motion } from 'framer-motion';

function CTA() {
  const [loginModalOpened, setLoginModalOpened] = useState(false);

  return (
    <Box className={styles.section}>
      <Container>
        <Stack align="center" gap="xl" py={{ base: 'xl', md: 80 }}>
          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: -30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6 }}
          >
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
          </motion.div>
          {/* Description */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
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
          </motion.div>
          {/* Buttons */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            whileHover={{ scale: 1.05 }}
          >
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
          </motion.div>
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
