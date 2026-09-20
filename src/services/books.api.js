import api from './api'

function toFormData(payload) {
  const fd = new FormData()
  fd.append('title', payload.title)
  fd.append('year', payload.year)
  if (payload.description != null) fd.append('description', payload.description)
  if (payload.isbn != null) fd.append('isbn', payload.isbn);
  (payload.author_ids || []).forEach((id) => fd.append('author_ids[]', id))
  if (payload.cover) fd.append('cover', payload.cover)
  return fd
}

export const booksApi = {
  list(params = {}) {
    return api.get('/books', {
      params: {
        page: params.page ?? 1,
        'per-page': params.perPage ?? 20,
        author_id: params.authorId,
        year: params.year,
        search: params.search,
      },
    })
  },

  get(id) {
    return api.get(`/books/${id}`)
  },

  create(payload) {
    return api.post('/books', toFormData(payload))
  },

  replace(id, payload) {
    return api.put(`/books/${id}`, toFormData(payload))
  },

  patch(id, payload) {
    return api.patch(`/books/${id}`, {
      title: payload.title,
      year: payload.year,
      description: payload.description,
      isbn: payload.isbn,
      author_ids: payload.author_ids,
    })
  },

  remove(id) {
    return api.delete(`/books/${id}`)
  },
}
