import User from "../models/User"

export const editUserById = async (req, res) => {
  if (req.body.email) {
    const userFoundByEmail = await User.findOne({ email: req.body.email })
    if (userFoundByEmail) return res.status(400).json({ message: 'This email is already in use.' })
  }

  if (req.body.nickname) {
    const userFoundByNickname = await User.findOne({ nickname: req.body.nickname })
    if (userFoundByNickname) return res.status(400).json({ message: 'Nickname taken, please use another one.' })
  }

  if (req.body.password) return res.json(400).json({ message: "Can't update password this way." })

  const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true })
  res.status(200).json(updatedUser)
}

export const editPassword = async (req, res) => {
  const password = await User.encryptPassword(req.body.password)

  const updatedUser = await User.findByIdAndUpdate(req.userId, { password }, { new: true })
  res.status(200).json(updatedUser)
}

export const deleteUserById = async (req, res) => {
  await User.findByIdAndDelete(req.userId)
  res.status(204)
}

export const updateFavoriteCharacters = async (req, res) => {
  const { favoriteCharacters } = req.body
  const updatedUser = await User.findByIdAndUpdate(req.userId, { favoriteCharacters }, { new: true })
  res.status(200).json(updatedUser)
}