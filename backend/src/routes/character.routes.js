import { Router } from "express"
import * as characterController from '../controllers/character.controller'
import { verifyToken } from "../middlewares"

const router = Router()

router.get('/get-the-smiths', characterController.getTheSmiths)

router.get('/', verifyToken, characterController.getAllCharacters)

router.get('/favoriteCharacters', verifyToken, characterController.getAllCharacters)

export default router