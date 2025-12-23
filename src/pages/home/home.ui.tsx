import { Hero } from './ui/hero';
import { Statistics } from './ui/statistics';
import { Box } from '@mantine/core';

function Home() {
  return (
    <Box>
      <Hero />
      <Statistics />
    </Box>
  );
}

export default Home;
