import User from "../models/User"
import jwt from "jsonwebtoken"
import config from "../config"

export const signUp = async (req, res) => {
  const { nickname, email, password } = req.body

  const userFoundByEmail = await User.findOne({ email })
  const userFoundByNickname = await User.findOne({ nickname })

  if (userFoundByEmail) return res.status(400).json({ message: 'This email is already in use.' })
  if (userFoundByNickname) return res.status(400).json({ message: 'Nickname taken, please use another one.' })

  const newUser = new User({
    nickname,
    email,
    password: await User.encryptPassword(password),
    favoriteCharacters: []
  })
  const userSaved = await newUser.save()

  const token = jwt.sign({ id: userSaved._id }, config.JWT_SECRET, {
    expiresIn: '1d'
  })

  res.status(201).json({ token })
}

export const signIn = async (req, res) => {
  const { nickname, password } = req.body
  const userFound = await User.findOne({ nickname })

  if (!userFound) return res.status(400).json({ message: "User not found" })

  const matchPassword = await User.comparePassword(password, userFound.password)

  if (!matchPassword) return res.status(401).json({ message: "Wrong password" })

  const token = jwt.sign({ id: userFound._id }, config.JWT_SECRET, {
    expiresIn: '1d'
  })

  res.json({ token })
}

export const signInWithJwt = async (req, res) => {
  const userFound = await User.findById(req.userId)
  res.json(userFound)
}
