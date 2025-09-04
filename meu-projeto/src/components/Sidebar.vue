<template>
  <aside class="fixed left-0 top-0 w-64 h-full bg-slate-800 text-white shadow-lg">
    <div class="p-6 border-b border-slate-700">
      <h1 class="text-xl font-bold">SMPM</h1>
      <p class="text-sm text-slate-300">Sistema de Manutenção</p>
    </div>
    
    <nav class="mt-6">
      <ul class="space-y-2 px-4">
        <li>
          <router-link 
            to="/" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700"
            :class="{ 'bg-blue-600': $route.name === 'Dashboard' }"
          >
            <div class="w-2 h-2 bg-blue-400 rounded-full"></div>
            Dashboard
          </router-link>
        </li>
        
        <li>
          <router-link 
            to="/calendario" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700"
            :class="{ 'bg-blue-600': $route.name === 'Calendario' }"
          >
            <div class="w-2 h-2 bg-green-400 rounded-full"></div>
            Calendário
          </router-link>
        </li>
        
        <li>
          <router-link 
            to="/manutencoes" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700"
            :class="{ 'bg-blue-600': $route.name === 'Manutencoes' }"
          >
            <div class="w-2 h-2 bg-yellow-400 rounded-full"></div>
            Manutenções
          </router-link>
        </li>
        
        <li>
          <router-link 
            to="/maquinas" 
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors hover:bg-slate-700"
            :class="{ 'bg-blue-600': $route.name === 'Maquinas' }"
          >
            <div class="w-2 h-2 bg-purple-400 rounded-full"></div>
            Máquinas
          </router-link>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script>
export default {
  name: 'Sidebar'
}
</script>