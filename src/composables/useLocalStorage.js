import { ref, watch } from 'vue'

export function useLocalStorage(key, initialValue) {
  let value = initialValue

  try {
    const savedValue = localStorage.getItem(key)
    if (savedValue !== null) value = JSON.parse(savedValue)
  } catch {
    // Keep the initial value when storage is unavailable or contains invalid JSON.
  }

  const state = ref(value)

  watch(state, (nextValue) => {
    try {
      localStorage.setItem(key, JSON.stringify(nextValue))
    } catch {
      // Ignore storage write errors so app state remains usable for this session.
    }
  }, { deep: true })

  return state
}
