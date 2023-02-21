import { Router } from "express"
import * as authController from '../controllers/auth.controller'
import { verifyToken } from "../middlewares"

const router = Router()

router.post('/login', authController.signIn)
router.post('/signup', authController.signUp)

router.get('/logout', verifyToken, authController.logout)
router.get('/refresh-signin', verifyToken, authController.signInWithJwt)

export default router