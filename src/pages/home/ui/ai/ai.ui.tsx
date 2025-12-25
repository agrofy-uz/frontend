import { Box, Card, Flex, Stack, Text, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { FaDatabase, FaLightbulb } from 'react-icons/fa';
import { FaBrain } from 'react-icons/fa6';
import { AI_STEPS } from './ai.const';
import styles from './ai.module.css';
import { motion } from 'framer-motion';

const iconMap = {
  database: FaDatabase,
  brain: FaBrain,
  recommendation: FaLightbulb,
} as const;

function AI() {
  return (
    <Box py={{ base: 'xl', md: 80 }} className={styles.section}>
      <Container>
        <Stack gap="xl" align="center">
          <Stack gap="md" align="center" className={styles.heading}>
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
                How Agrofy Works
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
                ta="center"
                maw={600}
                className="textSecondary"
              >
                A simple three-step process that transforms your farming
                operations with AI.
              </Text>
            </motion.div>
          </Stack>

          <Box w="100%">
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="center"
              wrap="nowrap"
              className={styles.steps}
            >
              {AI_STEPS.map((step, index) => {
                const IconComponent =
                  iconMap[step.icon as keyof typeof iconMap];
                const isLast = index === AI_STEPS.length - 1;

                return (
                  <Flex
                    key={step.number}
                    align="center"
                    gap={0}
                    className={styles.stepRow}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, amount: 0.3 }}
                      transition={{ duration: 0.6, delay: index * 0.2 }}
                      className={styles.stepWrap}
                    >
                      <motion.div
                        initial={{ scale: 0, rotate: -180 }}
                        whileInView={{ scale: 1, rotate: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.3 }}
                        className={styles.number}
                      >
                        {step.number}
                      </motion.div>

                      <Card
                        padding="xl"
                        radius="md"
                        withBorder
                        className={styles.card}
                      >
                        <Stack
                          gap="md"
                          align="center"
                          className={styles.cardInner}
                        >
                          {IconComponent && (
                            <motion.div
                              initial={{ scale: 0, rotate: -180 }}
                              whileInView={{ scale: 1, rotate: 0 }}
                              viewport={{ once: true }}
                              transition={{
                                duration: 0.5,
                                delay: index * 0.2 + 0.4,
                              }}
                              whileHover={{ rotate: 360, scale: 1.1 }}
                              className={styles.iconBox}
                            >
                              <IconComponent size={28} />
                            </motion.div>
                          )}

                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.2 + 0.5,
                            }}
                          >
                            <Title
                              order={4}
                              fz="lg"
                              fw={700}
                              ta="center"
                              lh={1.25}
                              className={`${styles.title} textPrimary`}
                            >
                              {step.title}
                            </Title>
                          </motion.div>

                          <motion.div
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{
                              duration: 0.5,
                              delay: index * 0.2 + 0.6,
                            }}
                          >
                            <Text
                              fz="sm"
                              ta="center"
                              lh={1.7}
                              className={`${styles.desc} textSecondary`}
                            >
                              {step.description}
                            </Text>
                          </motion.div>
                        </Stack>
                      </Card>
                    </motion.div>

                    {!isLast && (
                      <motion.div
                        initial={{ scaleX: 0 }}
                        whileInView={{ scaleX: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: index * 0.2 + 0.7 }}
                        className={styles.connector}
                      />
                    )}
                  </Flex>
                );
              })}
            </Flex>
          </Box>
        </Stack>
      </Container>
    </Box>
  );
}

export default AI;
