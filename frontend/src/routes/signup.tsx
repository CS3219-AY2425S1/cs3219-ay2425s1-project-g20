import { Anchor, Paper, Stack, Text, Title } from '@mantine/core';
import { createFileRoute, Link } from '@tanstack/react-router';
import { SignUpForm } from '../components/Auth/SignUpForm';
import { api } from '../api';

export const Route = createFileRoute('/signup')({
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
        Already have an account?{' '}
        <Anchor size='sm' component={Link} to={'/login'}>
          Login here
        </Anchor>
      </Text>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <SignUpForm />
      </Paper>
    </Stack>
  );
}
