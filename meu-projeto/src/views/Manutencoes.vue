<template>
  <div class="space-y-6">
    <!-- Header com botão de nova manutenção -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800">Lista de Manutenções</h2>
        <p class="text-gray-600">Gerencie todas as manutenções do sistema</p>
      </div>
      
      <button
        @click="showModal = true"
        class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
      >
        + Nova Manutenção
      </button>
    </div>

    <!-- Filtros -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Máquina
          </label>
          <select 
            v-model="filters.machine"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todas as máquinas</option>
            <option v-for="machine in store.machines" :key="machine.id" :value="machine.name">
              {{ machine.name }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status
          </label>
          <select 
            v-model="filters.status"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os status</option>
            <option value="Concluída">Concluída</option>
            <option value="Pendente">Pendente</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Agendada">Agendada</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Setor
          </label>
          <select 
            v-model="filters.sector"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Todos os setores</option>
            <option value="Produção">Produção</option>
            <option value="Embalagem">Embalagem</option>
          </select>
        </div>
        
        <div class="flex items-end">
          <button
            @click="clearFilters"
            class="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Limpar Filtros
          </button>
        </div>
      </div>
    </div>

    <!-- Tabela de Manutenções -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-50 border-b border-gray-200">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                ID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Máquina
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Técnico
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Setor
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Ações
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr 
              v-for="maintenance in filteredMaintenances" 
              :key="maintenance.id"
              class="hover:bg-gray-50"
            >
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                #{{ String(maintenance.id).padStart(3, '0') }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ maintenance.machine }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ formatDate(maintenance.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="getStatusBadge(maintenance.status)"
                >
                  {{ maintenance.status }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ maintenance.technician }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                {{ maintenance.sector }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <button
                  @click="viewMaintenance(maintenance)"
                  class="text-blue-600 hover:text-blue-900 mr-3"
                >
                  Ver
                </button>
                <button
                  @click="editMaintenance(maintenance)"
                  class="text-green-600 hover:text-green-900 mr-3"
                >
                  Editar
                </button>
                <button
                  @click="deleteMaintenance(maintenance.id)"
                  class="text-red-600 hover:text-red-900"
                >
                  Excluir
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Modal de Nova/Editar Manutenção -->
    <MaintenanceModal
      v-if="showModal"
      :maintenance="selectedMaintenance"
      @close="closeModal"
      @save="saveMaintenance"
    />

    <!-- Modal de Visualização -->
    <ViewMaintenanceModal
      v-if="showViewModal"
      :maintenance="selectedMaintenance"
      @close="showViewModal = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'
import { useMaintenanceStore } from '../store'
import MaintenanceModal from '../components/MaintenanceModal.vue'
import ViewMaintenanceModal from '../components/ViewMaintenanceModal.vue'

export default {
  name: 'Manutencoes',
  components: {
    MaintenanceModal,
    ViewMaintenanceModal
  },
  
  setup() {
    const store = useMaintenanceStore()
    const showModal = ref(false)
    const showViewModal = ref(false)
    const selectedMaintenance = ref(null)
    
    const filters = ref({
      machine: '',
      status: '',
      sector: ''
    })
    
    const filteredMaintenances = computed(() => {
      let maintenances = store.allMaintenances
      
      if (filters.value.machine) {
        maintenances = maintenances.filter(m => m.machine === filters.value.machine)
      }
      
      if (filters.value.status) {
        maintenances = maintenances.filter(m => m.status === filters.value.status)
      }
      
      if (filters.value.sector) {
        maintenances = maintenances.filter(m => m.sector === filters.value.sector)
      }
      
      return maintenances
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
    
    const clearFilters = () => {
      filters.value = {
        machine: '',
        status: '',
        sector: ''
      }
    }
    
    const viewMaintenance = (maintenance) => {
      selectedMaintenance.value = maintenance
      showViewModal.value = true
    }
    
    const editMaintenance = (maintenance) => {
      selectedMaintenance.value = { ...maintenance }
      showModal.value = true
    }
    
    const deleteMaintenance = (id) => {
      if (confirm('Tem certeza que deseja excluir esta manutenção?')) {
        store.deleteMaintenance(id)
      }
    }
    
    const closeModal = () => {
      showModal.value = false
      selectedMaintenance.value = null
    }
    
    const saveMaintenance = (maintenanceData) => {
      if (selectedMaintenance.value && selectedMaintenance.value.id) {
        store.updateMaintenance(selectedMaintenance.value.id, maintenanceData)
      } else {
        store.addMaintenance(maintenanceData)
      }
      closeModal()
    }
    
    return {
      store,
      showModal,
      showViewModal,
      selectedMaintenance,
      filters,
      filteredMaintenances,
      getStatusBadge,
      formatDate,
      clearFilters,
      viewMaintenance,
      editMaintenance,
      deleteMaintenance,
      closeModal,
      saveMaintenance
    }
  }
}
</script>