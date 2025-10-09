<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-lg w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          Detalhes da Manutenção #{{ String(maintenance.id).padStart(3, '0') }}
        </h2>
      </div>
      
      <div class="p-6 space-y-4">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Máquina
            </label>
            <p class="text-gray-900 font-medium">{{ maintenance.machine }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Setor
            </label>
            <p class="text-gray-900 font-medium">{{ maintenance.sector }}</p>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Data
            </label>
            <p class="text-gray-900 font-medium">{{ formatDate(maintenance.date) }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Status
            </label>
            <span 
              class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
              :class="getStatusBadge(maintenance.status)"
            >
              {{ maintenance.status }}
            </span>
          </div>
        </div>
        
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Técnico
            </label>
            <p class="text-gray-900 font-medium">{{ maintenance.technician }}</p>
          </div>
          
          <div>
            <label class="block text-sm font-medium text-gray-500 mb-1">
              Tipo
            </label>
            <p class="text-gray-900 font-medium">{{ maintenance.type }}</p>
          </div>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-500 mb-1">
            Descrição
          </label>
          <p class="text-gray-900 bg-gray-50 p-3 rounded-lg">
            {{ maintenance.description }}
          </p>
        </div>
        
        <!-- Histórico da máquina -->
        <div v-if="machineHistory.length > 0" class="border-t border-gray-200 pt-4">
          <h3 class="text-lg font-medium text-gray-800 mb-3">
            Histórico da Máquina {{ maintenance.machine }}
          </h3>
          
          <div class="space-y-2 max-h-48 overflow-y-auto">
            <div 
              v-for="history in machineHistory" 
              :key="history.id"
              class="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
            >
              <div>
                <p class="text-sm font-medium text-gray-900">
                  {{ history.description }}
                </p>
                <p class="text-xs text-gray-600">
                  {{ history.technician }} • {{ formatDate(history.date) }}
                </p>
              </div>
              <span 
                class="text-xs px-2 py-1 rounded-full"
                :class="getStatusBadge(history.status)"
              >
                {{ history.status }}
              </span>
            </div>
          </div>
        </div>
        
        <div class="flex justify-end pt-4">
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
  name: 'ViewMaintenanceModal',
  props: {
    maintenance: {
      type: Object,
      required: true
    }
  },
  emits: ['close'],
  
  setup(props) {
    const store = useMaintenanceStore()
    
    const machineHistory = computed(() => {
      return store.getMaintenancesByMachine(props.maintenance.machineId)
        .filter(m => m.id !== props.maintenance.id)
        .slice(0, 5)
    })
    
    const getStatusBadge = (status) => {
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
      machineHistory,
      getStatusBadge,
      formatDate
    }
  }
}
</script>