<template>
  <div class="flex flex-col gap-2">
    <!-- Sentences with text inputs -->
    <div class="space-y-2 flex flex-col">
      <div 
        v-for="(passage, passageIndex) in task.content_details.passages" 
        :key="passageIndex"
        class="text-base flex items-center flex-wrap"
      >
        <template v-for="(part, partIndex) in parseSentence(passage.text)" :key="partIndex">
          <template v-if="part.type === 'blank'">
            <input
              type="text"
              :class="[
                'min-w-[80px] w-32 h-[30px] mx-1 border px-2 text-sm',
                'rounded-md transition-colors',
                getInputClasses(passageIndex, part.position)
              ]"
              v-model="answers[`${passageIndex}-${part.position}`]"
              :placeholder="passage.help_text || ''"
              @input="validateAnswers"
            />
          </template>
          <span v-else class="mx-0.5">{{ part.text }}</span>
        </template>
      </div>
    </div>

    <!-- Score display -->
    <div class="mt-2 text-right text-sm" role="status" aria-live="polite">
      Score: {{ score }}/{{ totalPossibleScore }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const props = defineProps<{
  task: {
    id: number;
    class_id: number;
    content_type: string;
    content_details: {
      passages: Array<{
        text: string;
        keywords: string[];
        help_text: string;
      }>;
    };
    // ... other task properties
  };
}>();

const answers = ref<Record<string, string>>({});
const score = ref(0);

const shuffledWords = computed(() => {
  const allWords = props.task.content_details.passages.flatMap(item => item.keywords);
  return [...new Set(allWords)].sort(() => Math.random() - 0.5);
});

const totalPossibleScore = computed(() => 
  props.task.content_details.passages.reduce((acc, item) => acc + 1, 0)
);

const parseSentence = (text: string) => {
  const parts = text.split(/__(\d+)__/);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return { type: 'text', text: part };
    }
    return { type: 'blank', position: parseInt(part) };
  });
};

const getInputClasses = (passageIndex: number, position: number) => {
  const key = `${passageIndex}-${position}`;
  const answer = answers.value[key];
  
  if (!answer) return 'border-gray-300 bg-white';
  
  const isCorrect = isAnswerCorrect(passageIndex, position, answer);
  return isCorrect 
    ? 'border-green-500 bg-green-50' 
    : 'border-red-500 bg-red-50';
};

const isAnswerCorrect = (passageIndex: number, position: number, answer: string) => {
  const passage = props.task.content_details.passages[passageIndex];
  return passage.keywords.includes(answer);
};

const validateAnswers = () => {
  let correctCount = 0;
  
  Object.entries(answers.value).forEach(([key, answer]) => {
    const [passageIndex, position] = key.split('-').map(Number);
    if (isAnswerCorrect(passageIndex, parseInt(position), answer)) {
      correctCount++;
    }
  });
  
  score.value = correctCount;
};
</script>
