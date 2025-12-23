import { Box, Text, Stack, Grid, Card, Title } from '@mantine/core';
import { Container } from '@/shared/ui/container';
import {
  PRODUCT_TITLE,
  PRODUCT_SUBTITLE,
  PRODUCT_MODULES,
} from './product.const';
import { IoChatbubbles } from 'react-icons/io5';
import { FaTint, FaEye, FaShoppingCart, FaGlobe } from 'react-icons/fa';
import styles from './product.module.css';

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
            <Title
              order={2}
              fz={{ base: 28, sm: 32, md: 40 }}
              fw={700}
              ta="center"
              className="textPrimary"
            >
              {PRODUCT_TITLE}
            </Title>
            <Text
              fz={{ base: 'sm', md: 'md' }}
              c="dimmed"
              ta="center"
              maw={600}
            >
              {PRODUCT_SUBTITLE}
            </Text>
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
                        <Box
                          style={{
                            color: 'var(--mantine-color-green-5)',
                          }}
                        >
                          <IconComponent size={32} />
                        </Box>
                      )}

                      {/* Title */}
                      <Title order={4} fz="lg" fw={600} className="textPrimary">
                        {module.title}
                      </Title>

                      {/* Description */}
                      <Text fz="sm" c="dimmed" lh={1.6}>
                        {module.description}
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

export default Product;
