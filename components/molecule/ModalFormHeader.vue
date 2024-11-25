<template>
  <div class="flex justify-between">
    <h2 class="font-bold text-m">{{ title }}</h2>
    <img src="../../assets/images/close.webp" alt="close create course" class="w-5 h-5 cursor-pointer"
      @click="$emit('close')" />
  </div>
</template>
<script lang="ts" setup>
import type { ModalProps } from '~/interfaces/modal.interface'

const { title } = defineProps<ModalProps>()
defineEmits(['close'])
</script>
