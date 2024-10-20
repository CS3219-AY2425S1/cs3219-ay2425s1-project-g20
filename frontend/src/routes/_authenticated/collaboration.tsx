import { Paper, Stack, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_authenticated/collaboration')({
  component: Collaboration,
});

export function Collaboration() {
  return (
    <Paper shadow='md' p='lg' withBorder>
      <Stack ta='center'>
        <Text c='dimmed' fs='italic'>
          Collaboration service coming soon...
        </Text>
      </Stack>
    </Paper>
  );
}
