<script setup lang="ts">
import { onMounted, ref, computed, watch } from 'vue';
import { useUserStore } from '@/stores/user';
import { useRouter } from 'vue-router';

// Utils
import apiClient from '@/utils/axiosClient';

// Components
import EditUser from '@/components/EditUser.vue';

// Types
import type Character from '@/utils/types/character'
import type { Status } from '@/utils/types/character'

const userStore = useUserStore()
const router = useRouter()

const characters = ref<Character[]>([])
const charactersCount = ref(0)
const pagesCount = ref(0)
const page = ref(1)
const favoritesIds = computed(() => userStore.user?.favoriteCharacters || [])

// UI
const loading = ref(true)
const windowWidth = ref(0)
const xs = computed(() => windowWidth.value < 600)
const charactersMode = ref<'all' | 'favorites'>('all')
const showEditUserModal = ref(false)
const addToFavoritesNotification = ref(false)
const quitFromFavoritesNotification = ref(false)

onMounted(async () => {
  onResize()
  window.onresize = onResize

  if (!userStore.user) router.push('/')

  else await retrievePageOfCharacters()
})

function characterStatusColor(status: Status) {
  if (status === 'unknown') return 'bg-grey-lighten-1'
  else if (status === 'Alive') return 'bg-green'
  else return 'bg-red'
}

function formatCharacterStatus(status: Status) {
  if (status === 'unknown') return status.charAt(0).toUpperCase() + status.slice(1)
  else return status
}

async function logout() {
  await apiClient.get('/auth/logout')
    .then(res => {
      userStore.clearUser()
      router.push('/')
    })
}

function onResize() { windowWidth.value = document.body.offsetWidth }

async function retrievePageOfCharacters() {
  loading.value = true
  await apiClient.get(`/characters?page=${page.value}`)
    .then(res => {
      characters.value = res.data.results
      charactersCount.value = res.data.info.count
      pagesCount.value = res.data.info.pages
    })
    .then(_ => loading.value = false)
    .catch(err => {
      console.error(err)
      loading.value = false
    })
}

async function retrieveFavoriteCharacters() {
  loading.value = true
  await apiClient.get('/characters/favorite-characters')
    .then(res => {
      characters.value = res.data.favoriteCharacters
      charactersCount.value = res.data.count
    })
    .then(_ => loading.value = false)
    .catch(err => {
      console.error(err)
      loading.value = false
    })
}

async function switchFavoriteCharacter(characterId: number, index: number) {
  if (!userStore.user) return
  characters.value[index].loading = true

  if (userStore.user.favoriteCharacters.includes(characterId)) {

    const updatedFavCharacters = userStore.user.favoriteCharacters.filter(id => id !== characterId)
    await apiClient.put(`/users/favorite-characters`, { favoriteCharacters: updatedFavCharacters })
      .then(res => userStore.setUser(res.data))
      .then(_ => {
        delete characters.value[index].loading
        addToFavoritesNotification.value = false
        quitFromFavoritesNotification.value = true
      })
      .catch(err => console.error(err))

  } else {

    const updatedFavCharacters = JSON.parse(JSON.stringify(userStore.user.favoriteCharacters)) as number[]
    updatedFavCharacters.push(characterId)

    await apiClient.put(`/users/favorite-characters`, { favoriteCharacters: updatedFavCharacters })
      .then(res => userStore.setUser(res.data))
      .then(_ => {
        delete characters.value[index].loading
        quitFromFavoritesNotification.value = false
        addToFavoritesNotification.value = true
      })
      .catch(err => console.error(err))

  }

  if (charactersMode.value === 'favorites') await retrieveFavoriteCharacters()
}

watch(page, retrievePageOfCharacters)

watch(charactersMode, async (newVal) => {
  if (newVal === 'all') await retrievePageOfCharacters()
  else await retrieveFavoriteCharacters()
})

// This is for no-cache refresh
watch(() => userStore.user, async (_, oldVal) => {
  if (!oldVal && !characters.value.length) await retrievePageOfCharacters()
})
</script>

