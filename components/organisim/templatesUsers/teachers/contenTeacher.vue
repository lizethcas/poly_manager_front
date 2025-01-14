<template>
  <Loading v-if="isLoading" />
  <Error v-if="error" :error="error" :message="error.message" />

  <TaskList v-if="!isLoading && !error" class="my-4">
    <template #default="{ task, index }">
      <Tasks :content_type="task.content_type" :task="task" :index="index" />
      
    </template>
    
  </TaskList>


</template>

<script setup lang="ts">
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";
import { useClassContents } from "~/composables/useClassContents";
import { useRoute } from "vue-router";
import Tasks from "~/components/organisim/templatesUsers/teachers/Tasks.vue";
import TaskList from "~/layouts/TaskList.vue";
import { ref } from "vue";

const route = useRoute();
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(route.params.classId as string);

const selectedScenario = ref(null);

// Query para obtener los escenarios
</script>
