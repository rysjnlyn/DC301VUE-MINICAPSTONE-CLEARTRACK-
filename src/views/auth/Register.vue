<template>
  <main class="auth-page">
    <RouterLink class="brand auth-brand" to="/">
      <span class="brand-mark">CT</span>
      <span>Clear<span>Track</span></span>
    </RouterLink>

    <section class="auth-card">
      <span class="eyebrow">GET STARTED</span>
      <h1>Create your account</h1>
      <p>Register with your student details to track clearance progress.</p>

      <form @submit.prevent="submit">
        <label>
          Full name
          <input v-model="name" autocomplete="name" required placeholder="Your full name">
        </label>
        <label>
          Student ID
          <input v-model="id" required placeholder="e.g. 2026002">
        </label>
        <label>
          Email address
          <input v-model="email" type="email" autocomplete="email" required placeholder="you@school.edu">
        </label>
        <label>
          Password
          <input
            v-model="password"
            type="password"
            minlength="6"
            required
            placeholder="At least 6 characters"
          >
        </label>
        <p v-if="error" class="error-message">{{ error }}</p>
        <button class="btn btn-primary full-width" type="submit">Create account →</button>
      </form>

      <p class="auth-switch">
        Already registered? <RouterLink to="/login">Sign in</RouterLink>
      </p>
    </section>
  </main>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const router = useRouter()
const name = ref('')
const id = ref('')
const email = ref('')
const password = ref('')
const error = ref('')

function submit() {
  try {
    auth.register(name.value, email.value, password.value, id.value)
    router.push('/')
  } catch (submitError) {
    error.value = submitError.message
  }
}
</script>
