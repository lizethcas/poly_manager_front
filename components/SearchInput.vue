<template>
  <UInput v-model="q" name="q" placeholder="Buscar" icon="i-heroicons-magnifying-glass-20-solid" autocomplete="off"
    :ui="{ icon: { trailing: { pointer: '' } } }">
    <template #trailing>
      <UButton v-show="q !== ''" color="gray" variant="link" icon="i-heroicons-x-mark-20-solid" :padded="false"
        @click="q = ''" />
    </template>
  </UInput>
</template>

<script setup lang="ts">
import { ref } from 'vue'
const q: Ref<string> = ref('')
console.log(q.value)
</script>