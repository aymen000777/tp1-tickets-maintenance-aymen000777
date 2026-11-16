import { createRouter, createWebHistory } from 'vue-router'
import TicketList from './components/TicketList.vue'

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: '/tickets' },
    { path: '/tickets', component: TicketList },
    { path: '/:pathMatch(.*)*', redirect: '/tickets' },
  ],
})
