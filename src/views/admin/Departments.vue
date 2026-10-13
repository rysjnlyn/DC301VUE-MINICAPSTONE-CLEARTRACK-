<template>
  <section class="admin-page">
    <div class="page-heading">
      <div>
        <span class="eyebrow">DIRECTORY MANAGEMENT</span>
        <h1>Manage departments</h1>
        <p class="page-intro">Maintain the offices students need to clear before completion.</p>
      </div>
    </div>

    <form class="panel add-department-form" @submit.prevent="add">
      <h2>Add a department</h2>
      <div class="form-grid">
        <label>
          Department name
          <input v-model="name" required placeholder="e.g. Clinic">
        </label>
        <label>
          Description
          <input v-model="description" required placeholder="What does this office verify?">
        </label>
        <label>
          Office contact
          <input v-model="office" required placeholder="Office name or contact">
        </label>
        <label>
          Requirement checklist
          <input v-model="requirements" placeholder="Separate requirements with commas">
        </label>
      </div>
      <button class="btn btn-primary" type="submit">Add department</button>
      <p v-if="message" class="inline-message">{{ message }}</p>
    </form>

    <div class="department-grid admin-dept-grid">
      <article
        v-for="department in store.allDepartments"
        :key="department.id"
        class="department-card"
      >
        <span class="department-icon">{{ department.icon }}</span>
        <span class="eyebrow">{{ department.short }}</span>
        <h2>{{ department.name }}</h2>
        <p>{{ department.description }}</p>
        <small>{{ department.office }}</small>
        <div class="requirement-chips">
          <span v-for="requirement in department.requirements" :key="requirement">
            {{ requirement }}
          </span>
        </div>
      </article>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useClearanceStore } from '../../stores/clearance'

const store = useClearanceStore()
const name = ref('')
const description = ref('')
const office = ref('')
const requirements = ref('')
const message = ref('')

function add() {
  store.addDepartment({
    name: name.value.trim(),
    description: description.value.trim(),
    office: office.value.trim(),
    requirements: requirements.value
      .split(',')
      .map((requirement) => requirement.trim())
      .filter(Boolean),
  })

  message.value = 'Department added successfully.'
  name.value = ''
  description.value = ''
  office.value = ''
  requirements.value = ''
}
</script>
