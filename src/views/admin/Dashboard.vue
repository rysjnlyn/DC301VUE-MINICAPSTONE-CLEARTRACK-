<template>
  <section class="admin-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">ADMINISTRATION</span>
        <h1>Portal overview</h1>
        <p class="page-intro">Monitor student clearance activity and manage office reviews.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/admin/requests">Review requests →</RouterLink>
    </div>

    <div class="stats-grid">
      <article class="stat-card">
        <span class="stat-label">Registered accounts</span>
        <strong>{{ auth.accounts.filter((account) => account.role === 'student').length }}</strong>
        <small>Student accounts in this browser</small>
      </article>
      <article class="stat-card">
        <span class="stat-label">Departments</span>
        <strong>{{ store.allDepartments.length }}</strong>
        <small>Clearance checkpoints</small>
      </article>
      <article class="stat-card">
        <span class="stat-label">Awaiting review</span>
        <strong>{{ pendingSubmissions + store.pending }}</strong>
        <small>Sample and submitted requests</small>
      </article>
      <article class="stat-card">
        <span class="stat-label">Approved checkpoints</span>
        <strong>{{ store.approved }}</strong>
        <small>In sample student record</small>
      </article>
    </div>

    <section class="panel">
      <div class="panel-heading">
        <div>
          <span class="eyebrow">RECENT SUBMISSIONS</span>
          <h2>Latest requests</h2>
        </div>
        <RouterLink class="text-link" to="/admin/requests">Manage all →</RouterLink>
      </div>
      <div v-for="submission in store.submissions.slice(0, 5)" :key="submission.id" class="activity-row">
        <span class="activity-dot">↗</span>
        <div class="row-main">
          <strong>{{ department(submission.departmentId)?.name }}</strong>
          <p>{{ submission.details || submission.fileName }}</p>
        </div>
        <StatusBadge :status="submission.status" />
      </div>
      <p v-if="!store.submissions.length" class="empty-copy">
        No student submissions have been recorded yet.
      </p>
    </section>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from '../../components/StatusBadge.vue'
import { useAuthStore } from '../../stores/auth'
import { useClearanceStore } from '../../stores/clearance'

const auth = useAuthStore()
const store = useClearanceStore()
const pendingSubmissions = computed(() => (
  store.submissions.filter((submission) => submission.status === 'pending').length
))

function department(id) {
  return store.allDepartments.find((item) => item.id === id)
}
</script>
