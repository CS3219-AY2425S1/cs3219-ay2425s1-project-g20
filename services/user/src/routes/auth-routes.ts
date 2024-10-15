import { Router } from 'express'
import { handleLogin, handleVerifyToken } from '../controller/auth-controller'
import { verifyAccessToken } from '../middleware/basic-access-control'

const router = Router()

router.post('/login', handleLogin)

router.get('/verify-token', verifyAccessToken, handleVerifyToken)

export default router
