<template>
  <main class="auth-page">
    <RouterLink class="brand auth-brand" to="/">
      <span class="brand-mark">CT</span>
      <span>Clear<span>Track</span></span>
    </RouterLink>

    <section class="auth-card">
      <span class="eyebrow">WELCOME BACK</span>
      <h1>Sign in to ClearTrack</h1>
      <p>Access your clearance progress and department updates.</p>

      <form @submit.prevent="submit">
        <label>
          Email address
          <input
            v-model="email"
            type="email"
            autocomplete="username"
            placeholder="you@school.edu"
            required
          >
        </label>
        <label>
          Password
          <input
            v-model="password"
            type="password"
            autocomplete="current-password"
            placeholder="Enter your password"
            required
          >
        </label>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button class="btn btn-primary full-width" type="submit">Sign in →</button>
      </form>

      <div class="demo-credentials">
        <strong>Demo student account</strong>
        <span>student@cleartrack.edu</span>
        <span>Password: student123</span>
        <strong>Demo administrator</strong>
        <span>admin@cleartrack.edu</span>
        <span>Password: admin123</span>
      </div>

      <p class="auth-switch">
        New to ClearTrack? <RouterLink to="/register">Create an account</RouterLink>
      </p>
    </section>

    <small class="auth-foot">ClearTrack · Student Services Portal</small>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const route = useRoute()
const email = ref('student@cleartrack.edu')
const password = ref('student123')
const error = ref('')

function submit() {
  try {
    auth.login(email.value, password.value)
    router.push(String(route.query.redirect || (auth.isAdmin ? '/admin' : '/')))
  } catch (submitError) {
    error.value = submitError.message
  }
}
</script>
