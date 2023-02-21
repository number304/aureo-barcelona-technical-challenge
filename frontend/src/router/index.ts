import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import CharactersView from '@/views/CharactersView.vue'
import PageNotFoundView from '@/views/PageNotFoundView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/characters',
      name: 'characters',
      component: CharactersView
    },
    {
      path: '/:pathMatch(.*)',
      name: 'page-not-found',
      component: PageNotFoundView
    }
  ]
})

export default router
