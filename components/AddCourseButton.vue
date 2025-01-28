<template>
  <div
    class="rounded-lg  border-primary-color border-2 text-center mt-2 p-1 hover:border-tarawera-700 hover:text-tarawera-700 hover:scale-105 transition-all duration-300 w-full "
  >
    <button
      class="flex flex-col items-center justify-center cursor-pointer w-fit m-auto text-primary-color hover:text-tarawera-700"
      @click="emit('handleAdd')"
      aria-label="Agregar nuevo curso"
    >
      <Icon
        name="icon-park-solid:add"
        size="24"
        class="text-primary-color hover:text-tarawera-700"
      />
      <p class="pt-2 text-sm">{{ text }}</p>
    </button>
  </div>
</template>

<script lang="ts" setup>
const emit = defineEmits(["handleAdd"]);
 defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
