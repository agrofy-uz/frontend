import { Box, Text, Stack, Grid, Card, Title, Badge } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { PLATFORMS } from './platforms.const';
import { FaDesktop } from 'react-icons/fa';
import { FaMobileAlt } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa';
import styles from './platforms.module.css';
import { motion } from 'framer-motion';

// Icon mapping
const iconMap = {
  web: FaDesktop,
  android: FaMobileAlt,
  ios: FaApple,
  api: FaCode,
};

function Platforms() {
  return (
    <Box py={{ base: 'xl', md: 80 }}>
      <Container>
        <Stack gap="xl" align="center">
          {/* Title and Subtitle */}
          <Stack gap="md" align="center">
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Title
                order={2}
                fz={{ base: 28, sm: 32, md: 40 }}
                fw={700}
                ta="center"
                className="textPrimary"
              >
                Available Everywhere You Need It
              </Title>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Text
                fz={{ base: 'sm', md: 'md' }}
                c="dimmed"
                ta="center"
                maw={600}
              >
                Access Agrofy on any device, anywhere. Your farm data stays
                synchronized across all platforms.
              </Text>
            </motion.div>
          </Stack>

          {/* Platforms Grid */}
          <Grid w="100%" gutter={{ base: 'md', md: 'lg' }}>
            {PLATFORMS.map((platform, index) => {
              const IconComponent =
                iconMap[platform.icon as keyof typeof iconMap];
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ scale: 1.05, y: -5 }}
                  >
                    <Card
                      padding="lg"
                      radius="md"
                      withBorder
                      className={styles.card}
                      style={{ height: '100%', textAlign: 'center' }}
                    >
                      <Stack gap="md" align="center">
                        {/* Icon */}
                        {IconComponent && (
                          <motion.div
                            initial={{ rotate: -180, scale: 0 }}
                            whileInView={{ rotate: 0, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.1 + 0.2,
                            }}
                            whileHover={{ rotate: 360 }}
                          >
                            <Box
                              style={{
                                color: 'var(--mantine-color-green-5)',
                                fontSize: '48px',
                              }}
                            >
                              <IconComponent size={48} />
                            </Box>
                          </motion.div>
                        )}

                        {/* Badge */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.3,
                            delay: index * 0.1 + 0.4,
                          }}
                        >
                          <Badge
                            size="sm"
                            variant="light"
                            color="green"
                            radius="xl"
                          >
                            {platform.badge}
                          </Badge>
                        </motion.div>

                        {/* Title */}
                        <Title
                          order={4}
                          fz="lg"
                          fw={600}
                          className="textPrimary"
                        >
                          {platform.title}
                        </Title>

                        {/* Description */}
                        <Text fz="sm" c="dimmed" lh={1.6}>
                          {platform.description}
                        </Text>
                      </Stack>
                    </Card>
                  </motion.div>
                </Grid.Col>
              );
            })}
          </Grid>
        </Stack>
      </Container>
    </Box>
  );
}

export default Platforms;
