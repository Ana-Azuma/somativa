<template>
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div class="bg-white rounded-lg max-w-md w-full mx-4 max-h-[90vh] overflow-y-auto">
      <div class="px-6 py-4 border-b border-gray-200">
        <h2 class="text-xl font-semibold text-gray-800">
          {{ isEditing ? 'Editar Manutenção' : 'Nova Manutenção' }}
        </h2>
      </div>
      
      <form @submit.prevent="handleSubmit" class="p-6 space-y-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Máquina *
          </label>
          <select 
            v-model="form.machineId"
            @change="updateMachine"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione uma máquina</option>
            <option v-for="machine in store.machines" :key="machine.id" :value="machine.id">
              {{ machine.name }} - {{ machine.sector }}
            </option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Data *
          </label>
          <input 
            v-model="form.date"
            type="date"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Técnico *
          </label>
          <input 
            v-model="form.technician"
            type="text"
            required
            placeholder="Nome do técnico"
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Tipo *
          </label>
          <select 
            v-model="form.type"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o tipo</option>
            <option value="Preventiva">Preventiva</option>
            <option value="Corretiva">Corretiva</option>
            <option value="Preditiva">Preditiva</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Status *
          </label>
          <select 
            v-model="form.status"
            required
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Selecione o status</option>
            <option value="Agendada">Agendada</option>
            <option value="Em Andamento">Em Andamento</option>
            <option value="Concluída">Concluída</option>
            <option value="Pendente">Pendente</option>
          </select>
        </div>
        
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Descrição *
          </label>
          <textarea 
            v-model="form.description"
            required
            rows="3"
            placeholder="Descreva a manutenção..."
            class="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>
        
        <div class="flex justify-end gap-3 pt-4">
          <button
            type="button"
            @click="$emit('close')"
            class="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancelar
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            {{ isEditing ? 'Salvar' : 'Criar' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import { useMaintenanceStore } from '../store'

export default {
  name: 'MaintenanceModal',
  props: {
    maintenance: {
      type: Object,
      default: null
    }
  },
  emits: ['close', 'save'],
  
  setup(props, { emit }) {
    const store = useMaintenanceStore()
    
    const form = ref({
      machineId: '',
      machine: '',
      date: new Date().toISOString().split('T')[0],
      technician: '',
      type: '',
      status: '',
      description: '',
      sector: ''
    })
    
    const isEditing = computed(() => {
      return props.maintenance && props.maintenance.id
    })
    
    const updateMachine = () => {
      const machine = store.getMachineById(form.value.machineId)
      if (machine) {
        form.value.machine = machine.name
        form.value.sector = machine.sector
      }
    }
    
    const handleSubmit = () => {
      if (!form.value.machineId) {
        alert('Por favor, selecione uma máquina')
        return
      }
      
      emit('save', { ...form.value })
    }
    
    // Preenche o formulário quando está editando
    watch(() => props.maintenance, (maintenance) => {
      if (maintenance) {
        form.value = {
          machineId: maintenance.machineId || '',
          machine: maintenance.machine || '',
          date: maintenance.date || new Date().toISOString().split('T')[0],
          technician: maintenance.technician || '',
          type: maintenance.type || '',
          status: maintenance.status || '',
          description: maintenance.description || '',
          sector: maintenance.sector || ''
        }
      }
    }, { immediate: true })
    
    return {
      store,
      form,
      isEditing,
      updateMachine,
      handleSubmit
    }
  }
}
</script>