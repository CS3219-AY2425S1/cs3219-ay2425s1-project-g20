import { Question } from "@common/shared-types";
import {
  ActionIcon,
  Badge,
  Group,
  Loader,
  Paper,
  Spoiler,
  Stack,
  Table,
  Text,
} from "@mantine/core";
import { modals } from "@mantine/modals";
import { notifications } from "@mantine/notifications";
import { IconEdit, IconTrash } from "@tabler/icons-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { api } from "../../api";
import { fetchQuestions } from "../../queries/questionQueries";
import { userStorage } from "../../utils/userStorage";
import { QuestionForm } from "./QuestionForm";

const COMPLEXITY_COLOR_MAP: Record<Question["complexity"], string> = {
  Easy: "green",
  Medium: "orange",
  Hard: "red",
};

export function stringToHexColor(str: string) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Generate the RGB values and form the color
  let color = "#";
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    color += value.toString(16).padStart(2, "0");
  }

  return color;
}

export function QuestionTable() {
  const queryClient = useQueryClient();

  const user = userStorage.getUser()!;

  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    initialData: [],
  });

  const { mutateAsync: deleteQuestionMutation } = useMutation({
    mutationFn: async (id: string) => {
      try {
        return await api.questionClient.deleteQuestion(id);
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: ({ id }) => {
      notifications.show({
        color: "green",
        message: "Successfully deleted question",
      });
      queryClient.setQueryData<Question[]>(["questions"], (prev) =>
        prev?.filter((question) => question.id !== id)
      );
    },
    onError: (error) => {
      if (error instanceof AxiosError) {
        if (error.response?.status === 403) {
          notifications.show({
            color: "red",
            title: "Unauthorized",
            message: "You are not authorized to delete this question",
          });
        }
        return;
      }

      notifications.show({
        color: "red",
        title: "Error deleting questions",
        message: `${(error as Error).message}`,
      });
    },
  });

  if (isLoading) {
    return (
      <Stack>
        <Loader mx="auto" />
        <Text ta="center">Loading questions...</Text>
      </Stack>
    );
  } else {
    const rows = questions.map((question, index) => (
      <Table.Tr key={question.id}>
        <Table.Td>{index + 1}</Table.Td>
        <Table.Td maw={100} fw="bold">
          {question.title}
        </Table.Td>
        <Table.Td maw={540}>
          <Spoiler
            fz="sm"
            className="whitespace-pre-wrap"
            maxHeight={110}
            showLabel="..."
            hideLabel="Hide"
          >
            {question.description}
          </Spoiler>
        </Table.Td>
        <Table.Td>
          <Stack gap={2} align="flex-start">
            {question.categories.map((category) => (
              <Badge
                key={category}
                size="sm"
                autoContrast
                bg={stringToHexColor(category)}
              >
                {category}
              </Badge>
            ))}
          </Stack>
        </Table.Td>
        <Table.Td>
          <Text c={COMPLEXITY_COLOR_MAP[question.complexity]}>
            {question.complexity}
          </Text>
        </Table.Td>
        {user.isAdmin && (
          <Table.Td>
            <Group wrap="nowrap">
              <ActionIcon
                variant="light"
                onClick={() => {
                  modals.open({
                    title: <Text fw="bold">Editing Question</Text>,
                    children: (
                      <QuestionForm
                        initialValues={{
                          ...question,
                        }}
                      />
                    ),
                  });
                }}
              >
                <IconEdit />
              </ActionIcon>
              <ActionIcon
                variant="light"
                color="red"
                onClick={() => {
                  modals.openConfirmModal({
                    title: `Please confirm your action`,
                    children: (
                      <Text>You are about to delete "{question.title}"</Text>
                    ),
                    labels: { confirm: "Delete", cancel: "Cancel" },
                    confirmProps: { color: "red" },
                    onConfirm: async () => {
                      await deleteQuestionMutation(question.id);
                    },
                  });
                }}
              >
                <IconTrash />
              </ActionIcon>
            </Group>
          </Table.Td>
        )}
      </Table.Tr>
    ));

    return (
      <Paper shadow="md" p="lg" withBorder>
        <Table highlightOnHover stickyHeader stickyHeaderOffset={60}>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>#</Table.Th>
              <Table.Th>Title</Table.Th>
              <Table.Th>Description</Table.Th>
              <Table.Th>Categories</Table.Th>
              <Table.Th>Complexity</Table.Th>
              {user.isAdmin && <Table.Th></Table.Th>}
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>{rows}</Table.Tbody>
        </Table>
      </Paper>
    );
  }
}
