<script lang="ts" setup>
import { ref, computed, onMounted, defineEmits } from 'vue'
import { useUserStore } from '@/stores/user';
import apiClient from '@/utils/axiosClient';

const userStore = useUserStore()
const emits = defineEmits(['on-close'])

const nickname = ref('')
const email = ref('')
const password = ref('')
const confirmPassword = ref('')

// UI
const showPassword = ref(false)
const loading = ref(false)
const nicknameUpdated = ref(false)
const passwordUpdated = ref(false)
const emailUpdated = ref(false)
const showErrorMsg = ref(false)
const errorMsg = ref('')

const sameNickname = computed(() => nickname.value === userStore.user?.nickname)
const sameEmail = computed(() => email.value === userStore.user?.email)
const passwordMatch = computed(() => password.value === confirmPassword.value)
const validEmail = computed(() => {
  const pattern =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

  return pattern.test(email.value)
})

const disablePasswordSaveBtn = computed(() => password.value.length < 7 || !passwordMatch)

// Validation Rules
const formRules = {
    nicknameCounter: (value: string) => value.length >= 3 || 'Nickname should contain at least 3 characters.',
    passwordCounter: (value: string) => value.length >= 7 || 'Password should contain at least 7 characters.',
    passwordMatch: (value: string) => value === password.value || 'Passwords must match.',
    email: (value: string) => {
        const pattern =
            /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

        return pattern.test(value) || 'Invalid e-mail.'
    }
}

onMounted(() => {
  if (!userStore.user) return
  nickname.value = userStore.user.nickname
  email.value = userStore.user.email
})

async function updateNickname() {
  loading.value = true
  await apiClient.put('/users', { nickname: nickname.value })
    .then(res => userStore.setUser(res.data))
    .then(_ => {
      loading.value = false
      nicknameUpdated.value = true
    })
    .catch(err => {
      console.error(err)
      showErrorMsg.value = true
      errorMsg.value = err.response.data.message
      loading.value = false
    })
}

async function updateEmail() {
  loading.value = true
  await apiClient.put('/users', { email: email.value })
    .then(res => userStore.setUser(res.data))
    .then(_ => {
      loading.value = false
      emailUpdated.value = true
    })
    .catch(err => {
      console.error(err)
      showErrorMsg.value = true
      errorMsg.value = err.message
      loading.value = false
    })
}

async function updatePassword() {
  loading.value = true
  await apiClient.put('/users/update-pass', { password: password.value })
    .then(res => userStore.setUser(res.data))
    .then(_ => {
      loading.value = false
      passwordUpdated.value = true

      password.value = ''
      confirmPassword.value = ''
      showPassword.value = false
    })
    .catch(err => {
      console.error(err)
      showErrorMsg.value = true
      errorMsg.value = err.message
      loading.value = false
    })
}
</script>

<template>
  <v-card min-width="400" class="mx-auto pa-4">
    <v-card-title>User Options</v-card-title>

    <div style="height: 1px; width: 100%;" class="bg-grey-darken-3 mb-3"></div>

    <v-text-field
      class="mb-2"
      variant="outlined"
      label="nickname"
      v-model="nickname"
      :rules="[formRules.nicknameCounter]"
    >
      <template #append>
        <v-btn
          :loading="loading" width="24" height="24"
          :disabled="nickname.length < 3 || sameNickname"
          variant="text" icon
          @click.prevent="updateNickname"
        >
          <v-icon icon="mdi-content-save"></v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-text-field
      :class="validEmail ? '' : 'mb-2'"
      variant="outlined"
      label="email"
      v-model="email"
      :rules="[formRules.email]"
    >
      <template #append>
        <v-btn
          :loading="loading" width="24" height="24"
          :disabled="!validEmail || sameEmail" variant="text" icon
          @click.prevent="updateEmail"
        >
          <v-icon icon="mdi-content-save"></v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <p class="text-subtitle-1 mb-1 ml-1">Update Password</p>

    <v-text-field
      class="mb-2"
      variant="outlined"
      v-model="password"
      label="Password"
      validate-on="submit"
      :type="showPassword ? 'text' : 'password'"
      :rules="[formRules.passwordCounter]"
    >
      <template #append>
        <v-btn
          :loading="loading" width="24" height="24"
          variant="text" icon
          @click.prevent="showPassword = !showPassword"
        >
          <v-icon :icon="showPassword ? 'mdi-eye-off' : 'mdi-eye'"></v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <v-text-field
      class="mb-2"
      variant="outlined"
      v-model="confirmPassword"
      label="Confirm Password"
      validate-on="submit"
      :type="showPassword ? 'text' : 'password'"
      :rules="[formRules.passwordCounter, formRules.passwordMatch]"
    >
      <template #append>
        <v-btn
          :loading="loading" width="24" height="24"
          :disabled="disablePasswordSaveBtn" variant="text" icon
          @click.prevent="updatePassword"
        >
          <v-icon icon="mdi-content-save"></v-icon>
        </v-btn>
      </template>
    </v-text-field>

    <div style="height: 1px; width: 100%;" class="bg-grey-darken-3 mb-3"></div>

    <v-card-actions>
      <v-btn @click.prevent="emits('on-close')">Cancel</v-btn>
    </v-card-actions>

    <!-- Snackbar Notifications -->
    <v-snackbar v-model="nicknameUpdated">
      Nickname updated!
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="nicknameUpdated = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="emailUpdated">
      Email updated!
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="emailUpdated = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="passwordUpdated">
      Password updated!
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="passwordUpdated = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="showErrorMsg" color="red">
      {{ errorMsg }}
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="showErrorMsg = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </v-card>
</template>

<style></style>
