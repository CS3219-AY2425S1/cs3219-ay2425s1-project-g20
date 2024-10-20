import { Paper, Stack, Text, Title } from '@mantine/core';
import { createFileRoute } from '@tanstack/react-router';
import { userStorage } from '../../utils/userStorage';

export const Route = createFileRoute('/_authenticated/')({
  component: Component,
});

function Component() {
  const user = userStorage.getUser()!;

  return (
    <Paper shadow='md' w={400} p='md' withBorder mx='auto' radius='md'>
      <Stack ta='center'>
        <Title size=''>Welcome back,</Title>
        <Text>{user.username}!</Text>
      </Stack>
    </Paper>
  );
}
