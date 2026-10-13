<template>
  <header class="navbar">
    <RouterLink class="brand" to="/">
      <span class="brand-mark">CT</span>
      <span>Clear<span>Track</span></span>
    </RouterLink>

    <button
      class="menu-toggle"
      aria-label="Toggle navigation"
      @click="open = !open"
    >
      ☰
    </button>

    <nav class="nav-links" :class="{ show: open }">
      <RouterLink to="/">Dashboard</RouterLink>
      <RouterLink to="/clearance">My clearance</RouterLink>
      <RouterLink to="/departments">Departments</RouterLink>
      <RouterLink to="/activity">Activity</RouterLink>
    </nav>

    <div class="nav-actions">
      <RouterLink
        v-if="!auth.isAuthenticated"
        class="btn btn-primary nav-login"
        to="/login"
      >
        Sign in
      </RouterLink>
      <div v-else class="user-menu">
        <RouterLink
          class="user-profile"
          to="/profile"
          :aria-label="`${auth.user?.name || 'Student'} profile`"
        >
          <span class="profile-dot" aria-hidden="true">{{ initials }}</span>
          <span class="user-profile-meta">
            <strong>{{ auth.user?.name || 'Student' }}</strong>
            <small>{{ auth.isAdmin ? 'Administrator profile' : 'Student profile' }}</small>
          </span>
        </RouterLink>
        <button class="text-button" @click="logout">Sign out</button>
      </div>
    </div>
  </header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const open = ref(false)

const initials = computed(() => (
  auth.user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'ST'
))

function logout() {
  auth.logout()
  router.push('/login')
}
</script>
