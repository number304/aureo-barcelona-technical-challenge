<script lang="ts" setup>
import apiClient from "@/utils/axiosClient";
import { ref, computed } from "vue"
import { useUserStore } from '@/stores/user'

const nickname = ref("")
const password = ref("")
const emits = defineEmits(['to-register'])

// UI
const showPassword = ref(false)
const userStore = useUserStore()
const disableLogin = computed(() => nickname.value.length < 3 || password.value.length < 7)

function login() {
    apiClient.post('auth/login', { nickname: nickname.value, password: password.value })
        .then(res => userStore.setUser(res.data))
}

function toRegister() { emits('to-register') }

function switchShowPassword() { showPassword.value = !showPassword.value }
</script>

<template>
    <div class="custom-body-container d-flex justify-center align-center rounded-lg">
        <v-card class="pa-4 text-center">
            <v-text-field
                class="custom-form-input"
                label="Nickname"
                prepend-inner-icon="mdi-account"
                variant="outlined"
                v-model="nickname"
            >
            </v-text-field>
            <v-text-field
                class="custom-form-input"
                prepend-inner-icon="mdi-lock"
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                label="Password"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                v-model="password"
                @click:append-inner="switchShowPassword"
            >
            </v-text-field>

            <v-btn color="primary" :disabled="disableLogin" @click.prevent="login">Login</v-btn>
            <p class="mt-4">
              Not registered yet? <span class="emit-link" @click.prevent="toRegister">Join now!</span>
            </p>
        </v-card>
    </div>
</template>

<style scoped>
.custom-body-container {
    height: 100vh;
}
.custom-form-input {
    min-width: 300px;
}
</style>
