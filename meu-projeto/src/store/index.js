import { defineStore } from 'pinia'

export const useMaintenanceStore = defineStore('maintenance', {
  state: () => ({
    machines: [
      { id: 1, name: 'M1', sector: 'Produção', status: 'verde', lastMaintenance: '2025-08-15' },
      { id: 2, name: 'M2', sector: 'Produção', status: 'amarelo', lastMaintenance: '2025-08-10' },
      { id: 3, name: 'M3', sector: 'Embalagem', status: 'vermelho', lastMaintenance: '2025-07-30' },
      { id: 4, name: 'M4', sector: 'Produção', status: 'verde', lastMaintenance: '2025-08-20' },
      { id: 5, name: 'M5', sector: 'Embalagem', status: 'amarelo', lastMaintenance: '2025-08-12' }
    ],
    maintenances: [
      {
        id: 1,
        machineId: 1,
        machine: 'M1',
        date: '2025-08-15',
        status: 'Concluída',
        technician: 'João Silva',
        type: 'Preventiva',
        description: 'Lubrificação e inspeção geral',
        sector: 'Produção'
      },
      {
        id: 2,
        machineId: 2,
        machine: 'M2',
        date: '2025-08-16',
        status: 'Pendente',
        technician: 'Maria Santos',
        type: 'Preventiva',
        description: 'Troca de filtros',
        sector: 'Produção'
      },
      {
        id: 3,
        machineId: 3,
        machine: 'M3',
        date: '2025-08-17',
        status: 'Em Andamento',
        technician: 'Pedro Costa',
        type: 'Corretiva',
        description: 'Reparo no motor',
        sector: 'Embalagem'
      }
    ],
    scheduledMaintenances: [
      {
        id: 4,
        machineId: 4,
        machine: 'M4',
        date: '2025-09-05',
        status: 'Agendada',
        technician: 'Ana Lima',
        type: 'Preventiva',
        description: 'Inspeção trimestral',
        sector: 'Produção'
      },
      {
        id: 5,
        machineId: 5,
        machine: 'M5',
        date: '2025-09-07',
        status: 'Agendada',
        technician: 'Carlos Oliveira',
        type: 'Preventiva',
        description: 'Calibração de sensores',
        sector: 'Embalagem'
      }
    ]
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
    addMaintenance(maintenance) {
      const newMaintenance = {
        id: Date.now(),
        ...maintenance,
        date: new Date().toISOString().split('T')[0]
      }
      
      this.maintenances.push(newMaintenance)
      
      // Atualiza status da máquina
      const machine = this.machines.find(m => m.id === maintenance.machineId)
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
      return this.machines.find(m => m.id === id)
    },

    getMaintenancesByMachine(machineId) {
      return this.allMaintenances.filter(m => m.machineId === machineId)
    }
  }
})