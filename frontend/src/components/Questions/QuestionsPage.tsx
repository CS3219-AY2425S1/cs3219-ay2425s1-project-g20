import { Button, Group, Stack, Text, Title } from '@mantine/core';

import { modals } from '@mantine/modals';
import { IconPlus } from '@tabler/icons-react';
import { QuestionsForm } from './QuestionsForm';
import { QuestionTable } from './QuestionsTable';
import { userStorage } from '../../utils/userStorage';

export function QuestionsPage() {
  const user = userStorage.getUser()!;

  return (
    <Stack>
      <Group>
        <Title order={1}>Questions</Title>
        {user.isAdmin && (
          <Button
            variant='gradient'
            ml='auto'
            onClick={() => {
              modals.open({
                title: <Text fw='bold'>Add New Question</Text>,
                children: <QuestionsForm />,
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
