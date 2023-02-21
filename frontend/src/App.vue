<script setup lang="ts">
import { onMounted } from 'vue';
import { RouterView, useRouter } from 'vue-router'
import { useUserStore } from './stores/user';
import apiClient from './utils/axiosClient';

const userStore = useUserStore()
const router = useRouter()

onMounted(async () => {
  await apiClient('auth/refresh-signin')
    .then(res => {
      userStore.user = res.data
      router.push('/characters')
    })
    .catch((err) => console.error(err))
})
</script>

<template>
  <RouterView />
</template>

<style></style>
