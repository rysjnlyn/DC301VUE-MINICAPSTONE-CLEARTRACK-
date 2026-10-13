<template>
  <span class="status-badge" :class="statusClass">{{ label }}</span>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: String, required: true },
})

const labels = {
  approved: 'Approved',
  pending: 'Pending review',
  'needs-action': 'Needs action',
  rejected: 'Returned',
}

const statusClass = computed(() => props.status)
const label = computed(() => labels[props.status] || props.status)
</script>
