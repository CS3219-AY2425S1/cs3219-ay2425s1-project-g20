import { Question, UserMatchingRequest } from '@common/shared-types'
import { getApiKey } from '@common/utils'
import axios from 'axios'

// Auth service
// const SERVICE_USER_EMAIL = process.env.SERVICE_USER_EMAIL
// const SERVICE_USER_PASSWORD = process.env.SERVICE_USER_PASSWORD

// let accessToken: string | null = null

// async function getAccessToken() {
//   console.log('Service user email:', SERVICE_USER_EMAIL)

//   try {
//     if (!accessToken) {
//       accessToken = await authenticateServiceUser(
//         SERVICE_USER_EMAIL,
//         SERVICE_USER_PASSWORD
//       )
//     }
//     return accessToken
//   } catch (error) {
//     accessToken = null
//     console.error(error)
//   }
// }

const axiosInstance = axios.create({
  baseURL: process.env.QUESTION_SERVICE_URL,
  headers: {
    'Content-Type': 'application/json',
    Authorization: 'Bearer ' + getApiKey(),
  },
})

// Set authorization header
// axiosInstance.interceptors.request.use(
//   async (config) => {
//     if (SERVICE_API_KEY) {
//       config.headers.Authorization = 'Bearer ' + getAccessToken()
//     } else {
//       console.error('No api key found when authorizing service')
//     }

//     return config
//   },
//   (error) => {
//     return Promise.reject(error)
//   }
// )

// async function refreshToken() {
//   accessToken = null
//   axiosInstance.defaults.headers.Authorization = 'Bearer ' + (await getAccessToken())
// }

// Select one question based on user matching request
export async function pickQuestion(
  userMatchingRequest: UserMatchingRequest
): Promise<Question | null> {
  try {
    console.log('Picking question')
    const response = await axiosInstance.get('/questions', {
      params: {
        complexity: userMatchingRequest.difficulty,
        categories: [userMatchingRequest.topic],
      },
    })

    if (response.status !== 200 && response.status !== 401) {
      throw new Error('Error picking question')
    }

    //Randomly select a question
    const questions: Question[] = response.data
    const selectedQuestion = questions[Math.floor(Math.random() * questions.length)]

    return selectedQuestion
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      // accessToken = null
      // refreshToken()
      // return pickQuestion(userMatchingRequest)
      throw new Error('Unauthorized collaboration to question service request')
    }
    throw new Error('Error picking question')
  }
}

// Get a question by id
export async function getQuestion(questionId: string): Promise<Question | null> {
  try {
    const response = await axiosInstance.get(`/questions/${questionId}`)

    if (response.status == 401) {
      throw response
    }
    if (response.status !== 200) {
      throw new Error('Error getting question')
    }

    const question = response.data
    return question
  } catch (error) {
    if (error instanceof Response && error.status === 401) {
      // accessToken = null
      // await refreshToken()
      // return getQuestion(questionId)
      throw new Error('Unauthorized collaboration to question service request')
    }

    throw new Error('Error getting question')
  }
}
