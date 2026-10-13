<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <span class="eyebrow">ACCOUNT SETTINGS</span>
        <h1>My profile</h1>
        <p class="page-intro">Keep your student details accurate for clearance processing.</p>
      </div>
    </div>

    <form class="panel profile-form" @submit.prevent="save">
      <div class="profile-heading">
        <span class="profile-avatar">{{ initials }}</span>
        <div>
          <h2>{{ auth.user?.name }}</h2>
          <p>
            {{ auth.user?.role === 'admin' ? 'Administrator' : 'Student account' }}
            · {{ auth.user?.id }}
          </p>
        </div>
      </div>

      <div class="form-grid">
        <label>Full name<input v-model="form.name" required></label>
        <label>Email address<input v-model="form.email" type="email" required></label>
        <label>Student ID<input :value="auth.user?.id" disabled></label>
        <label>Course / Program<input v-model="form.course"></label>
        <label>Year level<input v-model="form.year"></label>
      </div>

      <button class="btn btn-primary" type="submit">Save changes</button>
      <p v-if="message" class="inline-message">{{ message }}</p>

      <div class="settings-divider">
        <h3>Demo data</h3>
        <p>Reset the sample clearance records and activity history in this browser.</p>
        <button class="btn btn-light" type="button" @click="resetDemo">Reset demo data</button>
      </div>
    </form>
  </section>
</template>

<script setup>
import { computed, reactive, ref, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useClearanceStore } from '../stores/clearance'

const auth = useAuthStore()
const store = useClearanceStore()
const message = ref('')
const form = reactive({ name: '', email: '', course: '', year: '' })

watch(() => auth.user, (user) => {
  if (!user) return

  Object.assign(form, {
    name: user.name,
    email: user.email,
    course: user.course || '',
    year: user.year || '',
  })
}, { immediate: true })

const initials = computed(() => (
  auth.user?.name?.split(' ').map((part) => part[0]).slice(0, 2).join('') || 'ST'
))

function save() {
  auth.updateProfile({ ...form })
  message.value = 'Profile changes saved in this browser.'
}

function resetDemo() {
  if (!confirm('Reset sample clearance records and activity?')) return

  store.reset()
  message.value = 'Demo data reset.'
}
</script>
