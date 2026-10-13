<template>
  <section class="admin-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">REVIEW WORKSPACE</span>
        <h1>Clearance requests</h1>
        <p class="page-intro">Review submissions and update department status. Changes are saved locally.</p>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="search" placeholder="Search student or department">
      <select v-model="filter">
        <option value="all">All statuses</option>
        <option value="pending">Pending</option>
        <option value="approved">Approved</option>
        <option value="rejected">Returned</option>
      </select>
    </div>

    <div class="panel table-panel">
      <table>
        <thead>
          <tr>
            <th>Department</th>
            <th>Submission</th>
            <th>Status</th>
            <th>Review action</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="submission in filtered" :key="submission.id">
            <td>
              <strong>{{ department(submission.departmentId)?.name }}</strong>
              <small>{{ submission.date }}</small>
            </td>
            <td>
              {{ submission.details || submission.fileName || 'No note provided' }}
              <small v-if="submission.fileName">File name: {{ submission.fileName }}</small>
            </td>
            <td><StatusBadge :status="submission.status" /></td>
            <td>
              <div class="table-actions">
                <button class="btn btn-small btn-primary" @click="review(submission, 'approved')">
                  Approve
                </button>
                <button class="btn btn-small btn-light" @click="review(submission, 'rejected')">
                  Return
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
      <div v-if="!filtered.length" class="empty-state">
        <h3>No requests found</h3>
        <p>Student submissions will appear here when created in the demo.</p>
      </div>
    </div>

    <h2 class="subsection-title">Department status overview</h2>
    <div class="panel">
      <div v-for="record in store.records" :key="record.departmentId" class="clearance-row">
        <div class="row-main">
          <strong>{{ department(record.departmentId)?.name }}</strong>
          <small>{{ record.note || 'No reviewer note' }}</small>
        </div>
        <StatusBadge :status="record.status" />
        <select
          :value="record.status"
          @change="store.setStatus(record.departmentId, $event.target.value, 'Updated by administrator')"
        >
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="needs-action">Needs action</option>
          <option value="rejected">Returned</option>
        </select>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusBadge from '../../components/StatusBadge.vue'
import { useClearanceStore } from '../../stores/clearance'

const store = useClearanceStore()
const search = ref('')
const filter = ref('all')

const filtered = computed(() => store.submissions.filter((submission) => {
  const name = department(submission.departmentId)?.name.toLowerCase() || ''
  const query = search.value.toLowerCase()
  const matchesSearch = name.includes(query)
    || (submission.details || '').toLowerCase().includes(query)
    || (submission.fileName || '').toLowerCase().includes(query)

  return matchesSearch && (filter.value === 'all' || submission.status === filter.value)
}))

function department(id) {
  return store.allDepartments.find((item) => item.id === id)
}

function review(submission, status) {
  submission.status = status
  store.setStatus(
    submission.departmentId,
    status,
    status === 'approved'
      ? 'Submission approved'
      : 'Please review the requirement and submit again',
  )
  store.log(
    status === 'approved' ? 'Submission approved' : 'Submission returned',
    department(submission.departmentId)?.name || 'Department',
  )
}
</script>
