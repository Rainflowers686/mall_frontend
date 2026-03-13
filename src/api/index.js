import axios from 'axios'

const service = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  timeout: 5000
})

// 请求拦截器：每次发请求前，自动把保险箱里的 Token 贴在信封上
service.interceptors.request.use(config => {
  const token = localStorage.getItem('access_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export default service