import { Box, Text, Stack, Grid, Card, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import {
  AUDIENCE_TITLE,
  AUDIENCE_SUBTITLE,
  AUDIENCE_CARDS,
} from './audience.const';
import { FaTractor } from 'react-icons/fa';
import { FaBuilding } from 'react-icons/fa';
import { FaShip } from 'react-icons/fa';
import { FaLandmark } from 'react-icons/fa';
import styles from './audience.module.css';

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
            <Title
              order={2}
              fz={{ base: 28, sm: 32, md: 40 }}
              fw={700}
              ta="center"
              className="textPrimary"
            >
              {AUDIENCE_TITLE}
            </Title>
            <Text
              fz={{ base: 'sm', md: 'md' }}
              c="dimmed"
              ta="center"
              maw={600}
            >
              {AUDIENCE_SUBTITLE}
            </Text>
          </Stack>

          {/* Audience Cards Grid */}
          <Grid w="100%" gutter={{ base: 'md', md: 'lg' }}>
            {AUDIENCE_CARDS.map((card, index) => {
              const IconComponent = iconMap[card.icon as keyof typeof iconMap];
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6 }}>
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
                        <Box
                          style={{
                            color: 'var(--mantine-color-green-5)',
                            fontSize: '48px',
                          }}
                        >
                          <IconComponent size={48} />
                        </Box>
                      )}

                      {/* Title */}
                      <Title order={4} fz="lg" fw={600} className="textPrimary">
                        {card.title}
                      </Title>

                      {/* Description */}
                      <Text fz="sm" c="dimmed" lh={1.6}>
                        {card.description}
                      </Text>

                      {/* Detail */}
                      <Text
                        fz="sm"
                        fw={500}
                        c="green.6"
                        style={{ marginTop: 'auto' }}
                      >
                        {card.detail}
                      </Text>
                    </Stack>
                  </Card>
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
