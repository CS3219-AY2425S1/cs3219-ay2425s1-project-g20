import { Button, Group, Loader, Select, Stack } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useQuery } from "@tanstack/react-query";
import { fetchQuestions } from "../../queries/questionQueries";
import {
  UserMatchingRequest,
  userMatchingRequestSchema,
} from "@common/shared-types";

interface Props {
  onSubmit: (values: UserMatchingRequest) => void;
  isCooldown: boolean;
}

export function MatchingForm({ onSubmit, isCooldown }: Props) {
  const { data: questions, isLoading } = useQuery({
    queryKey: ["questions"],
    queryFn: fetchQuestions,
    initialData: [],
  });

  const topics = Array.from(
    new Set(questions?.map((q) => q.categories).flat())
  ).sort();

  const difficulties = ["Easy", "Medium", "Hard"].filter((c) =>
    questions?.some((q) => q.complexity === c)
  );

  const form = useForm<UserMatchingRequest>({
    initialValues: {
      difficulty: "Easy",
      topic: "",
    },
    validate: zodResolver(userMatchingRequestSchema),
  });

  return (
    <form onSubmit={form.onSubmit(onSubmit)}>
      <Stack>
        <Group w="100%" justify="space-between" grow>
          <Select
            rightSection={isLoading && <Loader size={18} />}
            allowDeselect={false}
            label="Topic"
            placeholder="Select topic"
            required
            data={topics}
            {...form.getInputProps("topic")}
          />
          <Select
            rightSection={isLoading && <Loader size={18} />}
            allowDeselect={false}
            label="Difficulty"
            placeholder="Select difficulty"
            required
            data={difficulties}
            {...form.getInputProps("difficulty")}
          />
        </Group>
        <Button type="submit" disabled={isLoading || isCooldown}>
          {isCooldown ? "Please wait..." : "Match"}
        </Button>
      </Stack>
    </form>
  );
}
