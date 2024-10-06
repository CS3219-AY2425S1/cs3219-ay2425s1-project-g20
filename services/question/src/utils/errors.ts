import { Question } from "@common/shared-types";

export class DuplicateQuestionError extends Error {
  constructor(public duplicateQuestion: Question) {
    super('A duplicate question already exists!');
  }
}
