<template>


  <TaskList  class="my-4">
    <template #default="{ task, index }">
      <Tasks :content_type="task.content_type" :task="task" :index="index" />
      
    </template>
    
  </TaskList>


</template>

<script setup lang="ts">

import Tasks from "~/components/organisim/templatesUsers/teachers/Tasks.vue";
import TaskList from "~/layouts/TaskList.vue";


// Query para obtener los escenarios
</script>
