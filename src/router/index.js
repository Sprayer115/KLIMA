import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

const routes = [
  {
    path: '/',
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: '',
        name: 'Home',
        component: () => import('@/views/Home.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'settings',
        name: 'Settings',
        component: () => import('@/views/Admin.vue'),
        meta: { requiresAuth: true, requiresAdmin: true }
      },
      {
        path: 'change-password',
        name: 'change-password',
        component: () => import('@/views/ChangePassword.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'goals',
        name: 'Goals',
        component: () => import('@/views/Goals.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'general-input',
        name: 'GeneralInput',
        component: () => import('@/views/input/GeneralInput.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'fallpauschalen',
        name: 'Fallpauschalen',
        component: () => import('@/views/input/Fallpauschalen.vue'),
        meta: { requiresAuth: true}
      },
      {
        path: 'leistungsangebot',
        name: 'Leistungsangebot',
        component: () => import('@/views/input/Leistungsangebot.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'personal-und-abteilungen',
        name: 'PersonalUndAbteilungen',
        component: () => import('@/views/input/PersonalUndAbteilungen.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'forschung-investition-und-zgb',
        name: 'ForschungInvestitionUndZGB',
        component: () => import('@/views/input/ForschungInvestitionUndZGB.vue'),
        meta: { requiresAuth: true }
      },
      {
        path: 'verweildauer-und-zentralbereiche',
        name: 'VerweildauerUndZentralbereiche',
        component: () => import('@/views/input/VerweildauerUndZentralbereiche.vue'),
        meta: { requiresAuth: true }
      }
    ]
  },
  {
    path: '/login',
    component: () => import('@/components/Layout.vue'),
    children: [
      {
        path: '',
        component: () => import('@/views/Login.vue')
      },
      {
        path: 'register',
        component: () => import('@/views/Register.vue')
      }
    ],
    meta: { requiresGuest: true }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

router.beforeEach((to, from, next) => {
  const auth = useAuthStore()
  const isAuthenticated = !!auth.token
  const isAdmin = auth.user?.role === 'admin'

  // Handle routes that require guest access (like login)
  if (to.meta.requiresGuest && isAuthenticated) {
    return next('/')
  }

  // Handle routes that require authentication
  if (to.meta.requiresAuth && !isAuthenticated) {
    return next('/login')
  }

  // Handle routes that require admin role
  if (to.meta.requiresAdmin && !isAdmin) {
    return next('/')
  }

  // Proceed with navigation
  next()
})

export default router
