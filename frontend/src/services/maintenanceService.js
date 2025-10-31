import api from './api'

const maintenanceService = {
  // GET /api/maintenances - Buscar todas as manutenções
  async getAll(params = {}) {
    try {
      const response = await api.get('/maintenances', { params })
      return response
    } catch (error) {
      console.error('Erro ao buscar manutenções:', error)
      throw error
    }
  },

  // GET /api/maintenances/:id - Buscar manutenção por ID
  async getById(id) {
    try {
      const response = await api.get(`/maintenances/${id}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar manutenção:', error)
      throw error
    }
  },

  // GET /api/maintenances/machine/:machineId - Buscar histórico por máquina
  async getByMachine(machineId) {
    try {
      const response = await api.get(`/maintenances/machine/${machineId}`)
      return response
    } catch (error) {
      console.error('Erro ao buscar histórico:', error)
      throw error
    }
  },

  // POST /api/maintenances - Criar nova manutenção
  async create(maintenanceData) {
    try {
      console.log('📤 maintenanceService.create - Enviando:', maintenanceData)
      const response = await api.post('/maintenances', maintenanceData)
      console.log('📥 maintenanceService.create - Resposta:', response)
      return response
    } catch (error) {
      console.error('❌ Erro ao criar manutenção:', error)
      throw error
    }
  },

  // PUT /api/maintenances/:id - Atualizar manutenção
  async update(id, maintenanceData) {
    try {
      console.log('📤 maintenanceService.update - ID:', id, 'Dados:', maintenanceData)
      const response = await api.put(`/maintenances/${id}`, maintenanceData)
      console.log('📥 maintenanceService.update - Resposta:', response)
      return response
    } catch (error) {
      console.error('❌ Erro ao atualizar manutenção:', error)
      throw error
    }
  },

  // DELETE /api/maintenances/:id - Deletar manutenção
  async delete(id) {
    try {
      const response = await api.delete(`/maintenances/${id}`)
      return response
    } catch (error) {
      console.error('Erro ao deletar manutenção:', error)
      throw error
    }
  },

  // GET /api/maintenances/stats/summary - Estatísticas
  async getStats() {
    try {
      const response = await api.get('/maintenances/stats/summary')
      return response
    } catch (error) {
      console.error('Erro ao buscar estatísticas:', error)
      throw error
    }
  }
}

export default maintenanceService