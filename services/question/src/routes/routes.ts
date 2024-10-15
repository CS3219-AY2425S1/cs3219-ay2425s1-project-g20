import { Question, QuestionDoc, questionDocSchema } from '@common/shared-types'
import { NextFunction, Request, Response, Router } from 'express'
import { StatusCodes } from 'http-status-codes'
import * as controller from '../controller/controller'
import { DuplicateQuestionError } from '../utils/errors'
import { requireAdmin, requireLogin } from './auth'

// Provides the parsed QuestionDoc to subsequent middleware
function parseQuestionDoc(req: Request, res: Response, next: NextFunction) {
  // Attempt to parse data
  let rawQuestionDoc: unknown = req.body
  let result = questionDocSchema
    .partial()
    .refine(
      (val) => Object.keys(val).map((key) => val[key as keyof typeof val] !== undefined),
      {
        message: 'Please provide at least one field',
      }
    )
    .safeParse(rawQuestionDoc)

  if (!result.success) {
    res.status(StatusCodes.BAD_REQUEST)
    res.json({ error: result.error })
    return
  }

  res.locals.questionDoc = result.data
  next()
}

function genericServerError(res: Response, e: unknown) {
  res.status(StatusCodes.INTERNAL_SERVER_ERROR)
  res.json({ error: e })
}

let router: Router = Router()
export default router

// All routes require login
router.use(requireLogin)

// GET all questions
router.get('/', async (req: Request, res: Response) => {
  let { complexity, categories } = req.body

  let questions: Question[] = await controller.getAll(complexity, categories)

  res.status(StatusCodes.OK)
  res.json(questions)
})

// GET question with specified ID
router.get('/:id', async (req: Request, res: Response) => {
  let id = req.params.id

  let question: Question | null = await controller.get(id)

  if (question === null) {
    res.status(StatusCodes.NOT_FOUND)
    res.send()
    return
  }

  res.status(StatusCodes.OK)
  res.json(question)
})

// Create new specified question
router.post('/', requireAdmin, parseQuestionDoc, async (req: Request, res: Response) => {
  let questionDoc: QuestionDoc = res.locals.questionDoc

  try {
    let question: Question = await controller.add(questionDoc)

    res.status(StatusCodes.CREATED)
    res.json(question)
  } catch (e) {
    if (e instanceof DuplicateQuestionError) {
      res.status(StatusCodes.CONFLICT)
      res.json(e.duplicateQuestion)
      return
    }

    genericServerError(res, e)
  }
})

// Overwrite specified question
router.put(
  '/:id',
  requireAdmin,
  parseQuestionDoc,
  async (req: Request, res: Response) => {
    let id = req.params.id
    let questionDoc: QuestionDoc = res.locals.questionDoc

    try {
      let question: Question = await controller.set(id, questionDoc)

      res.status(StatusCodes.OK)
      res.json(question)
    } catch (e) {
      if (e instanceof DuplicateQuestionError) {
        res.status(StatusCodes.CONFLICT)
        res.json(e.duplicateQuestion)
        return
      }

      genericServerError(res, e)
    }
  }
)

// DELETE specified question
router.delete('/:id', requireAdmin, async (req: Request, res: Response) => {
  let id = req.params.id

  await controller.destroy(id)

  res.status(StatusCodes.NO_CONTENT)
  res.send()
})
