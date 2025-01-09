<template>
  <div>
    <template v-if="taskTitle == 'text_block'">
      <h3 class="text-s font-bold text-tarawera-700 mt-4">Text:</h3>
      <MoleculeInput
        type="text_area"
        size="xl"
        container-class="py-2"
        @update:modelValue="taskData.content_details.text_block.text = $event"
      />
    </template>

    <template v-else-if="taskTitle == 'info_box'">
      <InfoBox
        v-model="taskData.content_details.info_type"
        :type="taskData.content_details.info_type"
      />
    </template>

    <div class="flex items-center gap-2 py-4 text-sm">
      <p>Include the stats</p>
      <AtomosToggle v-model="taskData.stats" />
    </div>
    <MoleculeActionButtons
      @handleSave="handleSave()"
      @handleCancel="handleCancel"
      :isActive="isActive"
    />
  </div>
</template>

<script setup lang="ts">
import { watch, ref, computed } from "vue";
import { useTaskStore } from "~/stores/task.store";
import { createBaseTaskData } from "~/interfaces/task.interface";
import { useRoute } from "vue-router";
import { useClassContentMutation } from '~/composables/useClassContentMutation';
import InfoBox from '~/components/molecule/multipleTask/InfoBox.vue';
import { useToast } from "~/composables/useToast";

const toast = useToast();
const taskStore = useTaskStore();
const route = useRoute();
const mutation = useClassContentMutation();
const title = computed(() => taskStore.getTask("taskTitle"));
const taskTitle = ref("info_box");
const isActive = ref(false);

const taskInstructions = computed(() => taskStore.getTask("instructions"));

interface TextContent {
  text: string;
  columns: number;
}

interface InfoBoxContent {
  info_type: string;
}

const taskData = ref({
  ...createBaseTaskData(String(route.params.classId), title.value),
  content_details: title.value === 'Plain Text'
    ? {text_block: { text: '', columns: 1 } }
    : { info_type: 'attention'  }
});

watch(
  taskInstructions,
  (newValue) => {
    if (newValue) {
      taskData.value = {
        ...taskData.value,
        tittle: newValue.title || "",
        instructions: newValue.instructions || "",
      };
      if (taskTitle.value === 'info_box') {
        isActive.value = true;
      } else {
        isActive.value = false;
      }
    }
  },
  { deep: true, immediate: true }
);

watch(title, (newTask) => {
  taskTitle.value = newTask === "Plain Text" ? "text_block" : "info_box";

  taskData.value = {
    ...createBaseTaskData(String(route.params.classId), taskTitle.value),
    content_details: taskTitle.value === 'text_block'
      ? {text_block: { text: '', columns: 1 } }
      : { info_type: 'attention'  }
  };
});

watch(() => taskData.value.content_details, (newTask) => {
  if (taskTitle.value === 'text_block') {
    isActive.value = newTask.text_block.text !== "";
  } else {
    isActive.value = true;
  }
}, { deep: true });

const handleSave = async () => {
  try {
    const payload = {
      class_id: String(route.params.classId),
      content_type: taskTitle.value.toLowerCase().replace(' ', '_'),
      content_details: taskData.value.content_details,
      tittle: taskData.value.tittle,
      instructions: taskData.value.instructions,
      stats: taskData.value.stats
    };

    const response = await mutation.mutateAsync(payload);
    if (response.status === 'success') {
      if (response.data.status !== 'error') {
        toast.success('Class content created successfully');
        handleCancel();
      } else {
        toast.error('Error creating class content');
      }
    }
  } catch (error) {
    console.error('Error saving task:', error);
    toast.error('Error creating class content');
  }
};

const handleCancel = () => {
  taskStore.addTask("modal", { modal: false });
  taskData.value = {
    ...createBaseTaskData(String(route.params.classId), taskTitle.value),
    content_details: { text_block: { text: '', columns: 1 } },
  };
};
</script>
