import { Question } from "@common/shared-types";
import fs from 'fs/promises';
import logger from "../../utils/logger";

/* [Setup] */

const QUESTIONS: Question[] = [];

beforeAll(() => {
  return fs.readFile('./data/questions.json')
    .then((raw: Buffer) => {
      QUESTIONS.push(
        ...JSON.parse(raw.toString()) as Question[]
      );
      logger.info("Read sample questions from JSON file:");
      logger.info(
        `${JSON.stringify(QUESTIONS).slice(0, 500)}...`
      );
    }).catch(logger.error);
});

/* [Tests] */

//TODO
test('two plus two is four', () => {
  expect(2 + 2).toBe(4);
});
