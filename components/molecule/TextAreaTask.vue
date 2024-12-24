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
      {{ data.instructions }}
    </p>
    <div class="bg-tarawera-100 text-xs p-2 text-fuscous-gray-950 flex gap-2">
      <div
        v-for="(item, index) in data.description"
        :key="index"
        class=" bg-white rounded-md p-2"
      >
        {{ item }}
      </div>
    </div>

 
    <UTextarea
      v-model="localValue"
      class="text-xs mt-2"
      @update:model-value="handleInput"
    />

    <div v-if="data.extra" class="mt-2">
      <p class="text-sm font-bold  text-primary-color">
        {{ data.extra.subtitle }}
      </p>
      <p class="text-xs text-fuscous-gray-950">
        {{ data.extra.description }}
      </p>
      <input 
        type="text" 
        class="text-xs mt-2 w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-tarawera-500" 
        @input="handleExtraInput"
      />
    </div>
  </div>
</template>


<script setup lang="ts">

interface Extra {
  subtitle: string;
  description: string;
}

interface Example {
  description?: string;
  example?: string;
}

interface Props {
  data: {
    description: string[];
    instructions?: string;
    extra?: Extra;
    example?: Example;
  };
  value: string;
}

const props = defineProps<Props>();
const emit = defineEmits(["update:value", "update:extraValue"]);

// Create local value to handle v-model correctly
const localValue = ref(props.value);

const handleInput = (newValue: string) => {
  emit("update:value", newValue);
};

const handleExtraInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit("update:extraValue", target.value);
};


</script>

