<template>
  <TaskLayout :title="taskTitle">
    <OrganisimMultipleTasks
      v-if="taskTitle === 'Multiple choice'"
      typeTask="multiple_choice"
      titleTask="Question "
    />
    <OrganisimMultipleTasks
      v-if="taskTitle === 'True or false'"
      typeTask="true_false"
      titleTask="Question"
    />
    <OrganisimMultipleTasks
      v-if="taskTitle === 'Categories'"
      typeTask="category"
      titleTask="Category"
    />
    <OrganisimMultipleTasks
      v-if="taskTitle === 'Sorting'"
      typeTask="sorting"
      titleTask="Sorting"
    />
    <OrganisimMultipleTasks
      v-if="taskTitle === 'Put in order'"
      typeTask="ordering"
      titleTask="Put in the right order"
    />
    <OrganisimMultipleTasks
      v-if="taskTitle === 'Fill in the gaps' || taskTitle === 'Word bank'"
      :typeTask="'text_area'"
      :description="getTaskDescription(taskTitle)"
    />
  </TaskLayout>
</template>

<script setup lang="ts">
import TaskLayout from "~/layouts/TaskLayout.vue";
import OrganisimMultipleTasks from "~/components/organisim/MultipleTasks.vue";
import { useDescription } from "~/composables/useDescription";
import { useTaskStore } from "~/stores/task.store";

const taskStore = useTaskStore();
const taskTitle = ref<string>("Multiple choice");
const title = computed(() => taskStore.getTask("taskTitle"));

watch(title, (newTask) => {
  taskTitle.value = newTask;
});

const { getTaskDescription } = useDescription();
</script>