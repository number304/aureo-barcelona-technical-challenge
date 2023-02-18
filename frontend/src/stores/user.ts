import { ref } from 'vue'
import { defineStore } from 'pinia'
import type User from '@/utils/types/user'

export const useUserStore = defineStore('user', () => {
  const user = ref<User | null>(null)

  function setUser(data: User) {
    user.value = data
  }

  function clearUser() {
    user.value = null
  }

  return { user, setUser, clearUser }
})