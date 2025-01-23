<template>
  <div class="flex flex-col gap-4">
    <!-- Word bank container -->
    <div 
      class="flex flex-wrap gap-2 bg-fuscous-gray-100 rounded-lg p-2"
      role="region"
      aria-label="Word Bank"
    >
      <div
        v-for="word in shuffledWords"
        :key="word.word"
        draggable="true"
        @dragstart="handleDragStart($event, word.word)"
        :class="[
          'px-3 py-1 rounded-md shadow-sm cursor-move',
          'bg-white hover:bg-gray-50 transition-colors',
          'select-none touch-manipulation flex flex-col'
        ]"
        role="button"
        :aria-label="`Drag word: ${word.word}`"
      >
        {{ word.word }}
      </div>
    </div>

    <!-- Sentences with drop zones -->
    <div class="space-y-4 flex flex-col">
      <div 
        v-for="(passage, passageIndex) in task.content_details.word_bank" 
        :key="passageIndex"
        class="text-lg leading-relaxed"
      >
        <template v-for="(part, partIndex) in parseSentence(passage.text)" :key="partIndex">
          <template v-if="part.type === 'blank'">
            <div
              :class="[
                'my-1 inline-flex items-center min-w-[80px] w-32 h-[30px] mx-1 border px-2 text-sm',
                'rounded-md transition-colors align-middle -my-1',
                getDropZoneClasses(passageIndex, part.position)
              ]"
              @dragover.prevent
              @drop="handleDrop($event, passageIndex, part.position)"
              :data-position="part.position"
              role="textbox"
              aria-dropeffect="copy"
              :aria-label="`Drop zone ${part.position}`"
            >
              {{ answers[`${passageIndex}-${part.position}`] || '' }}
            </div>
            <div v-if="passage.help_text" class="text-sm text-gray-500 italic mt-1">
              ({{ passage.help_text }})
            </div>
          </template>
          <span v-else class="text-base align-middle">{{ part.text }}</span>
        </template>
      </div>
    </div>

    <!-- Score display -->
    <div class="mt-4 text-right" role="status" aria-live="polite">
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
      word_bank: Array<{
        text: string;
        keywords: string[];
        help_text: string;
      }>;
    };
  };
}>();

const answers = ref<Record<string, string>>({});
const score = ref(0);
const availableWords = ref<Array<{ word: string }>>([]);

const shuffledWords = computed(() => {
  if (availableWords.value.length === 0) {
    // Initialize available words only if empty
    const allWords = props.task.content_details.word_bank.flatMap(item => 
      item.keywords.map(k => typeof k === 'object' ? k : { word: k })
    );
    availableWords.value = [...new Set(allWords)].sort(() => Math.random() - 0.5);
  }
  return availableWords.value;
});

const totalPossibleScore = computed(() => {
  // Count total blanks across all passages
  return props.task.content_details.word_bank.reduce((acc, passage) => {
    // Count number of blanks in each passage text using regex
    const blankCount = (passage.text.match(/__\d+__/g) || []).length;
    return acc + blankCount;
  }, 0);
});

const parseSentence = (text: string) => {
  const parts = text.split(/__(\d+)__/);
  return parts.map((part, index) => {
    if (index % 2 === 0) {
      return { type: 'text', text: part };
    }
    return { type: 'blank', position: parseInt(part) };
  });
};

const handleDragStart = (event: DragEvent, word: string) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('text/plain', word);
  }
};

const handleDrop = (event: DragEvent, passageIndex: number, position: number) => {
  if (!event.dataTransfer) return;
  
  const word = event.dataTransfer.getData('text/plain');
  const key = `${passageIndex}-${position}`;
  answers.value[key] = word;
  
  // Remove the word from availableWords
  const wordIndex = availableWords.value.findIndex(w => w.word === word);
  if (wordIndex !== -1) {
    availableWords.value.splice(wordIndex, 1);
  }
  
  validateAnswers();
};

const getDropZoneClasses = (passageIndex: number, position: number) => {
  const key = `${passageIndex}-${position}`;
  const answer = answers.value[key];
  
  if (!answer) return 'border-gray-300 bg-white';
  
  const isCorrect = isAnswerCorrect(passageIndex, position, answer);
  return isCorrect 
    ? 'border-green-500 bg-green-50' 
    : 'border-red-500 bg-red-50';
};

const isAnswerCorrect = (passageIndex: number, position: number, answer: string) => {
  const passage = props.task.content_details.word_bank[passageIndex];
  // Find the keyword entry that matches both the position and word
  return passage.keywords.some(keyword => {
    const keywordObj = typeof keyword === 'object' ? keyword : { word: keyword, position: -1 };
    return keywordObj.word === answer && keywordObj.position === position;
  });
};

const validateAnswers = () => {
  let correctCount = 0;
  
  // Check each passage
  props.task.content_details.word_bank.forEach((passage, passageIndex) => {
    // Find all blanks in the passage
    const blanks = passage.text.match(/__(\d+)__/g) || [];
    
    // Check each blank position
    blanks.forEach(blank => {
      const position = parseInt(blank.replace(/__/g, ''));
      const key = `${passageIndex}-${position}`;
      const answer = answers.value[key];
      
      // Only count if there's an answer and it's correct
      if (answer && isAnswerCorrect(passageIndex, position, answer)) {
        correctCount++;
      }
    });
  });
  
  score.value = correctCount;
};
</script>
