<template>
  <Teleport to="body">
    <div v-if="modelValue" class="fixed inset-0 z-50 overflow-y-auto">
      <!-- Modal backdrop -->
      <div
        class="fixed inset-0 bg-gray-600 bg-opacity-50 transition-opacity"
        @click="$emit('update:modelValue', false)"
      ></div>

      <!-- Modal content -->
      <div class="relative min-h-screen flex items-center justify-center">
        <div class="fixed bg-white w-full h-screen overflow-y-auto p-6 md:p-8">
          <!-- Close button -->
          <IconMolecule
            :name="IconType.close"
            :size="30"
            @click="$emit('update:modelValue', false)"
            color="text-gray-400 hover:text-gray-500"
            class="absolute top-6 right-6 z-10"
          />
          <!-- Image Generator content -->
          <ImgGenerator 
            :source="source"
            @close-modal="$emit('update:modelValue', false)"
          />
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { IconType } from "~/data/iconsType";
import IconMolecule from "~/components/atomos/Icon.vue";
import ImgGenerator from "./ImgGenerator.vue";

defineProps({
  modelValue: {
    type: Boolean,
    required: true
  },

});

const emit = defineEmits(['update:modelValue', 'image-generated']);



</script>
