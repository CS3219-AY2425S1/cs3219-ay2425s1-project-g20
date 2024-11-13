import { Attempt, ExtractedUser, Question } from '@common/shared-types';
import { ActionIcon, Loader, Table, Text } from '@mantine/core';
import { IconDownload } from '@tabler/icons-react';
import { DateTime } from 'luxon';
import { ReactElement, useEffect, useState } from 'react';
import { questionClient } from '../../api/questions';
import { roomClient } from '../../api/room';

interface Props {
  user: ExtractedUser;
}

function downloadCode(code: string, filename: string) {
  let blob: Blob = new Blob([code], { type: 'text/plain' });

  // We need this hacky way for browser compatibility
  let link: HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(link.href);
}

function makeTableRows(attempts: Attempt[] | null, questions: Question[] | null): ReactElement[] | null {
  if (attempts === null || questions === null) return null;

  // Sort descending
  let sortedAttempts: Attempt[] = attempts!.sort((a, b) => b.createdAt - a.createdAt);
  return sortedAttempts.map((attempt) => {
    let questionTitle: string = questionIdToTitle(attempt.questionId, questions);
    let prettyTimestamp: string = epochToTimestamp(attempt.createdAt);

    let isCodeAvailable: boolean = attempt.code !== undefined;
    let codeFilename: string = `${questionTitle.replaceAll(" ", "_")}_${attempt.createdAt}.txt`.toLowerCase();

    return <Table.Tr key={attempt.questionId}>
      <Table.Td fw="bold">
        {questionTitle}
      </Table.Td>
      <Table.Td ta='end'>
        {prettyTimestamp}
      </Table.Td>
      <Table.Td
        style={{
        // Minimum column width
        'width': '1%',
        'white-space': 'nowrap',
      }}>
        {isCodeAvailable && <ActionIcon
          color='lime'
          title="Download your attempt's code"
          display='block' // Don't align to baseline, don't leave space below for descenders
          onClick={() => downloadCode(attempt.code, codeFilename)}
        >
          <IconDownload />
        </ActionIcon>}
      </Table.Td>
    </Table.Tr>;
  })
}
function questionIdToTitle(id: string, questions: Question[]): string {
  let matchingQuestions = questions!.filter((question) => question.id === id);

  if (matchingQuestions.length < 1) return "Unknown Question";

  return matchingQuestions[0]!.title;
}
function epochToTimestamp(epoch?: number): string {
  if (epoch === undefined) return "(No Timestamp)";

  let luxonDate: DateTime = DateTime.fromMillis(epoch);
  // https://moment.github.io/luxon/#/formatting
  return `${luxonDate.toFormat("d MMM")} '${luxonDate.toFormat("kk, h:mma").toLowerCase()}`;
}

export function AttemptsTable(props: Props) {
  let [attempts, setAttempts] = useState<Attempt[] | null>(null);
  let [questions, setQuestions] = useState<Question[] | null>(null);

  useEffect(() => {
    roomClient.getAttempts(props.user.id)
      .then((fetchedAttempts: Attempt[]) => {
        setAttempts(fetchedAttempts)
        console.log(fetchedAttempts)
      });

    questionClient.getQuestions()
      .then((fetchedQuestions: Question[]) => {
        setQuestions(fetchedQuestions)
        console.log(fetchedQuestions)
      });
  }, [props.user]);

  let rows: ReactElement[] | null = makeTableRows(attempts, questions);

  // [UI]
  if (rows === null) {
    return <Loader mx='auto' color='lime' />;
  }

  if (rows.length <= 0) {
    return <Text>You have not collaborated with others yet.</Text>;
  }

  return <Table highlightOnHover stickyHeader stickyHeaderOffset={60}>
    <Table.Tbody>{rows}</Table.Tbody>
  </Table>;
}
