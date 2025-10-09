<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Máquinas</h2>
        <p class="text-gray-600">Gerencie o status e manutenções das máquinas</p>
      </div>
    </div>

    <!-- Resumo por Status -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <KpiCard
        title="Máquinas Operacionais"
        :value="store.machinesByStatus.green"
        subtitle="Status: Verde"
        color="green"
      />
      
      <KpiCard
        title="Máquinas em Atenção"
        :value="store.machinesByStatus.yellow"
        subtitle="Status: Amarelo"
        color="yellow"
      />
      
      <KpiCard
        title="Máquinas Críticas"
        :value="store.machinesByStatus.red"
        subtitle="Status: Vermelho"
        color="red"
      />
    </div>

    <!-- Grid de Máquinas -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div 
        v-for="machine in store.machines" 
        :key="machine.id"
        class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
      >
        <!-- Header do Card -->
        <div class="px-6 py-4 border-b border-gray-200">
          <div class="flex items-center justify-between">
            <h3 class="text-lg font-semibold text-gray-800">
              {{ machine.name }}
            </h3>
            <div 
              class="w-4 h-4 rounded-full"
              :class="getStatusColor(machine.status)"
            ></div>
          </div>
          <p class="text-sm text-gray-600">{{ machine.sector }}</p>
        </div>
        
        <!-- Conteúdo do Card -->
        <div class="p-6">
          <div class="space-y-3">
            <div>
              <label class="text-sm font-medium text-gray-500">
                Status
              </label>
              <p class="mt-1">
                <span 
                  class="inline-flex px-2 py-1 text-xs font-semibold rounded-full"
                  :class="getStatusBadge(machine.status)"
                >
                  {{ getStatusText(machine.status) }}
                </span>
              </p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">
                Última Manutenção
              </label>
              <p class="mt-1 text-gray-900">
                {{ formatDate(machine.lastMaintenance) }}
              </p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">
                Próxima Manutenção
              </label>
              <p class="mt-1 text-gray-900">
                {{ getNextMaintenanceDate(machine.id) }}
              </p>
            </div>
          </div>
          
          <!-- Ações -->
          <div class="mt-6 flex gap-2">
            <button
              @click="viewMachineHistory(machine)"
              class="flex-1 bg-blue-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors"
            >
              Ver Histórico
            </button>
            <button
              @click="scheduleMaintenance(machine)"
              class="flex-1 bg-green-600 text-white px-3 py-2 rounded-lg text-sm hover:bg-green-700 transition-colors"
            >
              Agendar
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Histórico da Máquina -->
    <MachineHistoryModal
      v-if="showHistoryModal"
      :machine="selectedMachine"
      @close="showHistoryModal = false"
    />

    <!-- Modal de Agendamento -->
    <MaintenanceModal
      v-if="showScheduleModal"
      :maintenance="newMaintenance"
      @close="closeScheduleModal"
      @save="saveScheduledMaintenance"
    />
  </div>
</template>

<script>
import { ref, computed } from 'vue'
import { useMaintenanceStore } from '../store'
import KpiCard from '../components/KpiCard.vue'
import MachineHistoryModal from '../components/MachineHistoryModal.vue'
import MaintenanceModal from '../components/MaintenanceModal.vue'

export default {
  name: 'Maquinas',
  components: {
    KpiCard,
    MachineHistoryModal,
    MaintenanceModal
  },
  
  setup() {
    const store = useMaintenanceStore()
    const showHistoryModal = ref(false)
    const showScheduleModal = ref(false)
    const selectedMachine = ref(null)
    const newMaintenance = ref(null)
    
    const getStatusColor = (status) => {
      const colors = {
        'verde': 'bg-green-500',
        'amarelo': 'bg-yellow-500',
        'vermelho': 'bg-red-500'
      }
      return colors[status] || 'bg-gray-500'
    }
    
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
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR')
    }
    
    const getNextMaintenanceDate = (machineId) => {
      const nextMaintenance = store.scheduledMaintenances
        .filter(m => m.machineId === machineId)
        .sort((a, b) => new Date(a.date) - new Date(b.date))[0]
      
      return nextMaintenance ? formatDate(nextMaintenance.date) : 'Não agendada'
    }
    
    const viewMachineHistory = (machine) => {
      selectedMachine.value = machine
      showHistoryModal.value = true
    }
    
    const scheduleMaintenance = (machine) => {
      newMaintenance.value = {
        machineId: machine.id,
        machine: machine.name,
        sector: machine.sector,
        status: 'Agendada',
        type: 'Preventiva'
      }
      showScheduleModal.value = true
    }
    
    const closeScheduleModal = () => {
      showScheduleModal.value = false
      newMaintenance.value = null
    }
    
    const saveScheduledMaintenance = (maintenanceData) => {
      store.addMaintenance(maintenanceData)
      closeScheduleModal()
    }
    
    return {
      store,
      showHistoryModal,
      showScheduleModal,
      selectedMachine,
      newMaintenance,
      getStatusColor,
      getStatusBadge,
      getStatusText,
      formatDate,
      getNextMaintenanceDate,
      viewMachineHistory,
      scheduleMaintenance,
      closeScheduleModal,
      saveScheduledMaintenance
    }
  }
}
</script>