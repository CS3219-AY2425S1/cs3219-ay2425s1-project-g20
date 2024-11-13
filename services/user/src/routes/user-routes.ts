import express from 'express'

import {
  createUser,
  deleteUser,
  getAllUsers,
  getUser,
  updateUser,
  updateUserPrivilege,
} from '../controller/user-controller'
import {
  verifyAccessToken,
  verifyIsAdmin,
  verifyIsOwnerOrAdmin,
} from '../middleware/basic-access-control'

const router = express.Router()

router.post('/', createUser)

router.get('/', verifyAccessToken, verifyIsAdmin, getAllUsers)

router.get('/:id', verifyAccessToken, verifyIsOwnerOrAdmin, getUser)

router.patch('/:id/privilege', verifyAccessToken, verifyIsAdmin, updateUserPrivilege)

router.patch('/:id', verifyAccessToken, verifyIsOwnerOrAdmin, updateUser)

router.delete('/:id', verifyAccessToken, verifyIsOwnerOrAdmin, deleteUser)

export default router
