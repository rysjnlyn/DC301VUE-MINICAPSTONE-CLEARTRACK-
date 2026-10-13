<template>
  <div class="admin-shell">
    <aside class="admin-sidebar" :class="{ open }">
      <div class="admin-topbar">
        <RouterLink class="admin-brand" to="/admin">
          <span class="brand-mark">CT</span>
          <span>ClearTrack Admin</span>
        </RouterLink>
        <button
          class="menu-toggle admin-toggle"
          aria-label="Toggle admin navigation"
          @click="open = !open"
        >
          &#9776;
        </button>
      </div>

      <nav aria-label="Admin navigation">
        <RouterLink to="/admin">Overview</RouterLink>
        <RouterLink to="/admin/requests">Clearance requests</RouterLink>
        <RouterLink to="/admin/departments">Departments</RouterLink>
        <RouterLink to="/admin/students">Students</RouterLink>
      </nav>

      <RouterLink class="back-link" to="/" aria-label="Open the student portal">
        Student portal
      </RouterLink>
    </aside>

    <main class="admin-main">
      <RouterView />
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()
const open = ref(false)

watch(() => route.fullPath, () => {
  open.value = false
})
</script>
