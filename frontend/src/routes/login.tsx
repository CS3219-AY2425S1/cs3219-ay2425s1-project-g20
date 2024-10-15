import { createFileRoute, Link } from '@tanstack/react-router';
import { api } from '../api';
import { Anchor, Paper, Stack, Text, Title } from '@mantine/core';
import { LoginForm } from '../components/Auth/LoginForm';

export const Route = createFileRoute('/login')({
  loader: async () => {
    try {
      const user = await api.userClient.verifyToken();
      if (user) {
        window.location.href = '/';
      }
    } catch (error) {
      console.error(error);
    }
  },
  component: Index,
});

function Index() {
  return (
    <Stack h='100vh' justify='center' mx='auto' w={420}>
      <Title ta='center'>PeerPrep</Title>
      <Text c='dimmed' size='sm' ta='center'>
        Do not have an account yet?{' '}
        <Anchor size='sm' component={Link} to={'/signup'}>
          Sign up here
        </Anchor>
      </Text>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <LoginForm />
      </Paper>
    </Stack>
  );
}
