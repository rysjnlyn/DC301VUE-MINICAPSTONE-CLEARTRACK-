<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <span class="eyebrow">STUDENT WORKSPACE</span>
        <h1>My clearance</h1>
        <p class="page-intro">
          Follow each department's review and submit outstanding requirements.
        </p>
      </div>
      <div class="overall-pill">
        <strong>{{ store.progress }}%</strong>
        <span>overall complete</span>
      </div>
    </div>

    <div class="progress-summary">
      <div>
        <strong>{{ store.approved }} / {{ store.records.length }}</strong>
        <span>departments approved</span>
      </div>
      <div class="progress-track">
        <span :style="{ width: `${store.progress}%` }"></span>
      </div>
    </div>

    <div class="toolbar">
      <input
        v-model="search"
        placeholder="Search departments…"
        aria-label="Search departments"
      >
      <select v-model="filter" aria-label="Filter status">
        <option value="all">All statuses</option>
        <option value="approved">Approved</option>
        <option value="pending">Pending review</option>
        <option value="needs-action">Needs action</option>
        <option value="rejected">Returned</option>
      </select>
    </div>

    <div class="clearance-list">
      <article
        v-for="record in filtered"
        :key="record.departmentId"
        class="clearance-card"
      >
        <div class="clearance-card-top">
          <span class="department-icon large">{{ department(record.departmentId)?.icon }}</span>
          <div class="row-main">
            <h3>{{ department(record.departmentId)?.name }}</h3>
            <p>{{ department(record.departmentId)?.description }}</p>
          </div>
          <StatusBadge :status="record.status" />
        </div>

        <div class="requirement-chips">
          <span
            v-for="requirement in department(record.departmentId)?.requirements"
            :key="requirement"
          >
            {{ requirement }}
          </span>
        </div>

        <div v-if="record.note" class="review-note">
          <strong>Office note:</strong> {{ record.note }}
        </div>

        <div class="card-footer">
          <small>Last updated: {{ record.updatedAt }}</small>
          <button class="btn btn-light" @click="openSubmit(record)">
            Submit requirement
          </button>
        </div>

        <form
          v-if="activeId === record.departmentId"
          class="submission-form"
          @submit.prevent="submit(record)"
        >
          <label>
            Submission note
            <textarea
              v-model="details"
              rows="2"
              placeholder="Describe what you completed or submitted…"
            ></textarea>
          </label>
          <label>
            File name (optional)
            <input v-model="fileName" placeholder="e.g. library-clearance.pdf">
          </label>
          <p class="form-help">
            Demo mode records a file name only; it does not upload the actual document.
          </p>
          <div class="form-actions">
            <button type="button" class="btn btn-light" @click="activeId = null">
              Cancel
            </button>
            <button class="btn btn-primary" type="submit">Send for review</button>
          </div>
        </form>
      </article>

      <div v-if="!filtered.length" class="empty-state">
        <span>⌕</span>
        <h3>No matching departments</h3>
        <p>Try another search or status filter.</p>
      </div>
    </div>

    <p v-if="message" class="inline-message" role="status">{{ message }}</p>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useClearanceStore } from '../stores/clearance'

const store = useClearanceStore()
const search = ref('')
const filter = ref('all')
const activeId = ref(null)
const details = ref('')
const fileName = ref('')
const message = ref('')

const filtered = computed(() => store.records.filter((record) => {
  const name = department(record.departmentId)?.name.toLowerCase() || ''
  return name.includes(search.value.toLowerCase())
    && (filter.value === 'all' || record.status === filter.value)
}))

function department(id) {
  return store.allDepartments.find((item) => item.id === id)
}

function openSubmit(record) {
  activeId.value = activeId.value === record.departmentId ? null : record.departmentId
  details.value = ''
  fileName.value = ''
  message.value = ''
}

function submit(record) {
  try {
    store.submitRequirement(record.departmentId, details.value, fileName.value)
    message.value = 'Your submission was recorded and marked pending review.'
    activeId.value = null
  } catch (error) {
    message.value = error.message
  }
}
</script>
