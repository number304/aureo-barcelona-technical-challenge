import axios from 'axios'
import envVariables from './config'

const apiClient = axios.create({
  withCredentials: true,
  baseURL: envVariables.apiURL
})

export default apiClient