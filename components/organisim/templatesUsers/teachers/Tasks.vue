<template>
  <div class="text-sm text-fuscous-gray-700 bg-white  pb-4 rounded-md ">
    <!-- Multiple Choice and True/False with Media -->
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
      class="flex gap-2"
    >
      <MoleculeMultipleTaskLayout v-if="task.image || task.audio" :data="task">
        <component
          :is="getQuestionComponent(task.content_type)"
          v-for="(question, index) in getQuestions(task)"
          :key="index"
          :question="question"
          :index="index"
        />
        <component
          :is="getContentComponent(task.content_type)"
          v-bind="getComponentProps(task, index)"
        />
      </MoleculeMultipleTaskLayout>
    </div>

    <!-- Standard Multiple Choice and True/False -->
    <div
      v-else-if="
        ['true_false', 'multiple_choice', 'category'].includes(
          task.content_type
        )
      "
    >
      <component
        :is="getQuestionComponent(task.content_type)"
        v-for="(question, index) in task.content_details.questions"
        :key="index"
        :question="question"
        :index="index"
      />
    </div>

    <!-- Other content types -->
    <component
      v-else
      :is="getContentComponent(content_type)"
      v-bind="getComponentProps(task, index)"
    />
  </div>
  <InfoBoxStudent :task="task" v-if="task.content_type === 'info_box'"  />
</template>
<script setup lang="ts">
import MoleculeMultipleTaskLayout from "~/layouts/MultipleTakLayout.vue";
import MoleculeMultipleTaskWordBank from "~/components/molecule/multipleTask/WordBank.vue";
import MoleculeMultipleTaskTrueFalse from "~/components/molecule/multipleTask/TrueFalse.vue";
import MoleculeMultipleTaskFill from "~/components/molecule/multipleTask/Fill.vue";
import MoleculeMultipleChoiceQuestion from "~/components/molecule/multipleTask/MultipleChoiceQuestion.vue";
import AudioTask from "~/components/organisim/templatesUsers/students/taskStudents/Audio.vue";
import VideoTask from "~/components/organisim/templatesUsers/students/taskStudents/Video.vue";
import BankGallery from "~/components/organisim/templatesUsers/students/taskStudents/BankGallery.vue";
import InfoBoxStudent from "~/components/organisim/templatesUsers/students/taskStudents/InfoBoxStudent.vue";
import TextBlockStudent from "~/components/organisim/templatesUsers/students/taskStudents/TextBlockStudent.vue";
interface Props {
  content_type: string;
  task: any;
  index: number;
  taskNumber?: string;
}
defineProps<Props>();
const contentComponents = {
  fill_gaps: MoleculeMultipleTaskFill,
  word_bank: MoleculeMultipleTaskWordBank,
  video: VideoTask,
  audio: AudioTask,
  image: BankGallery,
  text_block: TextBlockStudent,
} as const;

const questionComponents = {
  multiple_choice: MoleculeMultipleChoiceQuestion,
  true_false: MoleculeMultipleTaskTrueFalse,
  fill_gaps: MoleculeMultipleTaskFill,
  category: MoleculeMultipleChoiceQuestion,
} as const;

const getQuestionComponent = (contentType: string) => {
  const component =
    questionComponents[contentType as keyof typeof questionComponents];
  if (!component) {
    console.warn(`No component found for content type: ${contentType}`);
  }
  return component;
};

const getContentComponent = (contentType: string) => {
  console.log(contentType);
  return contentComponents[contentType as keyof typeof contentComponents];
};
const getQuestions = (task: any) => {
  return task.content_details.questions || task.categories;
};

const getComponentProps = (task: any, index: number) => {
  const props = {
    fill_gaps: (task: any) => ({
      passages: task.content_details.passages,
      class: "my-4",
    }),
    word_bank: (task: any) => ({
      data: task.content_details.word_bank,
    }),
    video: (task: any, index: number) => ({
      task,
      index,
    }),
    audio: (task: any) => ({
      task,
    }),
    image: (task: any) => ({
      images: task.content_details.images,
    }),
    text_block: (task: any) => ({
      taskData: task.content_details.text_block,
    }),
  };

  const propGetter = props[task.content_type as keyof typeof props];
  return propGetter ? propGetter(task, index) : {};
};
</script>
