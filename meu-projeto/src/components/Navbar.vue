<template>
  <header class="bg-white shadow-sm border-b border-gray-200 px-6 py-4">
    <div class="flex items-center justify-between">
      <div>
        <h2 class="text-2xl font-semibold text-gray-800">
          {{ pageTitle }}
        </h2>
        <p class="text-sm text-gray-600">
          {{ currentDate }}
        </p>
      </div>
      
      <div class="flex items-center gap-4">
        <div class="relative">
          <div class="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span class="text-white text-sm font-semibold">U</span>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script>
export default {
  name: 'Navbar',
  computed: {
    pageTitle() {
      const titles = {
        'Dashboard': 'Dashboard',
        'Calendario': 'Calendário',
        'Manutencoes': 'Lista de Manutenções',
        'Maquinas': 'Máquinas'
      }
      return titles[this.$route.name] || 'SMPM'
    },
    
    currentDate() {
      return new Date().toLocaleDateString('pt-BR', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    }
  }
}
</script>