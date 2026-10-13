<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <span class="eyebrow">CAMPUS DIRECTORY</span>
        <h1>Departments</h1>
        <p class="page-intro">
          Know where to go and what to prepare before requesting clearance.
        </p>
      </div>
    </div>

    <div class="toolbar">
      <input v-model="search" placeholder="Search departments…">
      <span class="result-count">{{ filtered.length }} offices</span>
    </div>

    <div class="department-grid">
      <article v-for="department in filtered" :key="department.id" class="department-card">
        <span class="department-icon large">{{ department.icon }}</span>
        <span class="eyebrow">{{ department.short }} OFFICE</span>
        <h2>{{ department.name }}</h2>
        <p>{{ department.description }}</p>
        <div class="requirements-block">
          <strong>Common requirements</strong>
          <ul>
            <li v-for="requirement in department.requirements" :key="requirement">
              {{ requirement }}
            </li>
          </ul>
        </div>
        <div class="department-card-footer">
          <span>Contact: {{ department.office }}</span>
          <RouterLink to="/clearance">View status →</RouterLink>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useClearanceStore } from '../stores/clearance'

const store = useClearanceStore()
const search = ref('')

const filtered = computed(() => {
  const query = search.value.toLowerCase()
  return store.allDepartments.filter((department) => (
    department.name.toLowerCase().includes(query)
    || department.description.toLowerCase().includes(query)
  ))
})
</script>
