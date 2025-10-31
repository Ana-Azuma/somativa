import { defineStore } from 'pinia'
import machineService from '../services/machineService'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    // Começa vazio e busca do MongoDB
    machines: [],
    maintenances: [],
    scheduledMaintenances: [],
    loading: false,
    error: null
  }),

  getters: {
    totalMachines: (state) => state.machines.length,
    
    maintenanceStats: (state) => {
      const total = state.maintenances.length
      const concluded = state.maintenances.filter(m => m.status === 'Concluída').length
      const pending = state.maintenances.filter(m => m.status === 'Pendente').length
      const inProgress = state.maintenances.filter(m => m.status === 'Em Andamento').length
      
      return { total, concluded, pending, inProgress }
    },

    machinesByStatus: (state) => {
      const green = state.machines.filter(m => m.status === 'verde').length
      const yellow = state.machines.filter(m => m.status === 'amarelo').length
      const red = state.machines.filter(m => m.status === 'vermelho').length
      
      return { green, yellow, red }
    },

    allMaintenances: (state) => {
      return [...state.maintenances, ...state.scheduledMaintenances]
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    },

    monthlyMaintenanceData: (state) => {
      const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago']
      const data = []
      
      months.forEach(month => {
        const concluded = Math.floor(Math.random() * 15) + 5
        const pending = Math.floor(Math.random() * 8) + 2
        const scheduled = Math.floor(Math.random() * 10) + 3
        
        data.push({
          month,
          Concluídas: concluded,
          Pendentes: pending,
          Agendadas: scheduled
        })
      })
      
      return data
    }
  },

  actions: {
    // ✅ Busca máquinas do MongoDB
    async fetchMachines() {
      this.loading = true
      this.error = null
      
      try {
        const response = await machineService.getAll()
        this.machines = response.data.data
        return response.data
      } catch (error) {
        this.error = 'Erro ao buscar máquinas'
        console.error('Erro ao buscar máquinas:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ✅ Busca manutenções do MongoDB
    async fetchMaintenances() {
      this.loading = true
      this.error = null
      
      try {
        // Por enquanto mantém dados mockados
        // Quando criar maintenanceService, descomente e use:
        // const response = await maintenanceService.getAll()
        // this.maintenances = response.data.data.filter(m => m.status !== 'Agendada')
        // this.scheduledMaintenances = response.data.data.filter(m => m.status === 'Agendada')
        
        this.maintenances = []
        this.scheduledMaintenances = []
        
      } catch (error) {
        this.error = 'Erro ao buscar manutenções'
        console.error('Erro ao buscar manutenções:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    // ✅ Atualiza status de uma máquina específica
    async updateMachineStatus(machineId, status) {
      try {
        const response = await machineService.updateStatus(machineId, status)
        
        // Atualiza a máquina localmente
        const machine = this.machines.find(m => m._id === machineId || m.id === machineId)
        if (machine) {
          machine.status = status
        }
        
        return response.data
      } catch (error) {
        console.error('Erro ao atualizar status:', error)
        throw error
      }
    },

    addMaintenance(maintenance) {
      const newMaintenance = {
        id: Date.now(),
        ...maintenance,
        date: new Date().toISOString().split('T')[0]
      }
      
      this.maintenances.push(newMaintenance)
      
      // Atualiza status da máquina
      const machine = this.machines.find(m => (m.id || m._id) === maintenance.machineId)
      if (machine) {
        machine.lastMaintenance = newMaintenance.date
        machine.status = 'verde'
      }
    },

    updateMaintenance(id, updates) {
      // Procura nas manutenções regulares
      let maintenance = this.maintenances.find(m => m.id === id)
      if (maintenance) {
        Object.assign(maintenance, updates)
        return
      }
      
      // Procura nas manutenções agendadas
      maintenance = this.scheduledMaintenances.find(m => m.id === id)
      if (maintenance) {
        Object.assign(maintenance, updates)
        
        // Se mudou de Agendada para outro status, move para maintenances
        if (updates.status && updates.status !== 'Agendada') {
          const index = this.scheduledMaintenances.findIndex(m => m.id === id)
          this.scheduledMaintenances.splice(index, 1)
          this.maintenances.push(maintenance)
        }
      }
    },

    deleteMaintenance(id) {
      // Tenta deletar das manutenções regulares
      let index = this.maintenances.findIndex(m => m.id === id)
      if (index > -1) {
        this.maintenances.splice(index, 1)
        return
      }
      
      // Tenta deletar das agendadas
      index = this.scheduledMaintenances.findIndex(m => m.id === id)
      if (index > -1) {
        this.scheduledMaintenances.splice(index, 1)
      }
    },

    getMachineById(id) {
      return this.machines.find(m => (m.id || m._id) === id)
    },

    getMaintenancesByMachine(machineId) {
      return this.allMaintenances.filter(m => m.machineId === machineId)
    }
  }
})