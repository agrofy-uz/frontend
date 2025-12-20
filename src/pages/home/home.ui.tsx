import { Button } from '@/shared/ui/button';
import { Container } from '@/shared/ui/Container';

function Home() {
  return (
    <Container>
      <Button onClick={() => console.log('clicked')}>Click me</Button>
    </Container>
  );
}

export default Home;
