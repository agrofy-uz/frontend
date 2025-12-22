import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/container';
import { Title, Text } from '@mantine/core';

function Home() {
  return (
    <Container py="xl">
      <Title order={1} mb="md">
        Welcome to Agrofy Template
      </Title>
      <Text mb="lg" c="dimmed">
        Bu minimal shablon. Yangi loyiha boshlash uchun tayyor.
      </Text>
      <Button onClick={() => console.log('Button clicked')}>Boshlash</Button>
    </Container>
  );
}

export default Home;
