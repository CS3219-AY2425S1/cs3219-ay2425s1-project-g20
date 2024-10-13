import {
  AppShell,
  Avatar,
  Burger,
  Button,
  Group,
  NavLink,
  Stack,
  Text,
} from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import {
  IconDashboard,
  IconLogout,
  IconQuestionMark,
  IconUsers,
} from "@tabler/icons-react";
import {
  createFileRoute,
  Link,
  Outlet,
  redirect,
  useRouter,
} from "@tanstack/react-router";
import { userStorage } from "../utils/userStorage";
import { api } from "../api";
import { accessTokenStorage } from "../utils/accessTokenStorage";

export const Route = createFileRoute("/_authenticated")({
  component: Auth,
  loader: async () => {
    try {
      await api.userClient.verifyToken();

      const user = userStorage.getUser()!;

      return { user };
    } catch (error) {
      throw redirect({ to: "/login" });
    }
  },
});

function Auth() {
  const [opened, { toggle }] = useDisclosure();
  const router = useRouter();

  const user = userStorage.getUser()!;

  return (
    <AppShell
      header={{ height: 60 }}
      navbar={{ width: 300, breakpoint: "sm" }}
      padding="md"
    >
      <AppShell.Header>
        <Group h="100%" px="md" justify="space-between">
          <Burger opened={opened} onClick={toggle} hiddenFrom="sm" size="sm" />
          {/* Change this to logo when we have one */}
          <Text fw="bold">PeerPrep</Text>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md">
        <AppShell.Section>
          <NavLink
            label="Dashboard"
            leftSection={<IconDashboard />}
            component={Link}
            to="/"
          />
          <NavLink
            label="Matching"
            leftSection={<IconUsers />}
            component={Link}
            to="/matching"
          />  
          <NavLink
            label="Questions"
            leftSection={<IconQuestionMark />}
            component={Link}
            to="/questions"
          />
        </AppShell.Section>
        <AppShell.Section mt="auto">
          <Stack>
            <Group>
              <Avatar radius="xl" size="md" />
              <Stack gap={0}>
                <Text fw="bold">{user?.username}</Text>
                <Text>{user?.email}</Text>
              </Stack>
            </Group>
            <Button
              w="100%"
              variant="light"
              color="red"
              leftSection={<IconLogout />}
              onClick={() => {
                accessTokenStorage.removeAccessToken();
                userStorage.removeUser();
                router.navigate({ to: "/login" });
              }}
            >
              Log Out
            </Button>
          </Stack>
        </AppShell.Section>
      </AppShell.Navbar>

      <AppShell.Main>
        <Outlet />
      </AppShell.Main>
    </AppShell>
  );
}
