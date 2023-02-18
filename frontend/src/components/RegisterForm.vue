<script lang="ts" setup>
import apiClient from "@/utils/axiosClient";
import { ref, computed } from "vue"
import { useUserStore } from '@/stores/user'

const nickname = ref("")
const email = ref("")
const password = ref("")
const confirmPassword = ref("")
const emits = defineEmits(['to-login'])

// UI
const showPassword = ref(false)
const userStore = useUserStore()

// Validation
const disableRegister = computed(() => !nickname.value || !email.value || password.value !== confirmPassword.value)
const registerRules = {
    required: (value: string) => !!value || 'Required.',
    nicknameCounter: (value: string) => value.length >= 3 || 'Nickname should contain at least 3 characters.',
    passwordCounter: (value: string) => value.length >= 7 || 'Password should contain at least 7 characters.',
    passwordMatch: (value: string) => value === password.value || 'Passwords must match.',
    email: (value: string) => {
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        return pattern.test(value) || 'Invalid e-mail.'
    }
}

function register() {
    apiClient.post('auth/signup', { email: email.value, nickname: nickname.value, password: password.value })
        .then(res => userStore.setUser(res.data))
}

function toLogin() { emits('to-login') }

function switchShowPassword() { showPassword.value = !showPassword.value }
</script>

<template>
    <div class="custom-body-container d-flex justify-center align-center rounded-lg">
        <v-card class="pa-4 text-center">
            <v-text-field
                class="custom-form-input mb-1"
                label="Nickname"
                prepend-inner-icon="mdi-account"
                :rules="[ registerRules.required, registerRules.nicknameCounter ]"
                variant="outlined"
                v-model="nickname"
            >
            </v-text-field>
            <v-text-field
                class="custom-form-input mb-1"
                label="Email"
                prepend-inner-icon="mdi-account"
                :rules="[ registerRules.required, registerRules.email ]"
                variant="outlined"
                v-model="email"
            >
            </v-text-field>
            <v-text-field
                :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'"
                class="custom-form-input mb-1"
                label="Password"
                prepend-inner-icon="mdi-lock"
                :rules="[ registerRules.required, registerRules.passwordCounter ]"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                v-model="password"
                @click:append-inner="switchShowPassword"
            >
            </v-text-field>
            <v-text-field
                class="custom-form-input mb-1"
                label="Confirm Password"
                prepend-inner-icon="mdi-lock"
                :rules="[ registerRules.passwordMatch ]"
                :type="showPassword ? 'text' : 'password'"
                variant="outlined"
                v-model="confirmPassword"
            >
            </v-text-field>

            <v-btn color="primary" :disabled="disableRegister" @click.prevent="register">Register</v-btn>
            <p class="mt-4">
              Already have an account? <span class="emit-link" @click.prevent="toLogin">Login Here!</span>
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
