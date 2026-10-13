import { computed } from 'vue'
import { defineStore } from 'pinia'
import { departments, initialRecords } from '../data/clearance'
import { useLocalStorage } from '../composables/useLocalStorage'

const initialActivities = [
  {
    id: 1,
    action: 'ClearTrack account created',
    detail: 'Your student clearance workspace is ready.',
    date: 'Oct 13, 2026',
  },
]

export const useClearanceStore = defineStore('clearance', () => {
  const records = useLocalStorage('cleartrack_records', initialRecords)
  const activities = useLocalStorage('cleartrack_activities', initialActivities)
  const submissions = useLocalStorage('cleartrack_submissions', [])
  const allDepartments = useLocalStorage('cleartrack_departments', departments)

  const approved = computed(() => records.value.filter((record) => record.status === 'approved').length)
  const progress = computed(() => Math.round(approved.value / Math.max(records.value.length, 1) * 100))
  const pending = computed(() => records.value.filter((record) => record.status === 'pending').length)

  function log(action, detail) {
    activities.value.unshift({
      id: Date.now(),
      action,
      detail,
      date: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
    })
    activities.value = activities.value.slice(0, 100)
  }

  function submitRequirement(id, details, fileName = '') {
    const departmentId = Number(id)
    const record = records.value.find((item) => item.departmentId === departmentId)

    if (!record) throw new Error('Department not found.')
    if (!details.trim() && !fileName) {
      throw new Error('Add a note or choose a file name before submitting.')
    }

    submissions.value.unshift({
      id: Date.now(),
      departmentId,
      details: details.trim(),
      fileName,
      status: 'pending',
      date: new Date().toLocaleDateString(),
    })
    record.status = 'pending'
    record.note = 'Submitted for department review'
    record.updatedAt = new Date().toLocaleDateString()

    const departmentName = allDepartments.value.find((item) => item.id === departmentId)?.name
    log('Requirement submitted', departmentName || 'Department')
  }

  function setStatus(id, status, note = '') {
    const departmentId = Number(id)
    const record = records.value.find((item) => item.departmentId === departmentId)
    if (!record) return

    record.status = status
    record.note = note
    record.updatedAt = new Date().toLocaleDateString()

    const departmentName = allDepartments.value.find((item) => item.id === departmentId)?.name
    log('Clearance status updated', `${departmentName}: ${status}`)
  }

  function addDepartment(department) {
    const id = Math.max(0, ...allDepartments.value.map((item) => item.id)) + 1
    allDepartments.value.push({
      ...department,
      id,
      short: department.name.slice(0, 3).toUpperCase(),
      icon: '✓',
      requirements: department.requirements || ['Confirm department requirements'],
    })
    records.value.push({
      departmentId: id,
      status: 'pending',
      note: '',
      updatedAt: 'Not yet reviewed',
    })
    log('Department added', department.name)
  }

  function reset() {
    records.value = initialRecords.map((record) => ({ ...record }))
    activities.value = []
    submissions.value = []
    log('Demo data reset', 'Sample clearance records restored')
  }

  return {
    records,
    activities,
    submissions,
    allDepartments,
    approved,
    progress,
    pending,
    log,
    submitRequirement,
    setStatus,
    addDepartment,
    reset,
  }
})
