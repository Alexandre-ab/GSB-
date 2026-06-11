import api from '../config'

export const seminaireService = {
    getAll: () => api.get('/api/seminaires'),
    getById: (id) => api.get(`/api/seminaires/${id}`),
    create: (data) => api.post('/api/seminaires', data),
    update: (id, data) => api.put(`/api/seminaires/${id}`, data),
    delete: (id) => api.delete(`/api/seminaires/${id}`),
    addParticipant: (id, userId) => api.post(`/api/seminaires/${id}/participants`, { userId })
}

export default seminaireService
