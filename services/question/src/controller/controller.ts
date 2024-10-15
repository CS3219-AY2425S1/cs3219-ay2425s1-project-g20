import { Question, QuestionDoc } from '@common/shared-types';
import * as model from '../model/model';
import { DuplicateQuestionError } from "../utils/errors";

export async function getAll(complexity?: string, categories?: string[]): Promise<Question[]> {
  return model.getAll(complexity, categories);
}

export async function get(id: string): Promise<Question | null> {
  return model.get(id);
}

export async function add(questionDoc: QuestionDoc): Promise<Question> {
  // Guard against duplicates
  let duplicateQuestion: Question | null = await model.getDuplicate(questionDoc.title);
  if (duplicateQuestion !== null) {
    throw new DuplicateQuestionError(duplicateQuestion);
  }

  // Create new question
  return model.add(questionDoc);
}

export async function set(id: string, questionDoc: QuestionDoc): Promise<Question> {
  // Guard against duplicates, don't consider itself a duplicate
  let duplicateQuestion: Question | null = await model.getDuplicate(questionDoc.title, id);
  if (duplicateQuestion !== null) {
    throw new DuplicateQuestionError(duplicateQuestion);
  }

  // Ovewrite question
  return model.set(id, questionDoc);
}

export async function destroy(id: string): Promise<void> {
  return model.destroy(id);
}
