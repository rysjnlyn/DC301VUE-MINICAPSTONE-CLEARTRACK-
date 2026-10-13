import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import AdminLayout from '../layouts/AdminLayout.vue'
import MainLayout from '../layouts/MainLayout.vue'

const routes = [
  {
    path: '/',
    component: MainLayout,
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('../views/Home.vue'),
        meta: { title: 'Dashboard' },
      },
      {
        path: 'clearance',
        name: 'clearance',
        component: () => import('../views/Clearance.vue'),
        meta: { title: 'My clearance', requiresAuth: true },
      },
      {
        path: 'departments',
        name: 'departments',
        component: () => import('../views/Departments.vue'),
        meta: { title: 'Departments' },
      },
      {
        path: 'activity',
        name: 'activity',
        component: () => import('../views/Activity.vue'),
        meta: { title: 'Activity', requiresAuth: true },
      },
      {
        path: 'profile',
        name: 'profile',
        component: () => import('../views/Profile.vue'),
        meta: { title: 'My profile', requiresAuth: true },
      },
    ],
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/auth/Login.vue'),
    meta: { guestOnly: true, title: 'Sign in' },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('../views/auth/Register.vue'),
    meta: { guestOnly: true, title: 'Create account' },
  },
  {
    path: '/admin',
    component: AdminLayout,
    meta: { requiresAuth: true, requiresAdmin: true },
    children: [
      {
        path: '',
        name: 'admin-home',
        component: () => import('../views/admin/Dashboard.vue'),
        meta: { title: 'Admin overview' },
      },
      {
        path: 'requests',
        name: 'admin-requests',
        component: () => import('../views/admin/Requests.vue'),
        meta: { title: 'Clearance requests' },
      },
      {
        path: 'departments',
        name: 'admin-departments',
        component: () => import('../views/admin/Departments.vue'),
        meta: { title: 'Manage departments' },
      },
      {
        path: 'students',
        name: 'admin-students',
        component: () => import('../views/admin/Students.vue'),
        meta: { title: 'Students' },
      },
    ],
  },
  { path: '/:pathMatch(.*)*', redirect: '/' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior: () => ({ top: 0 }),
})

router.beforeEach((to) => {
  const auth = useAuthStore()

  if (to.matched.some((route) => route.meta.requiresAuth) && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.matched.some((route) => route.meta.requiresAdmin) && !auth.isAdmin) {
    return { name: 'home' }
  }

  if (to.matched.some((route) => route.meta.guestOnly) && auth.isAuthenticated) {
    return { name: auth.isAdmin ? 'admin-home' : 'home' }
  }
})

router.afterEach((to) => {
  document.title = `${to.meta.title || 'Student Portal'} · ClearTrack`
})

export default router
