import { Box, Text, Stack, Flex, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import {
  REGIONS_TITLE,
  REGIONS_DESCRIPTION,
  REGIONS_FEATURES,
  REGIONS_STAT,
  REGIONS_KPIS,
} from './regions.const';
import { FaGlobe } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';
import { FiCpu } from 'react-icons/fi';
import styles from './regions.module.css';

// Icon mapping
const iconMap = {
  language: IoLanguage,
  location: FaMapMarkerAlt,
  scalable: FiCpu,
};

function Regions() {
  return (
    <Box py={{ base: 'xl', md: 80 }} className={styles.section}>
      <Container>
        <Flex
          direction={{ base: 'column', md: 'row' }}
          align="center"
          justify="space-between"
          gap={{ base: 'xl', md: 'xl' }}
        >
          {/* Left Side - Content */}
          <Stack gap="lg" style={{ flex: 1, maxWidth: '600px' }}>
            {/* Title with Globe Icon */}
            <Flex align="start" gap="sm" direction="column">
              <Box
                style={{
                  color: 'var(--mantine-color-green-5)',
                  fontSize: '24px',
                  width: '50px',
                  height: '50px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
                bg="green.2"
                p="md"
                bdrs="lg"
              >
                <FaGlobe size={24} />
              </Box>
              <Title
                order={2}
                fz={{ base: 24, sm: 28, md: 32 }}
                fw={700}
                className="textPrimary"
                style={{ flex: 1 }}
              >
                {REGIONS_TITLE}
              </Title>
            </Flex>

            {/* Description */}
            <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" lh={1.7}>
              {REGIONS_DESCRIPTION}
            </Text>

            {/* KPI pills */}
            <Box className={styles.kpiRow}>
              {REGIONS_KPIS.map((kpi) => (
                <Box key={kpi.label} className={styles.kpiPill}>
                  <Text span className={styles.kpiValue}>
                    {kpi.value}
                  </Text>
                  <Text span className={styles.kpiLabel}>
                    {kpi.label}
                  </Text>
                </Box>
              ))}
            </Box>

            {/* Features List */}
            <Stack gap="md" mt="md">
              {REGIONS_FEATURES.map((feature, index) => {
                const IconComponent =
                  iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <Flex key={index} align="flex-start" gap="md">
                    {IconComponent && (
                      <Box
                        style={{
                          color: 'var(--mantine-color-green-5)',
                          width: '40px',
                          height: '40px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                        }}
                        bg="gray.2"
                        bdrs="lg"
                      >
                        <IconComponent size={20} />
                      </Box>
                    )}
                    <Box style={{ flex: 1 }}>
                      <Text fw={600} fz="md" c="gray.9" mb={4}>
                        {feature.title}:
                      </Text>
                      <Text fz="sm" c="dimmed" lh={1.6}>
                        {feature.description}
                      </Text>
                    </Box>
                  </Flex>
                );
              })}
            </Stack>
          </Stack>

          {/* Right Side - Circle Stat */}
          <Box className={styles.circleContainer}>
            {/* Outer Rotating Circle with Dots */}
            <Box className={styles.outerRotatingCircle} />
            <Box className={styles.outerDashedCircleSoft} />
            <Box className={styles.dots}>
              <Box className={styles.dot} />
              <Box className={styles.dot} />
              <Box className={styles.dot} />
              <Box className={styles.dot} />
              <Box className={styles.dot} />
              <Box className={styles.dot} />
            </Box>

            {/* Outer Dashed Circle */}
            <Box className={styles.outerDashedCircle} />

            {/* Main Circle */}
            <Box className={styles.mainCircle}>
              <Box className={styles.globeIcon}>
                <FaGlobe size={48} />
              </Box>
              <Text
                fz={{ base: '36px', md: '48px' }}
                fw={700}
                c="gray.9"
                lh={1}
              >
                {REGIONS_STAT.number}
              </Text>
              <Text fz="md" c="dimmed" mt={4}>
                {REGIONS_STAT.label}
              </Text>
            </Box>
          </Box>
        </Flex>
      </Container>
    </Box>
  );
}

export default Regions;
