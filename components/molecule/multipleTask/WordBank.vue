<template>
  <div class="flex flex-col gap-4">
    <!-- Word bank at the top -->
    <div class="flex flex-wrap gap-2  bg-fuscia-100 rounded-lg bg-fuscous-gray-100 p-2">
      <span 
        v-for="word in getAllWords()" 
        :key="word"
        @click="selectWord(word)"  
        :class="[
          'w-contain rounded-md shadow-sm cursor-pointer p-1',
          isCorrectWord(word) ? 'bg-tarawera-200 hover:bg-tarawera-600' : 'hover:bg-gray-100'
        ]"
      >
        {{ word }}
      </span>
    </div>

    <!-- Text with blanks -->
    <div v-for="(phrase, index) in data" :key="index">
      <p class="text-lg">
        <template v-for="(word, wordIndex) in splitTextWithKeywords(phrase)" :key="wordIndex">
          <span
            :class="[
              'px-1 text-sm',
              word.isKeyword ? ' rounded min-w-[20px] inline-block' : ''
            ]"
          >{{ word.isKeyword ? '___' : word.text }}</span>
        </template>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';

interface Keyword {
  word: string;
  position: number;
}

interface Props {
  data: {
    text: string;
    keywords: Keyword[];
    extraWords: string[];
  }[];
}

const props = defineProps<Props>();

const getAllWords = () => {
  const words = new Set<string>();
  props.data.forEach(phrase => {
    phrase.keywords.forEach(k => words.add(k.word));
    phrase.extraWords.forEach(w => words.add(w));
  });
  // Convert to array and shuffle
  const shuffledWords = Array.from(words).sort(() => Math.random() - 0.5);
  return shuffledWords;
};

const splitTextWithKeywords = (phrase: Props['data'][0]) => {
  const words = phrase.text.split(' ');
  return words.map(word => {
    const isKeyword = word.startsWith('__') && word.endsWith('__');
    if (isKeyword) {
      const position = parseInt(word.replace(/__/g, ''));
      const keyword = phrase.keywords.find(k => k.position === position);
      return {
        text: keyword?.word || word,
        isKeyword: true
      };
    }
    return {
      text: word,
      isKeyword: false
    };
  });
};

const isCorrectWord = (word: string) => {
  return props.data.some(phrase => 
    phrase.keywords.some(k => k.word === word)
  );
};

// Add selected word state
const selectedWord = ref<string | null>(null);

// Add selectWord function
const selectWord = (word: string) => {
  selectedWord.value = word;
  };
</script>
