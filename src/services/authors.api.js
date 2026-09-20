import api from './api'

export const authorsApi = {
  list(params = {}) {
    return api.get('/authors', {
      params: {
        page: params.page ?? 1,
        'per-page': params.perPage ?? 20,
        search: params.search,
      },
    })
  },

  get(id) {
    return api.get(`/authors/${id}`)
  },

  create(payload) {
    return api.post('/authors', {
      full_name: payload.fullName,
    })
  },

  update(id, payload) {
    return api.put(`/authors/${id}`, {
      full_name: payload.fullName,
    })
  },

  remove(id) {
    return api.delete(`/authors/${id}`)
  },
}
