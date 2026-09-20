import api from './api'

export const reportsApi = {
  topAuthors(year) {
    return api.get('/reports/top-authors', {
      params: { year },
    })
  },
}
