import { Box, Text, Stack, Grid, Card, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import { PRODUCT_MODULES } from './product.const';
import { IoChatbubbles } from 'react-icons/io5';
import { FaTint, FaEye, FaShoppingCart, FaGlobe } from 'react-icons/fa';
import styles from './product.module.css';
import { motion } from 'framer-motion';

// Icon mapping
const iconMap = {
  chat: IoChatbubbles,
  irrigation: FaTint,
  monitoring: FaEye,
  marketplace: FaShoppingCart,
  export: FaGlobe,
};

function Product() {
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
                One platform, complete agriculture solution
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
                Five integrated modules designed to cover every aspect of modern
                farming operations.
              </Text>
            </motion.div>
          </Stack>

          {/* Modules Grid */}
          <Grid w="100%" gutter={{ base: 'md', md: 'lg' }}>
            {PRODUCT_MODULES.map((module, index) => {
              const IconComponent =
                iconMap[module.icon as keyof typeof iconMap];
              return (
                <Grid.Col
                  key={index}
                  span={{ base: 12, sm: 6, md: index < 3 ? 4 : 6 }}
                >
                  <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    whileHover={{ y: -5 }}
                  >
                    <Card
                      padding="lg"
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
                              delay: index * 0.1 + 0.2,
                            }}
                            whileHover={{ rotate: 360 }}
                          >
                            <Box
                              style={{
                                color: 'var(--mantine-color-green-5)',
                              }}
                            >
                              <IconComponent size={32} />
                            </Box>
                          </motion.div>
                        )}

                        {/* Title */}
                        <Title
                          order={4}
                          fz="lg"
                          fw={600}
                          className="textPrimary"
                        >
                          {module.title}
                        </Title>

                        {/* Description */}
                        <Text fz="sm" c="dimmed" lh={1.6}>
                          {module.description}
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

export default Product;
