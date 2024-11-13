import { UserRoomCreatedData } from "@common/shared-types";
import { useCopilotChat, useCopilotReadable } from "@copilotkit/react-core";
import { CopilotPopup } from "@copilotkit/react-ui";
import "@copilotkit/react-ui/styles.css";
import {
  Avatar,
  Badge,
  Button,
  Grid,
  Group,
  Paper,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconBrandOpenai, IconLoader, IconX } from "@tabler/icons-react";
import { useQuery } from "@tanstack/react-query";
import {
  createFileRoute,
  useNavigate,
  useRouterState
} from "@tanstack/react-router";
import { AxiosError } from "axios";
import { useState } from "react";
import { api } from "../../api";
import Chat from "../../components/Collaboration/Chat";
import CodingEditor from "../../components/Collaboration/CodingEditor";
import { leetCodePrompt } from "../../components/Copilot/prompts";
import { stringToHexColor } from "../../components/Questions/QuestionsTable";
import "./collaboration.css";

export const Route = createFileRoute("/_authenticated/collaboration/$roomId")({
  component: Collaboration,
});

export function Collaboration() {
  const [code, setCode] = useState<string>("");

  useCopilotChat({ initialMessages: [] });

  // Get room data from router state
  const locationState = useRouterState({
    select: (state) => state.location.state,
  });
  const { roomId } = Route.useParams();
  const navigate = useNavigate();

  const {
    data: userRoomData,
    isLoading,
    isError,
    isSuccess,
  } = useQuery({
    queryKey: ["userRoomData", { roomId }],
    queryFn: async () => {
      try {
        return await api.roomClient.getRoom(roomId);
      } catch (error) {
        console.error(error);

        if (
          error instanceof AxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          if (error.response.data === "User is not part of the room") {
            navigate({
              to: "/matching",
            });
          } else {
            navigate({
              to: "/",
            });
          }

          notifications.show({
            color: "red",
            title: "Error fetching Room",
            message: error.response.data,
          });
        }

        notifications.show({
          color: "red",
          title: "Error fetching Room",
          message: `${(error as Error).message}`,
        });
        throw error;
      }
    },
    initialData: locationState.userRoomData as UserRoomCreatedData,
  });

  const onCodeChange = (newCode: string) => {
    setCode(newCode);
  };

  useCopilotReadable({
    description: "Question given",
    value: userRoomData?.question.title + userRoomData?.question.description,
  });

  useCopilotReadable({
    description: "Code written by user",
    value: code,
  });

  const exitRoom = () => {
    navigate({
      to: "/matching",
    });
  };

  return (
    <Stack align="center" h="80vh">
      <CopilotPopup
        labels={{
          title: "Peerprep Sensei",
          initial: "Hi, PeerPrep Sensei here. Need any help?",
        }}
        instructions={leetCodePrompt}
        clickOutsideToClose={false}
        icons={{ openIcon: <IconBrandOpenai /> }}
      />

      <Title ta="center">Collaboration</Title>
      {isLoading ? (
        <Paper shadow="md" withBorder p="lg">
          <Stack align="center">
            <Avatar color="blue">
              <IconLoader />
            </Avatar>
            <Text c="black" fw="bold">
              Loading...
            </Text>
          </Stack>
        </Paper>
      ) : isSuccess ? (
        <Grid w="100%">
          <Grid.Col span={{ base: 12, xs: 8 }}>
            <CodingEditor
              isOpen={userRoomData.isOpen}
              roomId={roomId}
              onCodeChange={onCodeChange}
            />
          </Grid.Col>

          <Grid.Col span={{ base: 12, xs: 4 }}>
            <Stack>
              <Paper w="auto" shadow="md" p="lg" withBorder>
                <Stack gap={10}>
                  <Title c="black" order={3}>
                    {userRoomData.question.title}
                  </Title>
                  <Group gap={5} align="flex-start">
                    {userRoomData.question.categories.map((category) => (
                      <Badge
                        key={category}
                        size="sm"
                        autoContrast
                        bg={stringToHexColor(category)}
                      >
                        {category}
                      </Badge>
                    ))}
                  </Group>
                  <Text c="black">{userRoomData.question.description}</Text>
                </Stack>
              </Paper>
              <Chat w="auto" shadow="md" p="lg" withBorder />
              <Button color="black" w="10vw" onClick={exitRoom}>
                Exit Room
              </Button>
            </Stack>
          </Grid.Col>
        </Grid>
      ) : isError ? (
        <Paper shadow="md" withBorder p="lg">
          <Stack align="center">
            <Avatar color="red">
              <IconX />
            </Avatar>
            <Text c="black" fw="bold">
              Error fetching room
            </Text>
          </Stack>
        </Paper>
      ) : null}
    </Stack>
  );
}
