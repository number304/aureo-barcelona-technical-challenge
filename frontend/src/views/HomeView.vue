<script setup lang="ts">
import { ref } from 'vue'

import RegisterForm from '@/components/RegisterForm.vue';
import LoginForm from '../components/LoginForm.vue'

const showRegister = ref(false)

function setShowRegister(val: boolean) { showRegister.value = val }
</script>

<template>
  <main>
    <RegisterForm v-if="showRegister" @to-login="setShowRegister(false)" />
    <LoginForm v-else @to-register="setShowRegister(true)" />
  </main>
</template>

<style>
.emit-link {
    text-decoration: underline;
    cursor: pointer;
}
</style>
