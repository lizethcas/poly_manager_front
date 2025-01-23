<template>
  <div
    v-if="
      [
        'multiple_choice',
        'category',
        'true_false',
        'fill_gaps',
        'word_bank',
        'category',
      ].includes(task.content_type) &&
      (task.image || task.audio)
    "
    class="flex gap-2 border-b border-gray-200 shadow-sm py-2 mb-4"
  >
    <MoleculeMultipleTaskLayout v-if="task.image || task.audio" :data="task">
      <Component
        :is="getComponent(content_type)"
        :task="task"
        :images="
          content_type === 'image' ? task.content_details?.images : undefined
        "
      />
   
    </MoleculeMultipleTaskLayout>
  </div>

  <div v-else>
    <Component
      :is="getComponent(content_type)"
      :task="
        content_type === 'text_block' ? task.content_details.text_block : task
      "
      :taskData="
        content_type === 'text_block' ? task.content_details.text_block : task
      "
      :images="
        content_type === 'image' ? task.content_details?.images : undefined
      "
    />
  
  </div>
</template>

<script setup lang="ts">
import VideoTask from "~/components/organisim/templatesUsers/students/taskStudents/Video.vue";
import AudioTask from "~/components/organisim/templatesUsers/students/taskStudents/Audio.vue";
import MultipleChoiceStudent from "~/components/organisim/templatesUsers/students/taskStudents/MultipleChoiceStudent.vue";
import InfoBoxStudent from "~/components/organisim/templatesUsers/students/taskStudents/InfoBoxStudent.vue";
import TextBlockStudent from "~/components/organisim/templatesUsers/students/taskStudents/TextBlockStudent.vue";
import BankGallery from "~/components/organisim/templatesUsers/students/taskStudents/BankGallery.vue";
import MoleculeMultipleTaskLayout from "~/layouts/MultipleTakLayout.vue";
import CategoryStudent from "~/components/organisim/templatesUsers/students/taskStudents/CategoryStudent.vue";
import WordBankStudent from "~/components/organisim/templatesUsers/students/taskStudents/WordBankStudent.vue";
import TrueFalseStudent from "~/components/organisim/templatesUsers/students/taskStudents/TrueFalseStudent.vue";
import FillGapsStudent from "~/components/organisim/templatesUsers/students/taskStudents/FillGapsStudent.vue";
// Define props 
defineProps<{
  content_type: string;
  task: any; // Consider creating a proper type for this
  index: number;
}>();

const contentComponents = {
  video: VideoTask,
  audio: AudioTask,
  multiple_choice: MultipleChoiceStudent,
  info_box: InfoBoxStudent,
  text_block: TextBlockStudent,
  image: BankGallery,
  category: CategoryStudent,
  true_false: TrueFalseStudent,
  fill_gaps: FillGapsStudent,
  word_bank: WordBankStudent,
} as const;

const getComponent = (contentType: string) => {
  console.log(contentType);

  return contentComponents[contentType as keyof typeof contentComponents];
};
</script>
