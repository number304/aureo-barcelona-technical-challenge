import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/User'

export const verifyToken = async (req, res, next) => {
  try {
    const token = req.cookies['access_token']
    console.log(token)
    if (!token) return res.status(403).json({ message: 'Not authenticated' })

    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.userId = decoded.id

    const userFound = await User.findById(req.userId)
    if (!userFound) return res.status(404).json({ message: 'User not found' })

    next()
  } catch (error) {
    return res.status(401).json({ message: 'Not authenticated' })
  }
}