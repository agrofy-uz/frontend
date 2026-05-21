import { useState } from 'react';
import { Button, Stack, Text } from '@mantine/core';
import { SiriWavePlayer } from './SiriWavePlayer';

/** Demo: Start / Stop — `isActive` bilan boshqarish */
export function SiriWavePlayerDemo() {
  const [isActive, setIsActive] = useState(true);

  return (
    <Stack align="center" gap="md" py="md">
      <SiriWavePlayer
        width={300}
        height={120}
        speed={0.2}
        amplitude={1}
        color="#22c55e"
        isActive={isActive}
      />
      <Text size="sm" c="dimmed">
        Holat: {isActive ? 'ishlayapti' : 'to‘xtatilgan'}
      </Text>
      <Button
        variant="light"
        color="green"
        radius="xl"
        onClick={() => setIsActive((prev) => !prev)}
      >
        {isActive ? 'Stop' : 'Start'}
      </Button>
    </Stack>
  );
}
