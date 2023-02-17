import { Router } from "express"
import * as authController from '../controllers/auth.controller'
import { verifyToken } from "../middlewares"

const router = Router()

router.post('/signin', authController.signIn)
router.post('/signup', authController.signUp)

router.post('/refresh-signin', verifyToken, authController.signInWithJwt)

export default router