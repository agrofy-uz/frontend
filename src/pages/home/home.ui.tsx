import { Hero } from './ui/hero';
import { Statistics } from './ui/statistics';
import { Box } from '@mantine/core';
import { Product } from './ui/product';
import { AI } from './ui/ai';
import { Platforms } from './ui/platforms';
import { Audience } from './ui/audience';
import { Regions } from './ui/regions';
function Home() {
  return (
    <Box>
      <Hero />
      <Statistics />
      <Product />
      <AI />
      <Platforms />
      <Audience />
      <Regions />
    </Box>
  );
}

export default Home;
