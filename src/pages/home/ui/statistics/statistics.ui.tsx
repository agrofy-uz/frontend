import { Box, Flex, Text, Grid, Card, Stack, Badge } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { FaUsers, FaMapMarkedAlt } from 'react-icons/fa';
import { FaGlobe } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';

function Statistics() {
  const stats = [
    {
      icon: (
        <FaUsers size={24} style={{ color: 'var(--mantine-color-green-5)' }} />
      ),
      number: '1M+',
      label: 'Active Users',
    },
    {
      icon: (
        <FaMapMarkedAlt
          size={24}
          style={{ color: 'var(--mantine-color-green-5)' }}
        />
      ),
      number: '100K+',
      label: 'Connected Farms',
    },
    {
      icon: (
        <FaGlobe size={24} style={{ color: 'var(--mantine-color-green-5)' }} />
      ),
      number: '50+',
      label: 'Countries',
    },
  ];

  const benefits = [
    {
      icon: (
        <FaArrowTrendUp
          size={20}
          style={{ color: 'var(--mantine-color-green-6)' }}
        />
      ),
      value: '+30%',
      label: 'Average Productivity Increase',
    },
    {
      icon: (
        <FaArrowTrendDown
          size={20}
          style={{ color: 'var(--mantine-color-green-6)' }}
        />
      ),
      value: '-25%',
      label: 'Cost Reduction',
    },
  ];

  const partners = [
    'AgriTech Corp',
    'FarmFirst',
    'Global Seeds',
    'CropGuard',
    'AquaSmart',
    'HarvestPro',
  ];

  return (
    <Box bg="gray.1" py={{ base: 'xl', md: 80 }}>
      <Container>
        <Stack gap="xl">
          {/* Top Section - Key Metrics */}
          <Grid>
            {/* Birinchi 2 ta statistik - mobile'da yonma-yon, desktop'da bir qatorda */}
            {stats.slice(0, 2).map((stat, index) => (
              <Grid.Col key={index} span={{ base: 6, md: 4 }}>
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap="md"
                  style={{ textAlign: 'center' }}
                >
                  <Box>{stat.icon}</Box>
                  <Text fz={{ base: 32, md: 40 }} fw={700} c="gray.9">
                    {stat.number}
                  </Text>
                  <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" fw={500}>
                    {stat.label}
                  </Text>
                </Flex>
              </Grid.Col>
            ))}
            {/* 3-chi statistik - mobile'da pastda o'rtada, desktop'da bir qatorda */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <Flex
                direction="column"
                align="center"
                justify="center"
                gap="md"
                style={{ textAlign: 'center' }}
              >
                <Box>{stats[2].icon}</Box>
                <Text fz={{ base: 32, md: 40 }} fw={700} c="gray.9">
                  {stats[2].number}
                </Text>
                <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" fw={500}>
                  {stats[2].label}
                </Text>
              </Flex>
            </Grid.Col>
          </Grid>

          {/* Middle Section - Impact/Benefits */}
          <Flex justify="center" w="100%">
            <Grid w={{ base: '100%', md: '80%' }}>
              {benefits.map((benefit, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                  <Card
                    radius="md"
                    padding="lg"
                    bg="gray.0"
                    style={{
                      border: '1px solid var(--mantine-color-gray-2)',
                    }}
                  >
                    <Flex align="center" gap="md">
                      <Box>{benefit.icon}</Box>
                      <Stack gap={4}>
                        <Text fz={{ base: 24, md: 28 }} fw={700} c="green.6">
                          {benefit.value}
                        </Text>
                        <Text fz={{ base: 'sm', md: 'md' }} c="dimmed">
                          {benefit.label}
                        </Text>
                      </Stack>
                    </Flex>
                  </Card>
                </Grid.Col>
              ))}
            </Grid>
          </Flex>

          {/* Bottom Section - Trusted Partners */}
          <Stack gap="md" align="center">
            <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" ta="center" fw={500}>
              Trusted by leading agricultural organizations worldwide
            </Text>
            <Flex gap="md" wrap="wrap" justify="center" align="center">
              {partners.map((partner, index) => (
                <Badge
                  key={index}
                  size="lg"
                  variant="light"
                  color="green"
                  radius="md"
                  p="md"
                  style={{
                    fontSize: '14px',
                    fontWeight: 500,
                  }}
                >
                  {partner}
                </Badge>
              ))}
            </Flex>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Statistics;
