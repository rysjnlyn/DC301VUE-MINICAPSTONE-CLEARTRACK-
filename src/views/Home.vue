<template>
  <section class="dashboard-wrap">
    <div v-if="auth.isAdmin" class="admin-portal-notice">
      <div>
        <strong>Student portal preview</strong>
        <p>You are viewing the student experience with the current demo clearance data.</p>
      </div>
      <RouterLink class="btn btn-light" to="/admin">Return to admin</RouterLink>
    </div>

    <div class="welcome-banner">
      <div>
        <span class="eyebrow">STUDENT CLEARANCE PORTAL</span>
        <h1>Your path to <em>clearance</em>, made simple.</h1>
        <p>
          Track approvals from every campus office in one place. See what is complete,
          what is under review, and what needs your attention.
        </p>
        <div class="hero-actions">
          <RouterLink class="btn btn-primary" to="/clearance">View my clearance →</RouterLink>
          <RouterLink class="text-link" to="/departments">Explore departments</RouterLink>
        </div>
      </div>

      <div class="welcome-art">
        <div class="art-circle">✓</div>
        <div class="floating-note">
          <span>YOUR CLEARANCE STATUS</span>
          <strong>{{ auth.isAuthenticated ? `${progress}% complete` : 'One step at a time' }}</strong>
          <small>
            {{ auth.isAuthenticated
              ? `${approved} of ${records.length} departments approved`
              : 'Sign in to track your progress' }}
          </small>
        </div>
      </div>
    </div>

    <div v-if="!auth.isAuthenticated" class="notice-card">
      <div>
        <strong>Welcome to ClearTrack</strong>
        <p>Sign in with your student account to view personalized clearance progress.</p>
      </div>
      <RouterLink class="btn btn-primary" to="/login">Sign in to continue</RouterLink>
    </div>

    <template v-else>
      <div class="stats-grid">
        <article class="stat-card">
          <span class="stat-icon green">✓</span>
          <span class="stat-label">Approved</span>
          <strong>{{ approved }}</strong>
          <small>Departments cleared</small>
        </article>
        <article class="stat-card">
          <span class="stat-icon amber">◷</span>
          <span class="stat-label">In review</span>
          <strong>{{ pending }}</strong>
          <small>Awaiting office review</small>
        </article>
        <article class="stat-card">
          <span class="stat-icon red">!</span>
          <span class="stat-label">Needs attention</span>
          <strong>{{ needsAction }}</strong>
          <small>Action required from you</small>
        </article>
        <article class="stat-card">
          <span class="stat-icon blue">◉</span>
          <span class="stat-label">Overall progress</span>
          <strong>{{ progress }}%</strong>
          <div class="progress-track">
            <span :style="{ width: `${progress}%` }"></span>
          </div>
        </article>
      </div>

      <div class="content-grid">
        <section class="panel">
          <div class="panel-heading">
            <div>
              <span class="eyebrow">YOUR CHECKLIST</span>
              <h2>Clearance progress</h2>
            </div>
            <RouterLink class="text-link" to="/clearance">View all →</RouterLink>
          </div>
          <div
            v-for="record in records.slice(0, 5)"
            :key="record.departmentId"
            class="clearance-row"
          >
            <span class="department-icon">{{ department(record.departmentId)?.icon }}</span>
            <div class="row-main">
              <strong>{{ department(record.departmentId)?.name }}</strong>
              <small>{{ record.note || department(record.departmentId)?.description }}</small>
            </div>
            <StatusBadge :status="record.status" />
          </div>
        </section>

        <section class="panel">
          <div class="panel-heading">
            <div>
              <span class="eyebrow">NEXT STEPS</span>
              <h2>Keep moving forward</h2>
            </div>
          </div>
          <div class="step-card">
            <span class="step-number">01</span>
            <div>
              <strong>Review requirements</strong>
              <p>Check each office for outstanding requirements.</p>
              <RouterLink to="/clearance">Open checklist →</RouterLink>
            </div>
          </div>
          <div class="step-card">
            <span class="step-number">02</span>
            <div>
              <strong>Submit for review</strong>
              <p>Add a note or select a file name to record a submission.</p>
              <RouterLink to="/clearance">Submit requirement →</RouterLink>
            </div>
          </div>
          <div class="step-card">
            <span class="step-number">03</span>
            <div>
              <strong>Watch for updates</strong>
              <p>See changes to your clearance in the activity log.</p>
              <RouterLink to="/activity">View activity →</RouterLink>
            </div>
          </div>
        </section>
      </div>
    </template>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useAuthStore } from '../stores/auth'
import { useClearanceStore } from '../stores/clearance'

const auth = useAuthStore()
const store = useClearanceStore()
const records = computed(() => store.records)
const approved = computed(() => store.approved)
const pending = computed(() => store.pending)
const progress = computed(() => store.progress)
const needsAction = computed(() => records.value.filter((record) => (
  record.status === 'needs-action' || record.status === 'rejected'
)).length)

function department(id) {
  return store.allDepartments.find((item) => item.id === id)
}
</script>
