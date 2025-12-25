import {
  Card,
  Group,
  Stack,
  Text,
  Box,
  Grid,
  Avatar,
  Flex,
} from '@mantine/core';
import { FaLaptop, FaRobot } from 'react-icons/fa';
import styles from './mockup.module.css';
import { motion } from 'framer-motion';

const Mockup = () => {
  return (
    <Group justify="flex-end" pos="relative" className={styles.mockupContainer}>
      <Box maw={600} w="100%" pos="relative">
        {/* Desktop mockup */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Card radius="xl" shadow="xl" withBorder p={0}>
            {/* Top bar */}
            <Group gap="xs" px="md" py="sm" className={styles.topBar}>
              <Group gap={6}>
                {['red.5', 'yellow.5', 'green.5'].map((color, index) => (
                  <motion.div
                    key={index}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }}
                  >
                    <Box
                      w={12}
                      h={12}
                      bg={color}
                      style={{ borderRadius: '50%' }}
                    />
                  </motion.div>
                ))}
              </Group>
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: 'auto' }}
                transition={{ duration: 0.4, delay: 0.8 }}
                style={{ margin: '0 auto' }}
              >
                <Box
                  py="2px"
                  px="sm"
                  className={styles.chatInput}
                  style={{
                    borderRadius: 6,
                  }}
                >
                  <Text size="xs" className="textSecondary">
                    agrofy.uz
                  </Text>
                </Box>
              </motion.div>
            </Group>

            {/* Content */}
            <Stack p="md" gap="md">
              {/* User message */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <Flex align="center" gap="xs">
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 1.1 }}
                  >
                    <Avatar radius="50%" bg="green.3" variant="light">
                      <FaLaptop
                        size={16}
                        style={{ color: 'var(--mantine-color-green-8)' }}
                      />
                    </Avatar>
                  </motion.div>
                  <Card radius="md" bg="green.1" p="sm" w="100%">
                    <Text size="sm">
                      What's the best time to irrigate my corn field today?
                    </Text>
                  </Card>
                </Flex>
              </motion.div>

              {/* AI message */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.3 }}
              >
                <Flex align="center" gap="xs" justify="flex-end">
                  <Card radius="md" bg="green.2" p="sm" w="100%">
                    <Text size="sm">
                      Based on soil moisture data and weather forecast, I
                      recommend irrigating between 6–8 AM. Expected efficiency:
                      +23%
                    </Text>
                  </Card>
                  <motion.div
                    initial={{ scale: 0, rotate: 180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.4, delay: 1.4 }}
                  >
                    <Avatar radius="50%" bg="green.6">
                      <Text size="xs" fw={700} c="white">
                        AI
                      </Text>
                    </Avatar>
                  </motion.div>
                </Flex>
              </motion.div>

              {/* User message 2 */}
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.6 }}
              >
                <Flex align="center" gap="xs">
                  <Avatar radius="50%" bg="green.3" variant="light">
                    <FaLaptop
                      size={16}
                      style={{ color: 'var(--mantine-color-green-8)' }}
                    />
                  </Avatar>
                  <Card radius="md" bg="green.1" p="sm" w="100%">
                    <Text size="sm">
                      What about fertilizer recommendations for this season?
                    </Text>
                  </Card>
                </Flex>
              </motion.div>

              {/* AI message 2 */}
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
              >
                <Flex align="center" gap="xs" justify="flex-end">
                  <Card radius="md" bg="green.2" p="sm" w="100%">
                    <Text size="sm">
                      For optimal growth, apply nitrogen-rich fertilizer in
                      early spring. I suggest 150kg per hectare for maximum
                      yield.
                    </Text>
                  </Card>
                  <Avatar radius="50%" bg="green.6">
                    <Text size="xs" fw={700} c="white">
                      AI
                    </Text>
                  </Avatar>
                </Flex>
              </motion.div>

              {/* Stats */}
              <Grid mt="lg">
                {[
                  { label: 'Humidity', value: '68%' },
                  { label: 'Temp', value: '24°C' },
                  { label: 'Wind', value: '12 km/h' },
                ].map((stat, index) => (
                  <Grid.Col key={index} span={4}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: 2 + index * 0.1 }}
                    >
                      <Card
                        className={styles.statCard}
                        radius="md"
                        p="xs"
                        ta="center"
                      >
                        <Text size="xs" c="dimmed">
                          {stat.label}
                        </Text>
                        <Text fw={600} c="green">
                          {stat.value}
                        </Text>
                      </Card>
                    </motion.div>
                  </Grid.Col>
                ))}
              </Grid>
            </Stack>
          </Card>
        </motion.div>

        {/* Mobile floating mockup */}
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.8 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.7 }}
          className={styles.mobileCardWrapper}
        >
          <Card
            className={styles.mobileCard}
            radius="xl"
            shadow="lg"
            withBorder
            w={200}
            p={0}
          >
            <Box py={6} className={styles.mobileTopBar}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: 48 }}
                transition={{ duration: 0.4, delay: 1.2 }}
                style={{ margin: '0 auto' }}
              >
                <Box h={4} bg="gray.4" style={{ borderRadius: 999 }} />
              </motion.div>
            </Box>

            <Stack p="md" gap={6}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, delay: 1.3 }}
              >
                <Group gap="xs">
                  <motion.div
                    initial={{ rotate: -360, scale: 0 }}
                    animate={{ rotate: 0, scale: 1 }}
                    transition={{ duration: 0.5, delay: 1.4 }}
                  >
                    <FaRobot
                      size={16}
                      style={{ color: 'var(--mantine-color-green-6)' }}
                    />
                  </motion.div>
                  <Text size="xs" fw={500}>
                    Agrofy AI
                  </Text>
                </Group>
              </motion.div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.8, delay: 1.5 }}
              >
                <Box h={6} bg="green.1" style={{ borderRadius: 999 }}>
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: '75%' }}
                    transition={{ duration: 0.8, delay: 1.7 }}
                    style={{ height: '100%' }}
                  >
                    <Box h="100%" bg="green.6" style={{ borderRadius: 999 }} />
                  </motion.div>
                </Box>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4, delay: 1.8 }}
              >
                <Text size="xs" c="dimmed">
                  Crop health: Excellent
                </Text>
              </motion.div>
            </Stack>
          </Card>
        </motion.div>
      </Box>
    </Group>
  );
};

export default Mockup;
