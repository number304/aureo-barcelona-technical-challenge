import { Router } from "express"
import * as userController from "../controllers/user.controller"
import { verifyToken } from '../middlewares'

const router = Router()

router.put('/', verifyToken, userController.editUserById)

router.delete('/', verifyToken, userController.deleteUserById)

router.put('/update-pass', verifyToken, userController.editPassword)

router.put('/favorite-characters', verifyToken, userController.updateFavoriteCharacters)

export default router