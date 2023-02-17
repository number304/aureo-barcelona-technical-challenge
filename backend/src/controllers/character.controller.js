import User from "../models/User"

export const getAllCharacters = async (req, res) => {
  const page = req.query.page

  const characters = await fetch(`https://rickandmortyapi.com/api/character${ page ? '?page=' + page : '' }`)
    .then(response => response.json())
    .catch(err => console.error(err))

  res.json(characters)
}

export const getTheSmiths = async (req, res) => {
  const characters = await fetch(`https://rickandmortyapi.com/api/character/1,2,3,4,5`)
    .then(response => response.json())
    .catch(err => console.error(err))

  res.json(characters)
}

export const getFavoriteCharacters = async (req, res) => {
  const user = await User.findById(req.userId)

  if (!user.favoriteCharacters.length) return res.json({ count: 0, favoriteCharacters: [] })

  const characters = await fetch(`https://rickandmortyapi.com/api/character/${user.favoriteCharacters.join(',')}`)
    .then(response => response.json())
    .catch(err => console.error(err))

  res.json({ count: characters.length, favoriteCharacters: characters })
}