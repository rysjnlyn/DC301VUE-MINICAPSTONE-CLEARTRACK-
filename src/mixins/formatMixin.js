// Options API helpers retained for components using the shared mixin pattern.
export default {
  methods: {
    formatDate(value) {
      if (!value) return '—'

      const date = new Date(value)
      return Number.isNaN(date.getTime()) ? String(value) : date.toLocaleDateString()
    },

    formatStatus(value) {
      return String(value || '')
        .replaceAll('-', ' ')
        .replace(/\b\w/g, (letter) => letter.toUpperCase())
    },
  },
}
