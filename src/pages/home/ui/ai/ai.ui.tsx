import { Box, Card, Flex, Stack, Text, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { FaDatabase, FaLightbulb } from 'react-icons/fa';
import { FaBrain } from 'react-icons/fa6';
import { AI_STEPS, AI_SUBTITLE, AI_TITLE } from './ai.const';
import styles from './ai.module.css';

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
            <Title
              order={2}
              fz={{ base: 28, sm: 32, md: 40 }}
              fw={700}
              ta="center"
              className="textPrimary"
            >
              {AI_TITLE}
            </Title>
            <Text
              fz={{ base: 'sm', md: 'md' }}
              ta="center"
              maw={600}
              className="textSecondary"
            >
              {AI_SUBTITLE}
            </Text>
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
                    <Box className={styles.stepWrap}>
                      <Box className={styles.number}>{step.number}</Box>

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
                            <Box className={styles.iconBox}>
                              <IconComponent size={28} />
                            </Box>
                          )}

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

                          <Text
                            fz="sm"
                            ta="center"
                            lh={1.7}
                            className={`${styles.desc} textSecondary`}
                          >
                            {step.description}
                          </Text>
                        </Stack>
                      </Card>
                    </Box>

                    {!isLast && <Box className={styles.connector} />}
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
