import { Hero } from './ui/hero';
import { Statistics } from './ui/statistics';
import { Box } from '@mantine/core';
import { Product } from './ui/product';
function Home() {
  return (
    <Box>
      <Hero />
      <Statistics />
      <Product />
    </Box>
  );
}

export default Home;
