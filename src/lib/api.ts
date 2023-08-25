import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://play-ai.onrender.com/api',
})
