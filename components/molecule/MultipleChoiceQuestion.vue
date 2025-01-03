<template v-if="data">
  <div class="w-1/4" v-if="data.image">
    <img :src="data.image" alt="Question Image" class="w-full h-full object-cover rounded-[10px]" />
  </div>
  <div class="w-full">
    <audio :src="data.audio" controls class="mb-4 w-full" v-if="data.audio !== null"></audio>

    <div
      v-for="(question, index) in data.content_details.questions ||
      data.categories"
      :key="index"
      class="border-r-2 border-l-2 border-t-2 border-b-2 border-tarawera-200 rounded-[10px] p-2"
    >
      <h4 class="font-bold">{{ question.question }}</h4>

      <div
        v-for="(answer, index) in question.answers ||
        data.content_details.text_items"
        :key="index"
        :class="{
          'flex justify-start': answer.isCorrect,
          'bg-tarawera-200': answer.isCorrect,
        }"
        class="rounded-[10px]"
      >
        <p class="m-1">{{ answer.text }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  data: any;
}>();
</script>
