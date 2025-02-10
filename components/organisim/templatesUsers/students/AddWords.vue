<template>
  <div>
    <div class="my-4 bg-white rounded-lg p-4">
      <div
        class="flex flex-col sm:flex-row gap-2 w-full my-2"
        v-for="(pair, index) in wordPairs"
        :key="index"
      >
        <UInput
          size="sm"
          variant="gray"
          placeholder="word"
          v-model="pair.word1"
          class="w-full sm:flex-1"
        />
        <UInput
          size="sm"
          variant="gray"
          placeholder="word"
          v-model="pair.word2"
          class="w-full sm:flex-1"
        />
        <IconMolecule
          :name="IconType.trash"
          :size="24"
          color="text-gray-400 hover:text-[#4287DF]"
          class="cursor-pointer bg-white rounded-lg px-1 mt-2 sm:mt-0"
          @click="removeWordPair(index)"
        />
      </div>
      <button
        @click="addWord"
        :disabled="isLastPairIncomplete"
        class="bg-[#F1F5FB] text-fuscous-gray-600 text-xs rounded-md flex items-center gap-2 px-2 py-1 mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <Icon
          name="icon-park-solid:add"
          size="14"
          class="bg-fuscous-gray-500"
        />
        Add word
      </button>
    </div>
    <div class="flex justify-center">
      <UTooltip text="all fields are required" class="w-full" >
        <button
          :disabled="isLastPairIncomplete"
          class="bg-[#4287DF] w-full lg:w-1/2 text-white text-sm rounded-md px-4 py-2 mt-4 disabled:opacity-50 disabled:cursor-not-allowed"
          @click="saveWords"
        >
          Save
        </button>
      </UTooltip>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconMolecule from "@/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";

interface WordPair {
  word1: string;
  word2: string;
}

const wordPairs = ref<WordPair[]>([]);
console.log(wordPairs.value);

const addWord = () => {
  wordPairs.value.push({
    word1: "",
    word2: "",
  });
};

const removeWordPair = (index: number) => {
  wordPairs.value.splice(index, 1);
};

const isLastPairIncomplete = computed(() => {
  if (wordPairs.value.length === 0) return false;
  const lastPair = wordPairs.value[wordPairs.value.length - 1];
  return !lastPair.word1 || !lastPair.word2;
});

const saveWords = () => {
  console.log(wordPairs.value);
};
</script>
