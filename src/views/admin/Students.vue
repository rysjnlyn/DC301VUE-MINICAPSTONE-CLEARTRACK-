<template>
  <section class="admin-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">STUDENT DIRECTORY</span>
        <h1>Student accounts</h1>
        <p class="page-intro">View accounts registered in this browser's ClearTrack demo.</p>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="search" placeholder="Search name, ID, or email">
    </div>

    <div class="panel table-panel">
      <table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Student ID</th>
            <th>Program</th>
            <th>Account type</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="account in filtered" :key="account.id">
            <td>
              <strong>{{ account.name }}</strong>
              <small>{{ account.email }}</small>
            </td>
            <td>{{ account.id }}</td>
            <td>{{ account.course || '—' }}</td>
            <td><span class="status-badge approved">{{ account.role }}</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useAuthStore } from '../../stores/auth'

const auth = useAuthStore()
const search = ref('')

const filtered = computed(() => auth.accounts.filter((account) => (
  account.role === 'student'
  && `${account.name} ${account.email} ${account.id}`
    .toLowerCase()
    .includes(search.value.toLowerCase())
)))
</script>
