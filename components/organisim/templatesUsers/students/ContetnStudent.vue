<template>
  <TaskList :class="'my-4'" :currentTaskIndex="currentTaskIndex">
    <template #default="{ task, index }">
      <div :ref="el => taskRefs[index] = el as HTMLElement">
        <ShowTaskStudent
          v-if="currentTaskIndex >= index"
          :content_type="task.content_type"
          :task="task"
          :index="index"
        />
        <div v-if="currentTaskIndex === index" class="w-full flex justify-center">
          <button
            class="text-white bg-[#2F71C5] px-2 py-1 rounded-xl m-auto w-1/2 hover:shadow-lg"
            @click="() => showNextTask(index)"
          >
            Continue
          </button>
        </div>
      </div>
    </template>
  </TaskList>
</template>

<script setup lang="ts">
import { ref, nextTick } from 'vue';
import ShowTaskStudent from "~/components/organisim/templatesUsers/students/ShowTaskStudent.vue";
import TaskList from "~/layouts/TaskList.vue";

const currentTaskIndex = ref(0);
const taskRefs = ref<HTMLElement[]>([]);

const showNextTask = (index: number) => {
  currentTaskIndex.value++;
  // Wait for next tick to ensure new content is rendered
  nextTick(() => {
    const nextTask = taskRefs.value[index + 1];
    if (nextTask) {
      nextTask.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
};
</script>
