import { Hero } from './ui/hero';
import { Statistics } from './ui/statistics';
import { Box } from '@mantine/core';
import { Product } from './ui/product';
import { AI } from './ui/ai';
import { Platforms } from './ui/platforms';
import { Audience } from './ui/audience';
import { Regions } from './ui/regions';
import { CTA } from './ui/cta';

function Home() {
  return (
    <Box>
      <Box id="hero">
        <Hero />
      </Box>
      <Box id="statistics">
        <Statistics />
      </Box>
      <Box id="product">
        <Product />
      </Box>
      <Box id="ai">
        <AI />
      </Box>
      <Box id="platforms">
        <Platforms />
      </Box>
      <Box id="audience">
        <Audience />
      </Box>
      <Box id="regions">
        <Regions />
      </Box>
      <Box id="cta">
        <CTA />
      </Box>
    </Box>
  );
}

export default Home;
