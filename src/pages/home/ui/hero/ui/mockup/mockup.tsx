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

const Mockup = () => {
  return (
    <Group justify="flex-end" pos="relative" className={styles.mockupContainer}>
      <Box maw={600} w="100%" pos="relative">
        {/* Desktop mockup */}
        <Card radius="xl" shadow="xl" withBorder p={0}>
          {/* Top bar */}
          <Group gap="xs" px="md" py="sm" className={styles.topBar}>
            <Group gap={6}>
              <Box w={12} h={12} bg="red.5" style={{ borderRadius: '50%' }} />
              <Box
                w={12}
                h={12}
                bg="yellow.5"
                style={{ borderRadius: '50%' }}
              />
              <Box w={12} h={12} bg="green.5" style={{ borderRadius: '50%' }} />
            </Group>
            <Box
              mx="auto"
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
          </Group>

          {/* Content */}
          <Stack p="md" gap="md">
            {/* User message */}
            <Flex align="center" gap="xs">
              <Avatar radius="50%" bg="green.3" variant="light">
                <FaLaptop
                  size={16}
                  style={{ color: 'var(--mantine-color-green-8)' }}
                />
              </Avatar>
              <Card radius="md" bg="green.1" p="sm" w="100%">
                <Text size="sm">
                  What's the best time to irrigate my corn field today?
                </Text>
              </Card>
            </Flex>

            {/* AI message */}
            <Flex align="center" gap="xs" justify="flex-end">
              <Card radius="md" bg="green.2" p="sm" w="100%">
                <Text size="sm">
                  Based on soil moisture data and weather forecast, I recommend
                  irrigating between 6–8 AM. Expected efficiency: +23%
                </Text>
              </Card>
              <Avatar radius="50%" bg="green.6">
                <Text size="xs" fw={700} c="white">
                  AI
                </Text>
              </Avatar>
            </Flex>

            {/* User message 2 */}
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

            {/* AI message 2 */}
            <Flex align="center" gap="xs" justify="flex-end">
              <Card radius="md" bg="green.2" p="sm" w="100%">
                <Text size="sm">
                  For optimal growth, apply nitrogen-rich fertilizer in early
                  spring. I suggest 150kg per hectare for maximum yield.
                </Text>
              </Card>
              <Avatar radius="50%" bg="green.6">
                <Text size="xs" fw={700} c="white">
                  AI
                </Text>
              </Avatar>
            </Flex>

            {/* Stats */}
            <Grid mt="lg">
              <Grid.Col span={4}>
                <Card
                  className={styles.statCard}
                  radius="md"
                  p="xs"
                  ta="center"
                >
                  <Text size="xs" c="dimmed">
                    Humidity
                  </Text>
                  <Text fw={600} c="green">
                    68%
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card
                  className={styles.statCard}
                  radius="md"
                  p="xs"
                  ta="center"
                >
                  <Text size="xs" c="dimmed">
                    Temp
                  </Text>
                  <Text fw={600} c="green">
                    24°C
                  </Text>
                </Card>
              </Grid.Col>
              <Grid.Col span={4}>
                <Card
                  className={styles.statCard}
                  radius="md"
                  p="xs"
                  ta="center"
                >
                  <Text size="xs" c="dimmed">
                    Wind
                  </Text>
                  <Text fw={600} c="green">
                    12 km/h
                  </Text>
                </Card>
              </Grid.Col>
            </Grid>
          </Stack>
        </Card>

        {/* Mobile floating mockup */}
        <Card
          className={styles.mobileCard}
          radius="xl"
          shadow="lg"
          withBorder
          w={200}
          pos="absolute"
          bottom={{ base: -110, md: -40 }}
          left={{ base: '18%', md: -40 }}
          p={0}
        >
          <Box py={6} className={styles.mobileTopBar}>
            <Box
              mx="auto"
              w={48}
              h={4}
              bg="gray.4"
              style={{ borderRadius: 999 }}
            />
          </Box>

          <Stack p="md" gap={6}>
            <Group gap="xs">
              <FaRobot
                size={16}
                style={{ color: 'var(--mantine-color-green-6)' }}
              />
              <Text size="xs" fw={500}>
                Agrofy AI
              </Text>
            </Group>

            <Box h={6} bg="green.1" style={{ borderRadius: 999 }}>
              <Box
                h="100%"
                w="75%"
                bg="green.6"
                style={{ borderRadius: 999 }}
              />
            </Box>

            <Text size="xs" c="dimmed">
              Crop health: Excellent
            </Text>
          </Stack>
        </Card>
      </Box>
    </Group>
  );
};

export default Mockup;
