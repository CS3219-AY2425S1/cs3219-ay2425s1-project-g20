import { notifications } from "@mantine/notifications";
import { api } from "../api";

export const fetchQuestions = async () => {
  try {
    return await api.questionClient.getQuestions();
  } catch (error) {
    notifications.show({
      color: "red",
      title: "Error fetching questions",
      message: `${(error as Error).message}`,
    });
    console.error(error);
    throw error;
  }
};
