export type Status = 'Alive' | 'Dead' | 'unknown'

export default interface Character {
  id: number
  name: string
  status: Status
  species: string
  type: string
  gender: 'Female' | 'Male' | 'Genderless' | 'unknown'
  origin: { name: string, url: string }
  location: { name: string, url: string }
  image: string
  episode: string[]
  firstEpisode: Episode
  url: string
  created: string
  loading?: boolean
}

interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}