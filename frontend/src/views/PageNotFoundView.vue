<script lang="ts" setup>
import { useRouter } from 'vue-router';

const router = useRouter()

function goHome() {
  router.push('/')
}
</script>

<template>
  <div style="height: 100vh; width: 100vw;" class="d-flex flex-column justify-center align-center">
    <h1 class="mb-2">Page not found.</h1>
    <v-btn color="blue" @click.prevent="goHome">Return to home</v-btn>
  </div>
</template>

<style></style>
