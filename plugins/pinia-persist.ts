import { createPersistedState } from 'pinia-plugin-persistedstate'
import type { Pinia } from 'pinia'

export default defineNuxtPlugin(nuxtApp => {
  const pinia = nuxtApp.$pinia as unknown as Pinia
  pinia.use(createPersistedState())
}) 