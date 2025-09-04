import { createRouter, createWebHistory } from 'vue-router'
import Dashboard from '../views/Dashboard.vue'
import Calendario from '../views/Calendario.vue'
import Manutencoes from '../views/Manutencoes.vue'
import Maquinas from '../views/Maquinas.vue'

const routes = [
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard
  },
  {
    path: '/calendario',
    name: 'Calendario',
    component: Calendario
  },
  {
    path: '/manutencoes',
    name: 'Manutencoes',
    component: Manutencoes
  },
  {
    path: '/maquinas',
    name: 'Maquinas',
    component: Maquinas
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router