import api from './api'

export const authApi = {
  login(credentials) {
    return api.post('/auth/login', {
      username: credentials.username,
      password: credentials.password,
    })
  },
}
