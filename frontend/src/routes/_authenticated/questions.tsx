import { createFileRoute } from '@tanstack/react-router';
import { QuestionsPage } from '../../components/Questions/QuestionsPage';

export const Route = createFileRoute('/_authenticated/questions')({
  component: QuestionsPage,
});
