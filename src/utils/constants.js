export const ROLES = {
  STUDENT: 'student',
  TEACHER: 'teacher',
  ACCOUNTANT: 'accountant',
  ADMIN: 'admin'
}

export const SCHOOLS = {
  SPRINGFIELD: 'springfield_high',
  RIVERSIDE: 'riverside_academy',
  MOUNTAIN_VIEW: 'mountain_view_school'
}

export const ACADEMIC_YEAR = '2024-2025'

export const FEE_COMPONENTS = [
  'Tuition Fee',
  'Laboratory Charges',
  'Library Fee',
  'Sports Fee',
  'Annual Function',
  'Development Fund'
]

export const GRADING_SYSTEM = {
  'A+': { min: 90, max: 100, color: '#16a34a' },
  'A': { min: 80, max: 89, color: '#22c55e' },
  'A-': { min: 75, max: 79, color: '#84cc16' },
  'B+': { min: 70, max: 74, color: '#eab308' },
  'B': { min: 65, max: 69, color: '#f59e0b' },
  'C': { min: 50, max: 64, color: '#f97316' },
  'D': { min: 40, max: 49, color: '#ef4444' },
  'F': { min: 0, max: 39, color: '#dc2626' }
}