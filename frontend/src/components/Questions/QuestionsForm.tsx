import { Question } from "@common/shared-types";
import {
  Button,
  Select,
  Stack,
  TagsInput,
  Text,
  Textarea,
  TextInput,
} from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconPlus } from "@tabler/icons-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AxiosError } from "axios";
import z from "zod";
import { api } from "../../api/client";

const questionFormSchema = z.object({
  id: z.string().optional(),
  title: z.string().min(1, { message: "Title is required" }),
  description: z.string().min(1, { message: "Description is required" }),
  categories: z
    .string()
    .min(1)
    .array()
    .min(1, { message: "At least 1 category required" }),
  complexity: z.enum(["Easy", "Medium", "Hard"], {
    message: "Complexity is required",
  }),
});

type FormValues = z.infer<typeof questionFormSchema>;

interface Props {
  initialValues?: FormValues;
}

export function QuestionsForm({ initialValues }: Props) {
  const queryClient = useQueryClient();

  const form = useForm<FormValues>({
    initialValues: {
      id: initialValues?.id ?? undefined,
      title: initialValues?.title ?? "",
      description: initialValues?.description ?? "",
      categories: initialValues?.categories ?? [],
      complexity: initialValues?.complexity ?? "Easy",
    },
    validate: zodResolver(questionFormSchema),
  });

  const mode = !form.values.id ? "create" : "edit";

  const { mutateAsync: createOrUpdateQuestionMutation } = useMutation({
    mutationFn: async (values: FormValues) => {
      try {
        if (mode === "create") {
          return await api.questionClient.addQuestion(values);
        } else {
          return await api.questionClient.updateQuestion({
            ...values,
            id: values.id!,
          });
        }
      } catch (error) {
        console.error(error);
        throw error;
      }
    },
    onSuccess: (data) => {
      notifications.show({
        color: "green",
        message: `Successfully ${mode === "create" ? "added" : "updated"} question`,
      });
      if (mode === "create") {
        queryClient.setQueryData<Question[]>(["questions"], (prev) => [
          ...(prev ?? []),
          { ...data },
        ]);
        form.reset();
      } else {
        queryClient.setQueryData<Question[]>(["questions"], (prev) =>
          prev?.map((qn) => (qn.id === data.id ? data : qn))
        );
        form.resetDirty();
      }
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
        title: <Text fw="bold">Error occured</Text>,
        message: error.message,
      });
    },
  });

  return (
    <form
      onSubmit={form.onSubmit(
        async (values) => await createOrUpdateQuestionMutation(values)
      )}
    >
      <Stack>
        {form.values.id && (
          <TextInput
            disabled
            readOnly
            label="ID"
            {...form.getInputProps("id")}
          />
        )}
        <TextInput
          label="Title"
          required
          placeholder="Enter the title of the question"
          key={form.key("title")}
          {...form.getInputProps("title")}
        />
        <Textarea
          label="Description"
          required
          placeholder="Enter the question description"
          autosize
          minRows={3}
          key={form.key("description")}
          {...form.getInputProps("description")}
        />
        <TagsInput
          label="Categories"
          required
          description="Press Enter to submit a category"
          placeholder="Enter categories"
          key={form.key("categories")}
          {...form.getInputProps("categories")}
        />
        <Select
          label="Complexity"
          required
          allowDeselect={false}
          placeholder="Select the complexity"
          data={["Easy", "Medium", "Hard"]}
          key={form.key("complexity")}
          {...form.getInputProps("complexity")}
        />

        <Button
          mt="md"
          type="submit"
          disabled={!form.isDirty() || Object.keys(form.errors).length > 1}
          leftSection={mode === "create" ? <IconPlus /> : <IconCheck />}
        >
          {mode === "create" ? "Add" : "Update"}
        </Button>
      </Stack>
    </form>
  );
}
