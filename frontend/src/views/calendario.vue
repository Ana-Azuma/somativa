<template>
  <div class="space-y-6">
    <!-- Header do Calendário -->
    <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
      <div class="flex justify-between items-center mb-4">
        <div>
          <h2 class="text-2xl font-bold text-gray-800">
            {{ currentMonthYear }}
          </h2>
          <p class="text-gray-600">Visualize manutenções programadas e realizadas</p>
        </div>
        
        <div class="flex items-center gap-2">
          <button
            @click="previousMonth"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ←
          </button>
          <button
            @click="nextMonth"
            class="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            →
          </button>
          <button
            @click="goToToday"
            class="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Hoje
          </button>
        </div>
      </div>
      
      <!-- Legenda -->
      <div class="flex items-center gap-6 text-sm">
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-green-500 rounded-full"></div>
          <span class="text-gray-600">Concluída</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-blue-500 rounded-full"></div>
          <span class="text-gray-600">Em Andamento</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
          <span class="text-gray-600">Pendente</span>
        </div>
        <div class="flex items-center gap-2">
          <div class="w-3 h-3 bg-purple-500 rounded-full"></div>
          <span class="text-gray-600">Agendada</span>
        </div>
      </div>
    </div>

    <!-- Calendário -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden">
      <!-- Cabeçalho dos dias da semana -->
      <div class="grid grid-cols-7 bg-gray-50 border-b border-gray-200">
        <div 
          v-for="day in dayNames" 
          :key="day"
          class="p-4 text-center text-sm font-medium text-gray-600 uppercase"
        >
          {{ day }}
        </div>
      </div>
      
      <!-- Dias do mês -->
      <div class="grid grid-cols-7">
        <div 
          v-for="day in calendarDays" 
          :key="day.date"
          class="min-h-[120px] border-r border-b border-gray-100 p-2"
          :class="{
            'bg-gray-50': !day.isCurrentMonth,
            'bg-blue-50': day.isToday
          }"
        >
          <!-- Número do dia -->
          <div class="flex justify-between items-start mb-2">
            <span 
              class="text-sm font-medium"
              :class="{
                'text-gray-400': !day.isCurrentMonth,
                'text-blue-600 font-bold': day.isToday,
                'text-gray-900': day.isCurrentMonth && !day.isToday
              }"
            >
              {{ day.day }}
            </span>
          </div>
          
          <!-- Manutenções do dia -->
          <div class="space-y-1">
            <div 
              v-for="maintenance in day.maintenances" 
              :key="maintenance.id"
              @click="viewMaintenance(maintenance)"
              class="text-xs p-1 rounded cursor-pointer hover:opacity-75 transition-opacity"
              :class="getMaintenanceStyle(maintenance.status)"
              :title="`${maintenance.machine} - ${maintenance.description}`"
            >
              <div class="truncate font-medium">
                {{ maintenance.machine }}
              </div>
              <div class="truncate text-xs opacity-90">
                {{ maintenance.technician }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Lista de manutenções do dia selecionado -->
    <div v-if="selectedDayMaintenances.length > 0" class="bg-white rounded-lg shadow-md border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          Manutenções de {{ formatSelectedDate }}
        </h3>
      </div>
      
      <div class="p-6">
        <div class="space-y-3">
          <div 
            v-for="maintenance in selectedDayMaintenances" 
            :key="maintenance.id"
            @click="viewMaintenance(maintenance)"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100 transition-colors"
          >
            <div class="flex items-center gap-4">
              <div 
                class="w-3 h-3 rounded-full"
                :class="getStatusColor(maintenance.status)"
              ></div>
              <div>
                <h4 class="font-medium text-gray-800">
                  {{ maintenance.machine }} - {{ maintenance.description }}
                </h4>
                <p class="text-sm text-gray-600">
                  {{ maintenance.technician }} • {{ maintenance.type }}
                </p>
              </div>
            </div>
            
            <span 
              class="px-3 py-1 rounded-full text-xs font-medium"
              :class="getStatusBadge(maintenance.status)"
            >
              {{ maintenance.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

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
import ViewMaintenanceModal from '../components/ViewMaintenanceModal.vue'

export default {
  name: 'Calendario',
  components: {
    ViewMaintenanceModal
  },
  
  setup() {
    const store = useMaintenanceStore()
    const currentDate = ref(new Date())
    const selectedDate = ref(null)
    const showViewModal = ref(false)
    const selectedMaintenance = ref(null)
    
    const dayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb']
    
    const currentMonthYear = computed(() => {
      return currentDate.value.toLocaleDateString('pt-BR', {
        month: 'long',
        year: 'numeric'
      })
    })
    
    const formatSelectedDate = computed(() => {
      if (!selectedDate.value) return ''
      return selectedDate.value.toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
    
    const calendarDays = computed(() => {
      const year = currentDate.value.getFullYear()
      const month = currentDate.value.getMonth()
      
      // Primeiro dia do mês
      const firstDay = new Date(year, month, 1)
      // Último dia do mês
      const lastDay = new Date(year, month + 1, 0)
      
      // Dias para mostrar (incluindo dias do mês anterior e próximo)
      const startDate = new Date(firstDay)
      startDate.setDate(startDate.getDate() - firstDay.getDay())
      
      const endDate = new Date(lastDay)
      endDate.setDate(endDate.getDate() + (6 - lastDay.getDay()))
      
      const days = []
      const currentDateLoop = new Date(startDate)
      
      while (currentDateLoop <= endDate) {
        const day = {
          date: new Date(currentDateLoop),
          day: currentDateLoop.getDate(),
          isCurrentMonth: currentDateLoop.getMonth() === month,
          isToday: isToday(currentDateLoop),
          maintenances: getMaintenancesForDate(currentDateLoop)
        }
        
        days.push(day)
        currentDateLoop.setDate(currentDateLoop.getDate() + 1)
      }
      
      return days
    })
    
    const selectedDayMaintenances = computed(() => {
      if (!selectedDate.value) return []
      return getMaintenancesForDate(selectedDate.value)
    })
    
    const isToday = (date) => {
      const today = new Date()
      return date.toDateString() === today.toDateString()
    }
    
    const getMaintenancesForDate = (date) => {
      const dateStr = date.toISOString().split('T')[0]
      return store.allMaintenances.filter(m => m.date === dateStr)
    }
    
    const getMaintenanceStyle = (status) => {
      const styles = {
        'Concluída': 'bg-green-500 text-white',
        'Pendente': 'bg-yellow-500 text-white',
        'Em Andamento': 'bg-blue-500 text-white',
        'Agendada': 'bg-purple-500 text-white'
      }
      return styles[status] || 'bg-gray-500 text-white'
    }
    
    const getStatusColor = (status) => {
      const colors = {
        'Concluída': 'bg-green-500',
        'Pendente': 'bg-yellow-500',
        'Em Andamento': 'bg-blue-500',
        'Agendada': 'bg-purple-500'
      }
      return colors[status] || 'bg-gray-500'
    }
    
    const getStatusBadge = (status) => {
      const badges = {
        'Concluída': 'bg-green-100 text-green-800',
        'Pendente': 'bg-yellow-100 text-yellow-800',
        'Em Andamento': 'bg-blue-100 text-blue-800',
        'Agendada': 'bg-purple-100 text-purple-800'
      }
      return badges[status] || 'bg-gray-100 text-gray-800'
    }
    
    const previousMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
    }
    
    const nextMonth = () => {
      currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
    }
    
    const goToToday = () => {
      currentDate.value = new Date()
      selectedDate.value = new Date()
    }
    
    const viewMaintenance = (maintenance) => {
      selectedMaintenance.value = maintenance
      showViewModal.value = true
    }
    
    // Seleciona hoje por padrão
    onMounted(() => {
      selectedDate.value = new Date()
    })
    
    return {
      currentDate,
      selectedDate,
      showViewModal,
      selectedMaintenance,
      dayNames,
      currentMonthYear,
      formatSelectedDate,
      calendarDays,
      selectedDayMaintenances,
      getMaintenanceStyle,
      getStatusColor,
      getStatusBadge,
      previousMonth,
      nextMonth,
      goToToday,
      viewMaintenance
    }
  }
}
</script>