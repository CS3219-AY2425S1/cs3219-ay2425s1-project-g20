import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { api } from "../../api";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { registerFormSchema, RegisterFormValue } from "@common/shared-types";

export function SignUpForm() {
  const navigate = useNavigate();
  const form = useForm<RegisterFormValue>({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validate: zodResolver(registerFormSchema),
  });

  const { mutateAsync: signUp, isPending } = useMutation({
    mutationFn: async (values: RegisterFormValue) => {
      await api.userClient.registerUser({
        ...values,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Successfully signed up",
      });
      navigate({ to: "/login" });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: `Error signing up`,
        message:
          error instanceof AxiosError && "message" in error.response?.data
            ? error.response?.data.message
            : error.message,
      });
    },
  });

  return (
    <form onSubmit={form.onSubmit(async (values) => await signUp(values))}>
      <Stack>
        <TextInput
          label="Username"
          placeholder="Your username"
          required
          {...form.getInputProps("username")}
        />
        <TextInput
          label="Email"
          placeholder="you@example.com"
          required
          {...form.getInputProps("email")}
        />
        <PasswordInput
          label="Password"
          placeholder="Your password"
          required
          {...form.getInputProps("password")}
        />
        <Button type="submit" mt="xl" loading={isPending}>
          Sign Up
        </Button>
      </Stack>
    </form>
  );
}
