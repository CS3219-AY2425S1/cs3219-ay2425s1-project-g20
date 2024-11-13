import { ExtractedUser } from '@common/shared-types/dist';
import { Group, Paper, Stack, Title } from "@mantine/core";
import { userStorage } from "../../utils/userStorage";
import { AttemptsTable } from './AttemptsTable';

export function Dashboard() {
  let user: ExtractedUser = userStorage.getUser()!

  return <Stack>
		<Title order={1} ta='center' >Welcome, {user.username}</Title>
		<Group>
			<Paper w={{ base: '100%', lg: '75%', xl: '50%' }} mx='auto' p='md' withBorder radius='md' shadow='md'>
				<Stack>
					<Title order={2}>Collab History</Title>
					<AttemptsTable user={user} />
				</Stack>
			</Paper>
		</Group>
	</Stack>;
}
