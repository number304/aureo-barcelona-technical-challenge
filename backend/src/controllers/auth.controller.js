import User from "../models/User"
import jwt from "jsonwebtoken"
import config from "../config"
import ms from 'ms'

export const signUp = async (req, res) => {
  // const { nickname, email, password } = req.body

  const userFoundByEmail = await User.findOne({ email: req.body.email })
  if (userFoundByEmail) return res.status(400).json({ message: 'This email is already in use.' })

  const userFoundByNickname = await User.findOne({ nickname: req.body.nickname })
  if (userFoundByNickname) return res.status(400).json({ message: 'Nickname taken, please use another one.' })

  const newUser = new User({
    nickname: req.body.nickname,
    email: req.body.email,
    password: await User.encryptPassword(req.body.password),
    favoriteCharacters: []
  })
  const userSaved = await newUser.save()

  const token = jwt.sign({ id: userSaved._id }, config.JWT_SECRET, {
    expiresIn: '1d'
  })

  const accessTokenExpiration = new Date(Date.parse(new Date().toString()) + ms('1d'))

  const accessToken = `access_token=${token}; HttpOnly; Path=/; Expires=${accessTokenExpiration}`
  res.setHeader('Set-Cookie', [ accessToken ])

  const { password, ...user } = userSaved.toObject()
  res.status(201).json(user)
}

export const signIn = async (req, res) => {
  const userFound = await User.findOne({ nickname: req.body.nickname }).lean()

  if (!userFound) return res.status(400).json({ message: "User not found" })

  const matchPassword = await User.comparePassword(req.body.password, userFound.password)

  if (!matchPassword) return res.status(401).json({ message: "Wrong password" })

  const token = jwt.sign({ id: userFound._id }, config.JWT_SECRET, {
    expiresIn: '1d'
  })

  const accessTokenExpiration = new Date(Date.parse(new Date().toString()) + ms('1d'))

  const accessToken = `access_token=${token}; HttpOnly; Path=/; Expires=${accessTokenExpiration}`
  res.setHeader('Set-Cookie', [ accessToken ])

  const { password, ...user } = userFound
  res.status(202).json(user)
}

export const signInWithJwt = async (req, res) => {
  const userFound = await User.findById(req.userId)
  res.json(userFound)
}
