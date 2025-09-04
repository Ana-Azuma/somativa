<template>
  <div id="app" class="min-h-screen bg-gray-50">
    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />
      
      <!-- Main Content -->
      <div class="flex-1 ml-64">
        <Navbar />
        <main class="p-6">
          <router-view />
        </main>
      </div>
    </div>
  </div>
</template>

<script>
import Navbar from './components/Navbar.vue'
import Sidebar from './components/Sidebar.vue'

export default {
  name: 'App',
  components: {
    Navbar,
    Sidebar
  }
}
</script>

<style>
/* Estilos globais */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Inter', sans-serif;
}
</style>