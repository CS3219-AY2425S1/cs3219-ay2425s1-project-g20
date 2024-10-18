import { Button, PasswordInput, Stack, TextInput } from "@mantine/core";
import { useForm, zodResolver } from "@mantine/form";
import { useMutation } from "@tanstack/react-query";
import { api } from "../../api";
import { useNavigate } from "@tanstack/react-router";
import { notifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { loginFormSchema, LoginFormValue } from "@common/shared-types";

export function LoginForm() {
  const navigate = useNavigate();
  const form = useForm<LoginFormValue>({
    initialValues: {
      email: "",
      password: "",
    },
    validate: zodResolver(loginFormSchema),
  });

  const { mutateAsync: login, isPending } = useMutation({
    mutationFn: async (values: LoginFormValue) => {
      await api.userClient.loginUser({
        ...values,
      });
    },
    onSuccess: () => {
      notifications.show({
        color: "green",
        message: "Successfully logged in",
      });
      navigate({ to: "/" });
    },
    onError: (error) => {
      notifications.show({
        color: "red",
        title: `Error logging in`,
        message:
          error instanceof AxiosError && "message" in error.response?.data
            ? error.response?.data.message
            : error.message,
      });
    },
  });

  return (
    <form onSubmit={form.onSubmit(async (values) => await login(values))}>
      <Stack>
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
          Login
        </Button>
      </Stack>
    </form>
  );
}
