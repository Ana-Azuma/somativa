import { defineStore } from 'pinia'
import machineService from '../services/machineService'
import maintenanceService from '../services/maintenanceService'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
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
    async fetchMachines() {
      this.loading = true
      this.error = null
      
      try {
        const response = await machineService.getAll()
        this.machines = response.data.data
        console.log('✅ Máquinas carregadas:', this.machines.length)
        return response.data
      } catch (error) {
        this.error = 'Erro ao buscar máquinas'
        console.error('❌ Erro ao buscar máquinas:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async fetchMaintenances() {
      this.loading = true
      this.error = null
      
      try {
        const response = await maintenanceService.getAll()
        
        if (response.data && response.data.data) {
          // Separa manutenções agendadas das demais
          const allMaintenances = response.data.data
          
          this.maintenances = allMaintenances.filter(m => m.status !== 'Agendada')
          this.scheduledMaintenances = allMaintenances.filter(m => m.status === 'Agendada')
          
          console.log('✅ Manutenções carregadas:', {
            total: allMaintenances.length,
            regulares: this.maintenances.length,
            agendadas: this.scheduledMaintenances.length
          })
          
          // Log das agendadas para debug
          console.log('📅 Manutenções Agendadas:', this.scheduledMaintenances)
        } else {
          this.maintenances = []
          this.scheduledMaintenances = []
        }
        
        return response.data
      } catch (error) {
        this.error = 'Erro ao buscar manutenções'
        console.error('❌ Erro ao buscar manutenções:', error)
        
        this.maintenances = []
        this.scheduledMaintenances = []
        
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateMachineStatus(machineId, status) {
      try {
        const response = await machineService.updateStatus(machineId, status)
        
        const machine = this.machines.find(m => m._id === machineId || m.id === machineId)
        if (machine) {
          machine.status = status
        }
        
        return response.data
      } catch (error) {
        console.error('❌ Erro ao atualizar status:', error)
        throw error
      }
    },

    // ✅ CORRIGIDO: Não sobrescreve a data!
    async addMaintenance(maintenanceData) {
      this.loading = true
      this.error = null
      
      try {
        console.log('🔵 [STORE] addMaintenance - Dados recebidos:', maintenanceData)
        
        // ✅ NÃO sobrescreve a data! Usa a data que vem do formulário
        const response = await maintenanceService.create(maintenanceData)
        
        console.log('🔵 [STORE] Resposta do backend:', response.data)
        
        if (response.data && response.data.data) {
          const newMaintenance = response.data.data
          
          console.log('🔵 [STORE] Manutenção criada:', newMaintenance)
          console.log('🔵 [STORE] Data salva:', newMaintenance.date)
          console.log('🔵 [STORE] Status:', newMaintenance.status)
          console.log('🔵 [STORE] MachineId:', newMaintenance.machineId)
          
          // ✅ RELOAD completo após adicionar
          console.log('🔄 [STORE] Recarregando manutenções...')
          await this.fetchMaintenances()
          
          console.log('✅ [STORE] Manutenção adicionada e dados recarregados!')
          console.log('📊 [STORE] Total agendadas:', this.scheduledMaintenances.length)
          
          return response.data
        }
        
      } catch (error) {
        this.error = 'Erro ao adicionar manutenção'
        console.error('❌ [STORE] Erro ao adicionar manutenção:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async updateMaintenance(id, updates) {
      this.loading = true
      this.error = null
      
      try {
        console.log('🔵 [STORE] updateMaintenance - ID:', id, 'Updates:', updates)
        
        const response = await maintenanceService.update(id, updates)
        
        console.log('🔵 [STORE] Manutenção atualizada:', response.data)
        
        // ✅ RELOAD após atualizar
        await this.fetchMaintenances()
        
        console.log('✅ [STORE] Manutenção atualizada e dados recarregados!')
        
        return response.data
        
      } catch (error) {
        this.error = 'Erro ao atualizar manutenção'
        console.error('❌ [STORE] Erro ao atualizar manutenção:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    async deleteMaintenance(id) {
      this.loading = true
      this.error = null
      
      try {
        console.log('🔵 [STORE] deleteMaintenance - ID:', id)
        
        await maintenanceService.delete(id)
        
        // ✅ RELOAD após deletar
        await this.fetchMaintenances()
        
        console.log('✅ [STORE] Manutenção deletada e dados recarregados!')
        
      } catch (error) {
        this.error = 'Erro ao deletar manutenção'
        console.error('❌ [STORE] Erro ao deletar manutenção:', error)
        throw error
      } finally {
        this.loading = false
      }
    },

    getMachineById(id) {
      return this.machines.find(m => (m.id || m._id) === id)
    },

    getMaintenancesByMachine(machineId) {
      const allMaint = this.allMaintenances
      const filtered = allMaint.filter(m => {
        const mId = m.machineId || m.machine
        return mId === machineId || mId?.toString() === machineId?.toString()
      })
      
      console.log(`🔍 [STORE] Manutenções da máquina ${machineId}:`, filtered.length)
      
      return filtered
    }
  }
})