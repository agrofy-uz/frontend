import { Box, Text, Stack, Grid, Card, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { AUDIENCE_CARDS } from './audience.const';
import { FaTractor } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';
import { FaShip } from 'react-icons/fa';
import { FaLandmark } from 'react-icons/fa';
import styles from './audience.module.css';
import { motion } from 'framer-motion';

// Icon mapping
const iconMap = {
  farmer: FaTractor,
  agribusiness: FaBuilding,
  exporter: FaShip,
  government: FaLandmark,
};

function Audience() {
  return (
    <Box py={{ base: 'xl', md: 80 }} className={styles.section}>
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
                Who Is Agrofy For?
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
                Tailored solutions for every stakeholder in the agricultural
                value chain.
              </Text>
            </motion.div>
          </Stack>

          {/* Audience Cards Grid */}
          <Grid w="100%" gutter={{ base: 'md', md: 'lg' }}>
            {AUDIENCE_CARDS.map((card, index) => {
              const IconComponent = iconMap[card.icon as keyof typeof iconMap];
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                    whileHover={{ y: -10 }}
                  >
                    <Card
                      padding="xl"
                      radius="md"
                      withBorder
                      className={styles.card}
                      style={{ height: '100%' }}
                    >
                      <Stack gap="md">
                        {/* Icon */}
                        {IconComponent && (
                          <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            whileInView={{ scale: 1, rotate: 0 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.15 + 0.2,
                            }}
                            whileHover={{ rotate: 360, scale: 1.1 }}
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

                        {/* Title */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.15 + 0.3,
                          }}
                        >
                          <Title
                            order={4}
                            fz="lg"
                            fw={600}
                            className="textPrimary"
                          >
                            {card.title}
                          </Title>
                        </motion.div>

                        {/* Description */}
                        <motion.div
                          initial={{ opacity: 0 }}
                          whileInView={{ opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.15 + 0.4,
                          }}
                        >
                          <Text fz="sm" c="dimmed" lh={1.6}>
                            {card.description}
                          </Text>
                        </motion.div>

                        {/* Detail */}
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: index * 0.15 + 0.5,
                          }}
                          style={{ marginTop: 'auto' }}
                        >
                          <Text fz="sm" fw={500} c="green.6">
                            {card.detail}
                          </Text>
                        </motion.div>
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

export default Audience;
