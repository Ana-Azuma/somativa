<template>
  <div class="space-y-6">
    <!-- Welcome Banner -->
    <div class="p-6 text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
      <h2 class="mb-1 text-2xl font-bold">Bem-vindo ao Painel</h2>
      <p class="text-blue-100">{{ currentDate }}</p>
    </div>

    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
      <div class="p-5 transition-shadow bg-white shadow rounded-xl hover:shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center justify-center w-12 h-12 bg-blue-100 rounded-lg">
            <svg class="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600">+2</span>
        </div>
        <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ store.totalMachines }}</h3>
        <p class="text-sm text-gray-600">Total de Equipamentos</p>
      </div>

      <div class="p-5 transition-shadow bg-white shadow rounded-xl hover:shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center justify-center w-12 h-12 bg-green-100 rounded-lg">
            <svg class="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-green-600">+15%</span>
        </div>
        <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ store.maintenanceStats.concluded }}</h3>
        <p class="text-sm text-gray-600">Serviços Concluídos</p>
      </div>

      <div class="p-5 transition-shadow bg-white shadow rounded-xl hover:shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center justify-center w-12 h-12 bg-yellow-100 rounded-lg">
            <svg class="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-yellow-600">+2</span>
        </div>
        <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ store.maintenanceStats.pending }}</h3>
        <p class="text-sm text-gray-600">Aguardando Execução</p>
      </div>

      <div class="p-5 transition-shadow bg-white shadow rounded-xl hover:shadow-lg">
        <div class="flex items-center justify-between mb-3">
          <div class="flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg">
            <svg class="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span class="text-sm font-medium text-red-600">+1</span>
        </div>
        <h3 class="mb-1 text-2xl font-bold text-gray-800">{{ store.machinesByStatus.red }}</h3>
        <p class="text-sm text-gray-600">Status Crítico</p>
      </div>
    </div>

    <!-- Charts -->
    <div class="grid grid-cols-1 gap-6 lg:grid-cols-2">
      <!-- Bar Chart -->
      <div class="p-6 bg-white shadow rounded-xl">
        <h3 class="mb-6 text-lg font-bold text-gray-800">Evolução Mensal</h3>
        <div class="flex items-end justify-between h-64 gap-2 pb-4 border-b border-gray-200">
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 120px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Jan</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 150px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Fev</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 90px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Mar</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 170px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Abr</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 130px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Mai</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 180px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Jun</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 140px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Jul</span>
          </div>
          <div class="flex flex-col items-center flex-1">
            <div class="w-full rounded-t-lg bg-gradient-to-t from-blue-600 to-blue-400" style="height: 160px;"></div>
            <span class="mt-2 text-xs font-medium text-gray-600">Ago</span>
          </div>
        </div>
      </div>

      <!-- Status Donut -->
      <div class="p-6 bg-white shadow rounded-xl">
        <h3 class="mb-4 text-lg font-bold text-gray-800">Status dos Equipamentos</h3>
        <div class="flex items-center justify-center h-64">
          <div class="text-center">
            <div class="relative w-40 h-40 mx-auto mb-4">
              <svg class="w-full h-full -rotate-90">
                <circle cx="80" cy="80" r="60" fill="none" 
                        stroke="#10B981" stroke-width="20"
                        :stroke-dasharray="`${store.machinesByStatus.green * 37.7} 377`" />
                <circle cx="80" cy="80" r="60" fill="none" 
                        stroke="#F59E0B" stroke-width="20"
                        :stroke-dasharray="`${store.machinesByStatus.yellow * 37.7} 377`"
                        :stroke-dashoffset="`-${store.machinesByStatus.green * 37.7}`" />
                <circle cx="80" cy="80" r="60" fill="none" 
                        stroke="#EF4444" stroke-width="20"
                        :stroke-dasharray="`${store.machinesByStatus.red * 37.7} 377`"
                        :stroke-dashoffset="`-${(store.machinesByStatus.green + store.machinesByStatus.yellow) * 37.7}`" />
              </svg>
              <div class="absolute inset-0 flex items-center justify-center">
                <div>
                  <p class="text-3xl font-bold text-gray-800">{{ store.totalMachines }}</p>
                  <p class="text-sm text-gray-600">Total</p>
                </div>
              </div>
            </div>
            <div class="flex justify-center space-x-4 text-sm">
              <div class="flex items-center">
                <div class="w-3 h-3 mr-2 bg-green-500 rounded-full"></div>
                <span>OK: {{ store.machinesByStatus.green }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 mr-2 bg-yellow-500 rounded-full"></div>
                <span>Atenção: {{ store.machinesByStatus.yellow }}</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 mr-2 bg-red-500 rounded-full"></div>
                <span>Crítico: {{ store.machinesByStatus.red }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="p-6 bg-white shadow rounded-xl">
      <div class="flex items-center justify-between mb-4">
        <h3 class="text-lg font-bold text-gray-800">Atividades Recentes</h3>
        <router-link to="/manutencoes" class="text-sm text-blue-600 hover:text-blue-700">
          Ver todas →
        </router-link>
      </div>
      
      <div class="space-y-3">
        <div 
          v-for="maintenance in recentMaintenances" 
          :key="maintenance.id"
          class="flex items-center justify-between p-4 transition-colors rounded-lg bg-gray-50 hover:bg-gray-100"
        >
          <div class="flex items-center space-x-3">
            <div 
              class="flex items-center justify-center w-10 h-10 font-bold text-white rounded-full"
              :class="getStatusColor(maintenance.status)"
            >
              {{ maintenance.machine.substring(0, 2) }}
            </div>
            <div>
              <h4 class="font-medium text-gray-800">{{ maintenance.machine }} - {{ maintenance.description }}</h4>
              <p class="text-sm text-gray-600">{{ maintenance.technician }} • {{ formatDate(maintenance.date) }}</p>
            </div>
          </div>
          
          <span 
            class="px-3 py-1 text-xs font-medium rounded-full"
            :class="getStatusBadge(maintenance.status)"
          >
            {{ maintenance.status }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'
import { useMaintenanceStore } from '../store'

export default {
  name: 'Dashboard',
  
  setup() {
    const store = useMaintenanceStore()
    
    const currentDate = computed(() => {
      return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    })
    
    const recentMaintenances = computed(() => {
      return store.allMaintenances.slice(0, 5)
    })
    
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
        'Concluída': 'bg-green-100 text-green-700',
        'Pendente': 'bg-yellow-100 text-yellow-700',
        'Em Andamento': 'bg-blue-100 text-blue-700',
        'Agendada': 'bg-purple-100 text-purple-700'
      }
      return badges[status] || 'bg-gray-100 text-gray-700'
    }
    
    const formatDate = (date) => {
      return new Date(date).toLocaleDateString('pt-BR')
    }
    
    return {
      store,
      currentDate,
      recentMaintenances,
      getStatusColor,
      getStatusBadge,
      formatDate
    }
  }
}
</script>