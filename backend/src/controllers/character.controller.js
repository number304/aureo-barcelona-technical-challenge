import User from "../models/User"

function getId(url) {
  const urlParts = url.split('/')
  return parseInt(urlParts[urlParts.length - 1])
}

export const getAllCharacters = async (req, res) => {
  const page = req.query.page

  const characters = await fetch(`https://rickandmortyapi.com/api/character${ page ? '?page=' + page : '' }`)
    .then(response => response.json())
    .catch(err => console.error(err))

  const firstEpisodesIds = characters.results.map(char => getId(char.episode[0]))

  const firstEpisodes = await fetch(`https://rickandmortyapi.com/api/episode/${firstEpisodesIds.join(',')}`)
    .then(response => response.json())
    .catch(err => console.error(err))

  firstEpisodes.forEach((ep, index) => characters.results[index].firstEpisode = ep)

  res.json(characters)
}

export const getFavoriteCharacters = async (req, res) => {
  const user = await User.findById(req.userId)

  if (!user.favoriteCharacters.length) return res.json({ count: 0, favoriteCharacters: [] })
  const onlyOneFavorite = user.favoriteCharacters.length < 2

  const characters = await fetch(`https://rickandmortyapi.com/api/character/${user.favoriteCharacters.join(',')}`)
    .then(response => response.json())
    .catch(err => console.error(err))

  const firstEpisodesIds = onlyOneFavorite ? getId(characters.episode[0]) : characters.map(char => getId(char.episode[0]))

  const firstEpisodes = await fetch(`https://rickandmortyapi.com/api/episode/
    ${onlyOneFavorite ? firstEpisodesIds : firstEpisodesIds.join(',')}`
  )
    .then(response => response.json())
    .catch(err => console.error(err))

  if (onlyOneFavorite) characters.firstEpisode = firstEpisodes
  else firstEpisodes.forEach((ep, index) => characters[index].firstEpisode = ep)

  res.json({ count: user.favoriteCharacters.length, favoriteCharacters: onlyOneFavorite ? [characters] : characters })
}