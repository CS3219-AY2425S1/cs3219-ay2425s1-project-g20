import { Button, Group, Stack, Text, Title } from "@mantine/core";
import { modals } from "@mantine/modals";
import { IconPlus } from "@tabler/icons-react";
import { userStorage } from "../../utils/userStorage";
import { QuestionForm } from "./QuestionForm";
import { QuestionTable } from "./QuestionsTable";

export function QuestionsPage() {
  const user = userStorage.getUser()!;

  return (
    <Stack>
      <Group>
        <Title order={1}>Questions</Title>
        {user.isAdmin && (
          <Button
            variant="gradient"
            ml="auto"
            onClick={() => {
              modals.open({
                title: <Text fw="bold">Add New Question</Text>,
                children: <QuestionForm />,
              });
            }}
            leftSection={<IconPlus />}
          >
            Question
          </Button>
        )}
      </Group>
      <QuestionTable />
    </Stack>
  );
}
