<template>
  <div id="app" class="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
    <!-- Top Bar -->
    <header class="sticky top-0 z-50 bg-white shadow-sm">
      <div class="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <div class="flex items-center space-x-3">
            <div class="flex items-center justify-center w-10 h-10 rounded-lg bg-gradient-to-br from-blue-600 to-purple-600">
              <span class="text-lg font-bold text-white">M</span>
            </div>
            <div>
              <h1 class="text-lg font-bold text-gray-800">Manutenção+</h1>
              <p class="text-xs text-gray-500">Gestão Inteligente</p>
            </div>
          </div>

          <!-- Navigation Tabs -->
          <nav class="hidden space-x-1 md:flex">
            <router-link 
              to="/" 
              class="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              :class="$route.path === '/' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              Painel
            </router-link>
            <router-link 
              to="/calendario" 
              class="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              :class="$route.path === '/calendario' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              Calendário
            </router-link>
            <router-link 
              to="/manutencoes" 
              class="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              :class="$route.path === '/manutencoes' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              Manutenções
            </router-link>
            <router-link 
              to="/maquinas" 
              class="px-4 py-2 text-sm font-medium transition-colors rounded-lg"
              :class="$route.path === '/maquinas' ? 'bg-blue-600 text-white' : 'text-gray-600 hover:bg-gray-100'"
            >
              Equipamentos
            </router-link>
          </nav>

          <div class="flex items-center justify-center rounded-full w-9 h-9 bg-gradient-to-br from-blue-500 to-purple-500">
            <span class="text-sm font-bold text-white">A</span>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <router-view />
    </main>

    <!-- Mobile Navigation -->
    <nav class="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 shadow-lg md:hidden">
      <div class="flex justify-around py-2">
        <router-link 
          to="/" 
          class="flex flex-col items-center px-3 py-2 rounded-lg"
          :class="$route.path === '/' ? 'text-blue-600' : 'text-gray-500'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span class="mt-1 text-xs">Painel</span>
        </router-link>
        <router-link 
          to="/calendario" 
          class="flex flex-col items-center px-3 py-2 rounded-lg"
          :class="$route.path === '/calendario' ? 'text-blue-600' : 'text-gray-500'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span class="mt-1 text-xs">Agenda</span>
        </router-link>
        <router-link 
          to="/manutencoes" 
          class="flex flex-col items-center px-3 py-2 rounded-lg"
          :class="$route.path === '/manutencoes' ? 'text-blue-600' : 'text-gray-500'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <span class="mt-1 text-xs">Lista</span>
        </router-link>
        <router-link 
          to="/maquinas" 
          class="flex flex-col items-center px-3 py-2 rounded-lg"
          :class="$route.path === '/maquinas' ? 'text-blue-600' : 'text-gray-500'"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="mt-1 text-xs">Equipamentos</span>
        </router-link>
      </div>
    </nav>
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style>
body {
  font-family: 'Inter', sans-serif;
  margin: 0;
  padding: 0;
}

#app {
  padding-bottom: 80px;
}

@media (min-width: 768px) {
  #app {
    padding-bottom: 0;
  }
}
</style>