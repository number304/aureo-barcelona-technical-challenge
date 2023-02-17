import User from "../models/User"

export const editUserById = async (req, res) => {
  const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true })
  res.status(200).json(updatedUser)
}

export const deleteUserById = async (req, res) => {
  await User.findByIdAndDelete(req.userId)
  res.status(204)
}

export const updateFavoriteCharacters = async (req, res) => {
  const { favoriteCharacters } = req.body
  await User.findByIdAndUpdate(req.userId, favoriteCharacters)
}