<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Máquinas</h2>
        <p class="text-gray-600">Gerencie o status e manutenções das máquinas</p>
      </div>
    </div>

    <!-- Resumo por Status -->
    <div class="grid grid-cols-1 gap-6 md:grid-cols-3">
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
    <div class="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div 
        v-for="machine in store.machines" 
        :key="machine.id || machine._id"
        class="overflow-hidden transition-shadow bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg"
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
            <!-- ✅ Dropdown para alterar status -->
            <div>
              <label class="text-sm font-medium text-gray-500">
                Atualizar Status
              </label>
              <select
                v-model="machine.status"
                @change="updateMachineStatus(machine)"
                class="w-full px-3 py-2 mt-1 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                :disabled="loadingMachines[machine._id || machine.id]"
              >
                <option value="verde">🟢 Operacional</option>
                <option value="amarelo">🟡 Atenção</option>
                <option value="vermelho">🔴 Crítico</option>
              </select>
              <!-- Feedback de loading -->
              <p v-if="loadingMachines[machine._id || machine.id]" class="mt-1 text-xs text-blue-600">
                Salvando...
              </p>
              <p v-if="successMachines[machine._id || machine.id]" class="mt-1 text-xs text-green-600">
                ✓ Salvo com sucesso!
              </p>
            </div>
            
            <div>
              <label class="text-sm font-medium text-gray-500">
                Status Atual
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
                {{ getNextMaintenanceDate(machine.id || machine._id) }}
              </p>
            </div>
          </div>
          
          <!-- Ações -->
          <div class="flex gap-2 mt-6">
            <button
              @click="viewMachineHistory(machine)"
              class="flex-1 px-3 py-2 text-sm text-white transition-colors bg-blue-600 rounded-lg hover:bg-blue-700"
            >
              Ver Histórico
            </button>
            <button
              @click="scheduleMaintenance(machine)"
              class="flex-1 px-3 py-2 text-sm text-white transition-colors bg-green-600 rounded-lg hover:bg-green-700"
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
import { ref, reactive, onMounted } from 'vue'
import { useMaintenanceStore } from '../store'
import machineService from '../services/machineService'
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
    
    // Controle de loading e sucesso para cada máquina
    const loadingMachines = reactive({})
    const successMachines = reactive({})
    
    // Busca os dados do backend ao carregar a página
    onMounted(async () => {
      console.log('🟢 MOUNTED - Carregando dados...')
      await Promise.all([
        store.fetchMachines(),
        store.fetchMaintenances()
      ])
      console.log('🟢 DADOS CARREGADOS:', store.machines)
    })
    
    // ✅ Atualiza o status no MongoDB - COM DEBUG
    const updateMachineStatus = async (machine) => {
      console.log('🔵 FUNÇÃO CHAMADA! Machine:', machine)
      alert('FUNÇÃO FOI CHAMADA! ID: ' + (machine._id || machine.id))
      
      // Funciona com id OU _id
      const machineId = machine._id || machine.id
      
      console.log('🔵 MACHINE ID:', machineId)
      console.log('🔵 NOVO STATUS:', machine.status)
      
      if (!machineId) {
        alert('Erro: ID da máquina não encontrado')
        return
      }
      
      // Ativa loading
      loadingMachines[machineId] = true
      successMachines[machineId] = false
      
      try {
        console.log('🔵 Chamando API...')
        // Chama a API para salvar no MongoDB
        await machineService.updateStatus(machineId, machine.status)
        
        console.log('🔵 API respondeu com sucesso!')
        
        // Atualiza a store (Pinia)
        await store.fetchMachines()
        
        // Mostra mensagem de sucesso
        successMachines[machineId] = true
        
        // Remove a mensagem após 2 segundos
        setTimeout(() => {
          successMachines[machineId] = false
        }, 2000)
        
      } catch (error) {
        console.error('❌ Erro ao atualizar status:', error)
        alert('Erro ao salvar o status. Tente novamente.')
      } finally {
        // Desativa loading
        loadingMachines[machineId] = false
      }
    }
    
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
      console.log('🟡 Agendando manutenção para:', machine)
      
      // ✅ Usa _id ou id
      const machineId = machine._id || machine.id
      
      console.log('🟡 Machine ID:', machineId)
      
      if (!machineId) {
        alert('Erro: ID da máquina não encontrado')
        return
      }
      
      newMaintenance.value = {
        machineId: machineId,
        machine: machine.name,
        sector: machine.sector,
        status: 'Agendada',
        type: 'Preventiva'
      }
      
      console.log('🟡 newMaintenance.value:', newMaintenance.value)
      
      showScheduleModal.value = true
    }
    
    const closeScheduleModal = () => {
      showScheduleModal.value = false
      newMaintenance.value = null
    }
    
    const saveScheduledMaintenance = async (maintenanceData) => {
      await store.addMaintenance(maintenanceData)
      closeScheduleModal()
    }
    
    return {
      store,
      showHistoryModal,
      showScheduleModal,
      selectedMachine,
      newMaintenance,
      loadingMachines,
      successMachines,
      updateMachineStatus,
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