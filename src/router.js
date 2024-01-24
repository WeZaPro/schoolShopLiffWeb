import { createRouter, createWebHistory } from 'vue-router'
import Home from '@/views/Home.vue'
import Liff from '@/views/LiffWeb.vue'

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      component: Home,
    },
    {
      path: '/about',
      component: () => import('@/views/About.vue'),
    },
    {
      path: '/contact',
      component: () => import('@/views/Contact.vue'),
    },
    {
      path: '/liffweb',
      component: Liff,
    },
  ],
})
