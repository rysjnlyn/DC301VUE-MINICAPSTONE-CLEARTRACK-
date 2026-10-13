<template>
  <section class="page-section">
    <div class="page-heading">
      <div>
        <span class="eyebrow">{{ eyebrow }}</span>
        <h1>{{ title }}</h1>
        <p class="page-intro">{{ description }}</p>
      </div>
      <slot name="action" />
    </div>
    <slot />
  </section>
</template>

<script setup>
defineProps({
  title: String,
  eyebrow: { type: String, default: 'CLEARTRACK PORTAL' },
  description: String,
})
</script>
