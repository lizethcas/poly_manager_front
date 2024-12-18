<template>
  <div class="w-full">
    <div class="flex items-center gap-2">
      <p class="text-xs p-2 text-fuscous-gray-950">Exercise text:</p>
      <Icon
        name="material-symbols:info-outline"
        size="14"
        class="bg-tarawera-700"
      />
    </div>
    <p class="text-xs p-2 text-fuscous-gray-950">
      Use brackets for gaps: []. Separate a hint from the correct answer by
      */: [a hint*/the answer]. Use multiple / for multiple correct answers: [a
      hint/correct answer 1/correct answer 2]. Leave the space before the first
      / empty for multiple correct answers without a hint: [/correct answer
      1/correct answer 2].
    </p>
    <p class="bg-tarawera-100 text-xs p-2 text-fuscous-gray-950">
      {{ description }}
    </p>
    <UTextarea
      v-model="localValue"
      class="text-xs mt-2"
      @update:model-value="handleInput"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  description: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:value"]);

// Create local value to handle v-model correctly
const localValue = ref(props.value);

const handleInput = (newValue: string) => {
  emit("update:value", newValue);
};
</script>

