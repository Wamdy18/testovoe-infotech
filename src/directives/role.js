import { useAuthStore } from '@/stores/auth'

export const roleDirective = {
  mounted(el, binding) {
    const auth = useAuthStore()
    const allowed = Array.isArray(binding.value)
      ? binding.value
      : [binding.value]

    if (!allowed.includes(auth.role)) {
      el.parentNode?.removeChild(el)
    }
  },
}
