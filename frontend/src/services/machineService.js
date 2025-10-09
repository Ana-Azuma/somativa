import apiClient from './api'

export default {
  // Listar todas as máquinas
  getAll(params = {}) {
    return apiClient.get('/machines', { params })
  },

  // Buscar máquina por ID
  getById(id) {
    return apiClient.get(`/machines/${id}`)
  },

  // Criar nova máquina
  create(data) {
    return apiClient.post('/machines', data)
  },

  // Atualizar máquina
  update(id, data) {
    return apiClient.put(`/machines/${id}`, data)
  },

  // Atualizar status da máquina
  updateStatus(id, status) {
    return apiClient.patch(`/machines/${id}/status`, { status })
  },

  // Deletar máquina
  delete(id) {
    return apiClient.delete(`/machines/${id}`)
  },

  // Obter estatísticas de status
  getStatusStats() {
    return apiClient.get('/machines/stats/status')
  }
}