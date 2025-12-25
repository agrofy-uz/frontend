import { Box, Text, Stack, Flex, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { REGIONS_FEATURES, REGIONS_STAT, REGIONS_KPIS } from './regions.const';
import { FaGlobe } from 'react-icons/fa';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { IoLanguage } from 'react-icons/io5';
import { FiCpu } from 'react-icons/fi';
import styles from './regions.module.css';
import { motion } from 'framer-motion';

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
          pb={{ base: '100px', md: 0 }}
        >
          {/* Left Side - Content */}
          <Stack gap="lg" style={{ flex: 1, maxWidth: '600px' }}>
            {/* Title with Globe Icon */}
            <Flex align="start" gap="sm" direction="column">
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5 }}
                whileHover={{ rotate: 360 }}
              >
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
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                style={{ flex: 1 }}
              >
                <Title
                  order={2}
                  fz={{ base: 24, sm: 28, md: 32 }}
                  fw={700}
                  className="textPrimary"
                >
                  Building the Future of Agriculture Across Regions
                </Title>
              </motion.div>
            </Flex>

            {/* Description */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" lh={1.7}>
                Our vision is to empower every farmer on the planet with
                AI-driven insights. From small family farms to large
                agribusiness operations, Agrofy adapts to local conditions while
                maintaining global standards.
              </Text>
            </motion.div>

            {/* KPI pills */}
            <Box className={styles.kpiRow}>
              {REGIONS_KPIS.map((kpi, index) => (
                <motion.div
                  key={kpi.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.4, delay: 0.4 + index * 0.1 }}
                  whileHover={{ scale: 1.1 }}
                  className={styles.kpiPill}
                >
                  <Text span className={styles.kpiValue}>
                    {kpi.value}
                  </Text>
                  <Text span className={styles.kpiLabel}>
                    {kpi.label}
                  </Text>
                </motion.div>
              ))}
            </Box>

            {/* Features List */}
            <Stack gap="md" mt="md">
              {REGIONS_FEATURES.map((feature, index) => {
                const IconComponent =
                  iconMap[feature.icon as keyof typeof iconMap];
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <Flex align="flex-start" gap="md">
                      {IconComponent && (
                        <motion.div
                          initial={{ rotate: -180, scale: 0 }}
                          whileInView={{ rotate: 0, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.4,
                            delay: 0.5 + index * 0.1 + 0.2,
                          }}
                          whileHover={{ rotate: 360 }}
                        >
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
                        </motion.div>
                      )}
                      <Box style={{ flex: 1 }}>
                        <Text fw={600} fz="md" mb={4} className="textPrimary">
                          {feature.title}:
                        </Text>
                        <Text fz="sm" c="dimmed" lh={1.6}>
                          {feature.description}
                        </Text>
                      </Box>
                    </Flex>
                  </motion.div>
                );
              })}
            </Stack>
          </Stack>

          {/* Right Side - Circle Stat */}
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            className={styles.circleContainer}
          >
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
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.5 }}
              className={styles.mainCircle}
            >
              <motion.div
                initial={{ rotate: -360 }}
                whileInView={{ rotate: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 1, delay: 0.7 }}
                className={styles.globeIcon}
              >
                <FaGlobe size={48} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.9 }}
              >
                <Text
                  fz={{ base: '36px', md: '48px' }}
                  fw={700}
                  c="gray.9"
                  lh={1}
                >
                  {REGIONS_STAT.number}
                </Text>
              </motion.div>
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 1 }}
              >
                <Text fz="md" c="dimmed" mt={4}>
                  {REGIONS_STAT.label}
                </Text>
              </motion.div>
            </motion.div>
          </motion.div>
        </Flex>
      </Container>
    </Box>
  );
}

export default Regions;
