<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          Histórico da Máquina {{ machine.name }}
        </h2>
        <p class="text-sm text-gray-600">{{ machine.sector }}</p>
      </div>
      
      <div class="p-6">
        <!-- Informações da Máquina -->
        <div class="bg-gray-50 rounded-lg p-4 mb-6">
          <div class="grid grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">
                Status Atual
              </label>
              <span 
                class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                :class="getStatusBadge(machine.status)"
              >
                {{ getStatusText(machine.status) }}
              </span>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">
                Última Manutenção
              </label>
              <p class="text-gray-900 font-medium">{{ formatDate(machine.lastMaintenance) }}</p>
            </div>
            
            <div>
              <label class="block text-sm font-medium text-gray-500 mb-1">
                Total de Manutenções
              </label>
              <p class="text-gray-900 font-medium">{{ machineMaintenances.length }}</p>
            </div>
          </div>
        </div>

        <!-- Estatísticas -->
        <div class="grid grid-cols-4 gap-4 mb-6">
          <div class="text-center p-4 bg-green-50 rounded-lg">
            <div class="text-2xl font-bold text-green-600">{{ stats.concluded }}</div>
            <div class="text-sm text-green-600">Concluídas</div>
          </div>
          
          <div class="text-center p-4 bg-yellow-50 rounded-lg">
            <div class="text-2xl font-bold text-yellow-600">{{ stats.pending }}</div>
            <div class="text-sm text-yellow-600">Pendentes</div>
          </div>
          
          <div class="text-center p-4 bg-blue-50 rounded-lg">
            <div class="text-2xl font-bold text-blue-600">{{ stats.inProgress }}</div>
            <div class="text-sm text-blue-600">Em Andamento</div>
          </div>
          
          <div class="text-center p-4 bg-purple-50 rounded-lg">
            <div class="text-2xl font-bold text-purple-600">{{ stats.scheduled }}</div>
            <div class="text-sm text-purple-600">Agendadas</div>
          </div>
        </div>

        <!-- Lista de Manutenções -->
        <div>
          <h3 class="text-lg font-semibold text-gray-800 mb-4">
            Histórico de Manutenções
          </h3>
          
          <div v-if="machineMaintenances.length === 0" class="text-center py-8 text-gray-500">
            Nenhuma manutenção encontrada para esta máquina.
          </div>
          
          <div v-else class="space-y-4 max-h-96 overflow-y-auto">
            <div 
              v-for="maintenance in machineMaintenances" 
              :key="maintenance.id"
              class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
            >
              <div class="flex justify-between items-start mb-2">
                <div>
                  <h4 class="font-medium text-gray-800">
                    {{ maintenance.description }}
                  </h4>
                  <p class="text-sm text-gray-600">
                    {{ maintenance.technician }} • {{ maintenance.type }}
                  </p>
                </div>
                
                <span 
                  class="px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getMaintenanceStatusBadge(maintenance.status)"
                >
                  {{ maintenance.status }}
                </span>
              </div>
              
              <div class="flex justify-between items-center text-sm text-gray-500">
                <span>{{ formatDate(maintenance.date) }}</span>
                <span>#{{ String(maintenance.id).padStart(3, '0') }}</span>
              </div>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end mt-6">
          <button
            @click="$emit('close')"
            class="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useMaintenanceStore } from '../store'

export default {
  name: 'MachineHistoryModal',
  props: {
    machine: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  
  setup(props) {
    const store = useMaintenanceStore()
    
    const machineMaintenances = computed(() => {
      return store.getMaintenancesByMachine(props.machine.id)
        .sort((a, b) => new Date(b.date) - new Date(a.date))
    })
    
    const stats = computed(() => {
      const maintenances = machineMaintenances.value
      return {
        concluded: maintenances.filter(m => m.status === 'Concluída').length,
        pending: maintenances.filter(m => m.status === 'Pendente').length,
        inProgress: maintenances.filter(m => m.status === 'Em Andamento').length,
        scheduled: maintenances.filter(m => m.status === 'Agendada').length
      }
    })
    
    const getStatusBadge = (status) => {
      const badges = {
        'verde': 'bg-green-100 text-green-800',
        'amarelo': 'bg-yellow-100 text-yellow-800',
        'vermelho': 'bg-red-100 text-red-800'
      }
      return badges[status] || 'bg-gray-100 text-gray-800'
    }
    
    const getStatusText = (status) => {
      const texts = {
        'verde': 'Operacional',
        'amarelo': 'Atenção',
        'vermelho': 'Crítico'
      }
      return texts[status] || 'Desconhecido'
    }
    
    const getMaintenanceStatusBadge = (status) => {
      const badges = {
        'Concluída': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Em Andamento': 'bg-blue-100 text-blue-800',
        'Agendada': 'bg-purple-100 text-purple-800'
      }
      return badges[status] || 'bg-gray-100 text-gray-800'
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR')
    }
    
    return {
      machineMaintenances,
      stats,
      getStatusBadge,
      getStatusText,
      getMaintenanceStatusBadge,
      formatDate
    }
  }
}
</script>