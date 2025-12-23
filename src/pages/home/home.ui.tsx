import { Hero } from './ui/hero';
import { Statistics } from './ui/statistics';
import { Box } from '@mantine/core';
import { Product } from './ui/product';
import { AI } from './ui/ai';
function Home() {
  return (
    <Box>
      <Hero />
      <Statistics />
      <Product />
      <AI />
    </Box>
  );
}

export default Home;
