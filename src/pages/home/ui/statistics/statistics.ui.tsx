import { Box, Flex, Text, Grid, Card, Stack, Badge } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { FaUsers, FaMapMarkedAlt, FaGlobe } from 'react-icons/fa';
import { FaArrowTrendUp, FaArrowTrendDown } from 'react-icons/fa6';
import { useEffect, useRef, useState } from 'react';
import {
  STATS_DATA,
  BENEFITS_DATA,
  PARTNERS_DATA,
  formatNumber,
} from './statistics.const';
import styles from './statistics.module.css';
import { motion } from 'framer-motion';

// Icon components
const statsIcons = [
  <FaUsers
    key="users"
    size={24}
    style={{ color: 'var(--mantine-color-green-5)' }}
  />,
  <FaMapMarkedAlt
    key="map"
    size={24}
    style={{ color: 'var(--mantine-color-green-5)' }}
  />,
  <FaGlobe
    key="globe"
    size={24}
    style={{ color: 'var(--mantine-color-green-5)' }}
  />,
];

const benefitsIcons = [
  <FaArrowTrendUp
    key="up"
    size={20}
    style={{ color: 'var(--mantine-color-green-6)' }}
  />,
  <FaArrowTrendDown
    key="down"
    size={20}
    style={{ color: 'var(--mantine-color-green-6)' }}
  />,
];

function Statistics() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [counts, setCounts] = useState([0, 0, 0]);

  const stats = STATS_DATA.map((stat, index) => ({
    ...stat,
    icon: statsIcons[index],
  }));

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, [isVisible]);

  useEffect(() => {
    if (!isVisible) return;

    const duration = 2000; // 2 soniya
    const steps = 60;
    const stepDuration = duration / steps;

    const timers: NodeJS.Timeout[] = [];

    STATS_DATA.forEach((stat, index) => {
      let currentStep = 0;
      const increment = stat.target / steps;

      const timer = setInterval(() => {
        currentStep++;
        setCounts((prev) => {
          const newCounts = [...prev];
          if (newCounts[index] < stat.target) {
            newCounts[index] = Math.min(
              newCounts[index] + increment,
              stat.target
            );
          }
          return newCounts;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, stepDuration);

      timers.push(timer);
    });

    return () => {
      timers.forEach((timer) => clearInterval(timer));
    };
  }, [isVisible]);

  const benefits = BENEFITS_DATA.map((benefit, index) => ({
    ...benefit,
    icon: benefitsIcons[index],
  }));

  const partners = PARTNERS_DATA;

  return (
    <Box
      ref={sectionRef}
      className={styles.section}
      py={{ base: 'xl', md: 80 }}
    >
      <Container>
        <Stack gap="xl">
          {/* Top Section - Key Metrics */}
          <Grid>
            {/* Birinchi 2 ta statistik - mobile'da yonma-yon, desktop'da bir qatorda */}
            {stats.slice(0, 2).map((stat, index) => (
              <Grid.Col key={index} span={{ base: 6, md: 4 }}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Flex
                    direction="column"
                    align="center"
                    justify="center"
                    gap="md"
                    style={{ textAlign: 'center' }}
                  >
                    <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.4, delay: index * 0.1 + 0.2 }}
                    >
                      <Box>{stat.icon}</Box>
                    </motion.div>
                    <Text
                      fz={{ base: 32, md: 40 }}
                      fw={700}
                      className="textPrimary"
                    >
                      {formatNumber(counts[index], stat.target)}
                      {stat.suffix}
                    </Text>
                    <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" fw={500}>
                      {stat.label}
                    </Text>
                  </Flex>
                </motion.div>
              </Grid.Col>
            ))}
            {/* 3-chi statistik - mobile'da pastda o'rtada, desktop'da bir qatorda */}
            <Grid.Col span={{ base: 12, md: 4 }}>
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Flex
                  direction="column"
                  align="center"
                  justify="center"
                  gap="md"
                  style={{ textAlign: 'center' }}
                >
                  <motion.div
                    initial={{ scale: 0 }}
                    whileInView={{ scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: 0.4 }}
                  >
                    <Box>{stats[2].icon}</Box>
                  </motion.div>
                  <Text
                    fz={{ base: 32, md: 40 }}
                    fw={700}
                    className="textPrimary"
                  >
                    {formatNumber(counts[2], stats[2].target)}
                    {stats[2].suffix}
                  </Text>
                  <Text fz={{ base: 'sm', md: 'md' }} c="dimmed" fw={500}>
                    {stats[2].label}
                  </Text>
                </Flex>
              </motion.div>
            </Grid.Col>
          </Grid>

          {/* Middle Section - Impact/Benefits */}
          <Flex justify="center" w="100%">
            <Grid w={{ base: '100%', md: '80%' }}>
              {benefits.map((benefit, index) => (
                <Grid.Col key={index} span={{ base: 12, md: 6 }}>
                  <motion.div
                    initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.15 }}
                  >
                    <Card
                      radius="md"
                      padding="lg"
                      className={styles.benefitCard}
                    >
                      <Flex align="center" gap="md">
                        <motion.div
                          initial={{ rotate: -180, opacity: 0 }}
                          whileInView={{ rotate: 0, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{
                            duration: 0.5,
                            delay: index * 0.15 + 0.2,
                          }}
                        >
                          <Box>{benefit.icon}</Box>
                        </motion.div>
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
                  </motion.div>
                </Grid.Col>
              ))}
            </Grid>
          </Flex>

          {/* Bottom Section - Trusted Partners */}
          <Stack gap="md" align="center">
            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.5 }}
            >
              <Text
                fz={{ base: 'sm', md: 'md' }}
                c="dimmed"
                ta="center"
                fw={500}
              >
                Trusted by leading agricultural organizations worldwide
              </Text>
            </motion.div>
            <Flex gap="md" wrap="wrap" justify="center" align="center">
              {partners.map((partner, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true, amount: 0.3 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05 }}
                >
                  <Badge
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
                </motion.div>
              ))}
            </Flex>
          </Stack>
        </Stack>
      </Container>
    </Box>
  );
}

export default Statistics;
