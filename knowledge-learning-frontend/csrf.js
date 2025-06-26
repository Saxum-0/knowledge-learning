import api from './api'

export const getCsrfToken = async () => {
  const res = await api.get('/security/csrf-token')
  return res.data.csrfToken
}
