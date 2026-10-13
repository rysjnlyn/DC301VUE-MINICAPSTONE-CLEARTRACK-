import { computed } from 'vue'
import { defineStore } from 'pinia'
import { useLocalStorage } from '../composables/useLocalStorage'

const demoAccounts = [
  {
    id: '2026001',
    name: 'Alex Student',
    email: 'student@cleartrack.edu',
    password: 'student123',
    role: 'student',
    course: 'BS Information Technology',
    year: '3rd Year',
  },
  {
    id: 'ADMIN01',
    name: 'ClearTrack Administrator',
    email: 'admin@cleartrack.edu',
    password: 'admin123',
    role: 'admin',
    course: '',
    year: '',
  },
]

function withoutPassword(account) {
  const { password, ...safeAccount } = account
  return safeAccount
}

export const useAuthStore = defineStore('auth', () => {
  const user = useLocalStorage('cleartrack_user', null)
  const accounts = useLocalStorage('cleartrack_accounts', demoAccounts)
  const isAuthenticated = computed(() => Boolean(user.value))
  const isAdmin = computed(() => user.value?.role === 'admin')

  function login(email, password) {
    const account = accounts.value.find((item) => (
      item.email.toLowerCase() === String(email).trim().toLowerCase()
      && item.password === password
    ))

    if (!account) {
      throw new Error('Incorrect email or password. Try the demo account shown below.')
    }

    user.value = withoutPassword(account)
    return user.value
  }

  function register(name, email, password, id) {
    if (!name.trim() || !email.trim() || !password || !id.trim()) {
      throw new Error('Please complete all required fields.')
    }
    if (password.length < 6) {
      throw new Error('Password must be at least 6 characters.')
    }
    if (accounts.value.some((account) => (
      account.email.toLowerCase() === email.toLowerCase() || account.id === id
    ))) {
      throw new Error('Email or student ID is already registered.')
    }

    const account = {
      id: id.trim(),
      name: name.trim(),
      email: email.trim(),
      password,
      role: 'student',
      course: 'Not set',
      year: 'Not set',
    }

    accounts.value.push(account)
    user.value = withoutPassword(account)
    return user.value
  }

  function updateProfile(fields) {
    if (!user.value) return

    user.value = { ...user.value, ...fields }
    const accountIndex = accounts.value.findIndex((account) => account.id === user.value.id)

    if (accountIndex >= 0) {
      accounts.value[accountIndex] = { ...accounts.value[accountIndex], ...fields }
    }
  }

  function logout() {
    user.value = null
  }

  return {
    user,
    accounts,
    isAuthenticated,
    isAdmin,
    login,
    register,
    updateProfile,
    logout,
  }
})
