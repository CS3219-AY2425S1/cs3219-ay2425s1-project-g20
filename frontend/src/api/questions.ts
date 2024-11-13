import { Question } from "@common/shared-types";
import { createAuthAxiosInstance } from "./axios";

const questionsAxios = createAuthAxiosInstance(
  import.meta.env.VITE_QUESTION_SERVICE_API_URL
);

const QUESTION_API_URL = "/questions";

const getQuestions = async () => {
  try {
    const response = await questionsAxios.get(QUESTION_API_URL);
    return response.data as Question[];
  } catch (error) {
    console.error("Error fetching questions: ", error);
    throw error;
  }
};

const addQuestion = async (question: Omit<Question, "id">) => {
  try {
    const response = await questionsAxios.post(QUESTION_API_URL, question);
    return response.data as Question;
  } catch (error) {
    console.error("Error adding question: ", error);
    throw error;
  }
};

const updateQuestion = async (question: Question) => {
  try {
    const { id, ...data } = question;
    const response = await questionsAxios.put(
      `${QUESTION_API_URL}/${id}`,
      data
    );
    return response.data as Question;
  } catch (error) {
    console.error("Error updating question: ", error);
    throw error;
  }
};

const deleteQuestion = async (questionId: string) => {
  try {
    await questionsAxios.delete(`${QUESTION_API_URL}/${questionId}`);
    return { id: questionId };
  } catch (error) {
    console.error("Error deleting question: ", error);
    throw error;
  }
};

export const questionClient = {
  getQuestions,
  addQuestion,
  updateQuestion,
  deleteQuestion,
};
