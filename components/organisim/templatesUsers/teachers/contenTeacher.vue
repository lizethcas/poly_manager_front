<template>
  <Loading v-if="isLoading" />
  <Error v-if="error" :error="error" :message="error.message" />
  <TaskList v-if="!isLoading && !error" class="my-4">
    <template #default="{ task, index }">
      <Tasks :content_type="task.content_type" :task="task" :index="index" />
    </template>
  </TaskList>

  <div v-for="(task, index) in classTasks?.data" :key="index" class="">
    <Tasks :content_type="task.content_type" :task="task" :index="index" />
  </div>
</template>

<script setup lang="ts">
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";
import { useClassContents } from "~/composables/useClassContents";
import { useRoute } from "vue-router";
import Tasks from "~/components/organisim/templatesUsers/teachers/Tasks.vue";
import TaskList from "~/layouts/TaskList.vue";

const route = useRoute();
const {
  classContents: classTasks,
  isLoading,
  error,
} = useClassContents(route.params.classId as string);
</script>
