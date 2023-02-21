import jwt from 'jsonwebtoken'
import config from '../config'
import User from '../models/User'

export const verifyToken = async (req, res, next) => {
  try {
    if (!req.headers.cookie) return res.status(403).json({ message: 'Not authenticated' })

    const token = req.headers.cookie.split(',')
      .filter(cookie => cookie.includes('access_token'))
      [0]?.replace('access_token=', '')

    if (!token) return res.status(403).json({ message: 'Not authenticated' })

    const decoded = jwt.verify(token, config.JWT_SECRET)
    req.userId = decoded.id

    const userFound = await User.findById(req.userId)
    if (!userFound) return res.status(404).json({ message: 'User not found' })

    next()
  } catch (error) {
    console.error(error)
    return res.status(500).json({ message: 'Server Error' })
  }
}