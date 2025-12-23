import { Box, Text, Stack, Grid, Card, Title, Badge } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import {
  PLATFORMS_TITLE,
  PLATFORMS_SUBTITLE,
  PLATFORMS,
} from './platforms.const';
import { FaDesktop } from 'react-icons/fa';
import { FaMobileAlt } from 'react-icons/fa';
import { FaApple } from 'react-icons/fa';
import { FaCode } from 'react-icons/fa';

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
            <Title
              order={2}
              fz={{ base: 28, sm: 32, md: 40 }}
              fw={700}
              ta="center"
              c="gray.9"
            >
              {PLATFORMS_TITLE}
            </Title>
            <Text
              fz={{ base: 'sm', md: 'md' }}
              c="dimmed"
              ta="center"
              maw={600}
            >
              {PLATFORMS_SUBTITLE}
            </Text>
          </Stack>

          {/* Platforms Grid */}
          <Grid w="100%" gutter={{ base: 'md', md: 'lg' }}>
            {PLATFORMS.map((platform, index) => {
              const IconComponent =
                iconMap[platform.icon as keyof typeof iconMap];
              return (
                <Grid.Col key={index} span={{ base: 12, sm: 6, md: 3 }}>
                  <Card
                    padding="lg"
                    radius="md"
                    bg="gray.0"
                    withBorder
                    style={{
                      borderColor: 'var(--mantine-color-gray-2)',
                      height: '100%',
                      textAlign: 'center',
                      transition:
                        'border-color 0.3s ease, box-shadow 0.3s ease',
                      cursor: 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--mantine-color-green-5)';
                      e.currentTarget.style.boxShadow =
                        '0 4px 12px rgba(0, 0, 0, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor =
                        'var(--mantine-color-gray-2)';
                      e.currentTarget.style.boxShadow = 'none';
                    }}
                  >
                    <Stack gap="md" align="center">
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

                      {/* Badge */}
                      <Badge
                        size="sm"
                        variant="light"
                        color="green"
                        radius="xl"
                      >
                        {platform.badge}
                      </Badge>

                      {/* Title */}
                      <Title order={4} fz="lg" fw={600} c="gray.9">
                        {platform.title}
                      </Title>

                      {/* Description */}
                      <Text fz="sm" c="dimmed" lh={1.6}>
                        {platform.description}
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

export default Platforms;