<template>
  <div class="px-2 py-4 mx-auto" style="max-width: 1240px;">
    <div class="d-flex justify-center">
      <h1 class="text-center mb-3 mx-4">Welcome, {{ userStore.user?.nickname }}</h1>
      <v-btn class="mx-4" color="grey-darken-3" icon @click.prevent="showEditUserModal = true">
        <v-icon icon="mdi-account-edit"></v-icon>
      </v-btn>
      <v-btn color="grey-darken-3" icon @click.prevent="logout">
        <v-icon icon="mdi-logout"></v-icon>
      </v-btn>
    </div>

    <v-pagination
      v-if="pagesCount && charactersMode === 'all'"
      style="max-width: 600px;"
      :length="pagesCount"
      :disabled="loading"
      class="mx-auto"
      v-model="page"
    >
    </v-pagination>

    <div v-if="characters.length" class="text-center mb-2">
      <p v-if="charactersMode === 'all'">Showing 20 of {{ charactersCount }} characters</p>
      <p v-else>Showing {{ charactersCount }} favorite characters</p>
    </div>

    <div class="text-center mb-2">
      <v-btn
        class="mx-2"
        :flat="charactersMode === 'all'"
        :color="charactersMode === 'all' ? 'blue' : 'grey-darken-3'"
        @click.prevent="charactersMode = 'all'"
      >
        All Characters
      </v-btn>
      <v-btn
        class="mx-2"
        :flat="charactersMode === 'favorites'"
        :color="charactersMode === 'favorites' ? 'blue' : 'grey-darken-3'"
        @click.prevent="charactersMode = 'favorites'"
      >
        Favorites
      </v-btn>
    </div>

    <div v-if="loading" style="height: calc(100vh - 120px);" class="d-flex flex-column justify-center align-center">
      <v-progress-circular indeterminate class="mb-2"></v-progress-circular>
      <p>Loading Characters</p>
    </div>

    <p
      v-else-if="!loading && !characters.length && charactersMode === 'favorites'"
      class="text-center my-8 text-h4"
    >
      No favorite characters yet
    </p>

    <v-row v-else align="center" no-gutters>
      <v-col v-for="character, index in characters" :key="character.id" cols="12" lg="6" class="pa-1">
        <v-card
          class="mb-3 mx-auto text-white bg-grey-darken-3 d-flex flex-column flex-sm-row"
          :min-height="xs ? 525 : 220"
          :width="xs ? 300 : 600"
          v-if="character"
          elevation="8"
        >
          <img :src="character.image" :alt="character.name" :height="xs ? 300 : 225" :width="xs ? 300 : 225">
          <div class="pa-5 d-flex flex-column justify-center" :style="xs ? 'width: 100%;' : 'width: 375px;'">
            <div class="d-flex align-center justify-space-between">
              <h3 class="text-h5 font-weight-bold mr-3 text-truncate">{{ character.name }}</h3>
              <v-btn
                icon flat color="grey-darken-3"
                :loading="character.loading"
                @click.prevent="switchFavoriteCharacter(character.id, index)"
              >
                <v-icon :icon="favoritesIds.includes(character.id) ? 'mdi-star' : 'mdi-star-outline'"></v-icon>
              </v-btn>
            </div>

            <div class="d-flex align-center mb-2">
              <div
                class="rounded-circle"
                style="height: 10px; width: 10px;"
                :class="characterStatusColor(character.status)"
              ></div>
              <p class="mb-0 ml-2 text-subtitle-1 font-weight-bold" style="margin-top: 1px;">
                {{ formatCharacterStatus(character.status) }} - {{ character.species }}
              </p>
            </div>

            <p class="font-weight-bold text-grey-lighten-1 text-body-2">Last known location:</p>
            <p class="mb-3">{{ character.location.name }}</p>

            <p class="font-weight-bold text-grey-lighten-1 text-body-2">First seen in:</p>
            <p>{{ character.firstEpisode?.name }}</p>
          </div>
        </v-card>
      </v-col>
    </v-row>

    <v-pagination
      v-if="pagesCount && charactersMode === 'all'"
      style="max-width: 600px;"
      :length="pagesCount"
      :disabled="loading"
      class="mx-auto"
      v-model="page"
    >
    </v-pagination>

    <div v-if="characters.length" class="text-center mb-2">
      <p v-if="charactersMode === 'all'">Showing 20 of {{ charactersCount }} characters</p>
      <p v-else>Showing {{ charactersCount }} favorite characters</p>
    </div>

    <v-dialog v-model="showEditUserModal">
      <EditUser @on-close="showEditUserModal = false"/>
    </v-dialog>

    <v-snackbar v-model="addToFavoritesNotification">
      Character added to favorites
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="addToFavoritesNotification = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>

    <v-snackbar v-model="quitFromFavoritesNotification">
      Character removed from favorites
      <template #actions>
        <v-btn icon text>
          <v-icon icon="mdi-close" @click.prevent="quitFromFavoritesNotification = false"></v-icon>
        </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>

<style scoped>
</style>
