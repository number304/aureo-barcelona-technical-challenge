import { Router } from "express"
import * as characterController from '../controllers/character.controller'
import { verifyToken } from "../middlewares"

const router = Router()

router.get('/', verifyToken, characterController.getAllCharacters)

router.get('/favorite-characters', verifyToken, characterController.getFavoriteCharacters)

export default router