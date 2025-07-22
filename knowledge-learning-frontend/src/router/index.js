// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import Home from '../pages/Home.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Dashboard from '../pages/Dashboard.vue'
import Themes from '../pages/Themes.vue'
import CursusList from '../pages/CursusList.vue'
import Certifications from '../pages/Certifications.vue'
import Admin from '../pages/Admin.vue'
import Purchase from '../pages/Purchase.vue'
import LessonList from '../pages/LessonList.vue'


const routes = [
  { path: '/', name: 'Home', component: Home },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard },
  { path: '/themes', name: 'Themes', component: Themes },
  { path: '/themes/:id/cursus', name: 'CursusList', component: CursusList },
  { path: '/certifications', name: 'Certifications', component: Certifications },
  { path: '/admin', name: 'Admin', component: Admin },
  { path: '/purchases', name: 'Purchase', component: Purchase },
  { path: '/cursus/:id/lessons', name: 'LessonList', component: LessonList },
  { path: '/auth/verify/:token', component: () => import('../pages/verify.vue') },
  { path: '/purchases-success', name: 'PurchaseSuccess', component: () => import('@/pages/PurchaseSuccess.vue')}

]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

export default router
