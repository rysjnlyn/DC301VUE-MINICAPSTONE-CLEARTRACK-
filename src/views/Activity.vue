<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <span class="eyebrow">YOUR TIMELINE</span>
        <h1>Recent activity</h1>
        <p class="page-intro">
          A record of clearance submissions and status updates in this browser.
        </p>
      </div>
      <button class="btn btn-light" @click="exportCsv">Export CSV ↓</button>
    </div>

    <div class="panel activity-panel">
      <div v-for="item in store.activities" :key="item.id" class="activity-row">
        <span class="activity-dot">✓</span>
        <div class="row-main">
          <strong>{{ item.action }}</strong>
          <p>{{ item.detail }}</p>
        </div>
        <time>{{ item.date }}</time>
      </div>
      <div v-if="!store.activities.length" class="empty-state">
        <h3>No activity yet</h3>
        <p>Clearance updates and submissions will appear here.</p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { useClearanceStore } from '../stores/clearance'

const store = useClearanceStore()

function exportCsv() {
  const rows = [
    ['Action', 'Details', 'Date'],
    ...store.activities.map((activity) => [activity.action, activity.detail, activity.date]),
  ]
  const csv = rows
    .map((row) => row
      .map((value) => `"${String(value ?? '').replaceAll('"', '""')}"`)
      .join(','))
    .join('\n')
  const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
  const link = document.createElement('a')

  link.href = url
  link.download = 'cleartrack-activity.csv'
  link.click()
  URL.revokeObjectURL(url)
}
</script>
