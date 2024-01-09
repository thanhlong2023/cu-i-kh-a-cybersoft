import axios from 'axios'
import { ACCESS_TOKEN, TOKEN_CYBER } from '~/constants'
import { getLocal } from '~/utils'

const BASE_URL = 'https://jiranew.cybersoft.edu.vn/api'

export const axiosWithoutAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 180_000
})

export const axiosAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 180_000
})

axiosAuth.interceptors.request.use(
  (config) => {
    config.headers = {
      ...config.headers,
      Authorization: `Bearer ${getLocal(ACCESS_TOKEN)}`,
      TokenCybersoft: TOKEN_CYBER
    }

    return config
  },
  (err) => {
    return Promise.reject(err)
  }
)
