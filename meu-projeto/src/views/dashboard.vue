<template>
  <div class="space-y-6">
    <!-- KPIs Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <KpiCard
        title="Total de Máquinas"
        :value="store.totalMachines"
        subtitle="Máquinas cadastradas"
        color="blue"
        :trend="{ positive: true, value: '+2', label: 'este mês' }"
      />
      
      <KpiCard
        title="Manutenções Concluídas"
        :value="store.maintenanceStats.concluded"
        subtitle="Este mês"
        color="green"
        :trend="{ positive: true, value: '+15%', label: 'vs mês anterior' }"
      />
      
      <KpiCard
        title="Manutenções Pendentes"
        :value="store.maintenanceStats.pending"
        subtitle="Requerem atenção"
        color="yellow"
        :trend="{ positive: false, value: '+2', label: 'vs semana anterior' }"
      />
      
      <KpiCard
        title="Manutenções Atrasadas"
        :value="store.machinesByStatus.red"
        subtitle="Críticas"
        color="red"
        :trend="{ positive: false, value: '+1', label: 'esta semana' }"
      />
    </div>

    <!-- Charts Section -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Monthly Maintenance Chart -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Evolução das Manutenções
        </h3>
        <div class="h-64">
          <canvas ref="monthlyChart"></canvas>
        </div>
      </div>

      <!-- Machine Status Pie Chart -->
      <div class="bg-white rounded-lg shadow-md p-6 border border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800 mb-4">
          Status das Máquinas
        </h3>
        <div class="h-64 flex items-center justify-center">
          <canvas ref="statusChart"></canvas>
        </div>
      </div>
    </div>

    <!-- Recent Activities -->
    <div class="bg-white rounded-lg shadow-md border border-gray-200">
      <div class="px-6 py-4 border-b border-gray-200">
        <h3 class="text-lg font-semibold text-gray-800">
          Atividades Recentes
        </h3>
      </div>
      
      <div class="p-6">
        <div class="space-y-4">
          <div 
            v-for="maintenance in recentMaintenances" 
            :key="maintenance.id"
            class="flex items-center justify-between p-4 bg-gray-50 rounded-lg"
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
                  {{ maintenance.technician }} • {{ formatDate(maintenance.date) }}
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
  </div>
</template>

<script>
import { onMounted, ref, computed } from 'vue'
import { useMaintenanceStore } from '../store'
import KpiCard from '../components/KpiCard.vue'

export default {
  name: 'Dashboard',
  components: {
    KpiCard
  },
  
  setup() {
    const store = useMaintenanceStore()
    const monthlyChart = ref(null)
    const statusChart = ref(null)
    
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
    
    const createCharts = () => {
      // Simulação de gráficos - em um projeto real, usaria Chart.js
      if (monthlyChart.value) {
        const ctx = monthlyChart.value.getContext('2d')
        ctx.fillStyle = '#3B82F6'
        ctx.fillRect(20, 20, 100, 100)
        ctx.fillStyle = '#10B981'
        ctx.fillRect(140, 40, 100, 80)
        ctx.fillStyle = '#F59E0B'
        ctx.fillRect(260, 60, 100, 60)
        
        ctx.fillStyle = '#374151'
        ctx.font = '14px Inter'
        ctx.fillText('Concluídas', 30, 140)
        ctx.fillText('Pendentes', 150, 140)
        ctx.fillText('Agendadas', 270, 140)
      }
      
      if (statusChart.value) {
        const ctx = statusChart.value.getContext('2d')
        // Círculo verde
        ctx.beginPath()
        ctx.arc(100, 100, 80, 0, Math.PI)
        ctx.fillStyle = '#10B981'
        ctx.fill()
        
        // Círculo amarelo
        ctx.beginPath()
        ctx.arc(100, 100, 80, Math.PI, Math.PI * 1.5)
        ctx.fillStyle = '#F59E0B'
        ctx.fill()
        
        // Círculo vermelho
        ctx.beginPath()
        ctx.arc(100, 100, 80, Math.PI * 1.5, Math.PI * 2)
        ctx.fillStyle = '#EF4444'
        ctx.fill()
      }
    }
    
    onMounted(() => {
      createCharts()
    })
    
    return {
      store,
      monthlyChart,
      statusChart,
      recentMaintenances,
      getStatusColor,
      getStatusBadge,
      formatDate
    }
  }
}
</script>