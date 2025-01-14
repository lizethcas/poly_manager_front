<template>
  <div
    class="bg-[#f5f5f5] p-4 rounded-md shadow-md my-4 flex flex-col gap-2 justify-center"
    :class="{ 'h-96': !previewImage && !aiImage }"
  >
    <h2 class="text-xl text-fuscous-gray-600 font-bold text-center">
      {{ index + 1 }}. {{ headdings[index + 1] }}
    </h2>

    <template v-if="!previewImage && !aiImage && index === 0">
      <div class="flex justify-center items-center flex-1">
        <InputFile
          fileType="image"
          icon="true"
          @file-selected="addNewImage"
          :showPreview="false"
          :preview="false"
        />
        <IconMolecule
          :name="IconType.imgGen"
          :size="30"
          @click="showImageGenerator = true"
          color="text-purple-500 hover:text-purple-600"
          class="mr-2 shimmer-effect transition-all duration-300"
        />
      </div>
      <IaGeneratorModal v-model="showImageGenerator" source="chat" />
    </template>

    <img
      v-else-if="index === 0"
      :src="previewImage || (aiImage?.url || aiImage)"
      alt="Preview Image"
      class="w-full h-96 object-cover"
    />

    <template v-if="index >= 1">
      <div class="flex flex-col gap-2 w-full">
        <MoleculeInput
          v-for="(input, idx) in getInputsForIndex(index)"
          :key="idx"
          :title="input.title"
          type="text_area"
          :size="input.size"
          class="text-md"
          v-model="formData[input.field]"
        />
      </div>
      <div v-show="index === 8" class="flex flex-col gap-2 items-start">
        <h3 class="text-sm text-fuscous-gray-600 font-bold">
          ChatGPT will assess the student in the following areas and provide
          scores:
        </h3>
        <ol class="list-decimal px-4">
          <li class="text-sm text-fuscous-gray-600">
            <p>Pronunciation: (Not good / Acceptable / Good / Excellent)</p>
          </li>
        </ol>
      </div>
    </template>
  </div>

  <!-- paginacion -->
  <div class="flex justify-center items-center gap-2">
    <IconMolecule
      :name="IconType.previous"
      :size="18"
      @click="previousSlide"
      color="text-purple-500 hover:text-purple-600"
      class="mr-2 shimmer-effect transition-all duration-300"
    />
    <p>{{ index + 1 }} of {{ Object.keys(headdings).length }}</p>
    <IconMolecule
      :name="IconType.next"
      :size="18"
      @click="nextSlide"
      color="text-purple-500 hover:text-purple-600"
      class="mr-2 shimmer-effect transition-all duration-300"
    />
  </div>

  <ActionButtons
    :isActive="true"
    v-if="index === 10 || index === 9"
    @handleSave="handleSave"
    @handleCancel="handleCancel"
  />
  <div v-if="isCreating">
    <p>Creating scenario...</p>
  </div>
</template>

<script setup lang="ts">
import { IconType } from "~/data/iconsType";
import IconMolecule from "~/components/atomos/Icon.vue";
import IaGeneratorModal from "../IA/IaGeneratorModal.vue";
import MoleculeInput from "~/components/molecule/Input.vue";
import { useTaskStore } from "~/stores/task.store";
import ActionButtons from "~/components/molecule/ActionButtons.vue";
import { useNotify } from "~/composables/useNotify";
import { useMutation } from '@tanstack/vue-query';
import { apiRoutes, post } from '~/services/routes.api';
import { useRoute } from 'vue-router';

defineProps<{
  selectedTask?: string;
}>();

const index = ref(0);

const route = useRoute();
const notify = useNotify();

const headdings: Record<number, string> = {
  1: "Background image",
  2: "Goals and Objectives",
  3: "Information about students",
  4: "Chat GPT's role",
  5: "Student's role",
  6: "Conversation Starter",
  7: "Conversation flow ",
  8: "Conversation Wrap-up",
  9: "Feedback and evaluation ",
  10: "Scoring",
  11: "Add extra prompts",
};

const taskStore = useTaskStore();

const previewImage = ref("");
const aiImage = computed(() => taskStore.getTask("img_gen"));
const showImageGenerator = ref(false);
console.log(route.params.classId);
const formData = reactive({
  class_id: route.params.classId as number,
  cover: null as unknown as File | string,
  name: "",
  description: "",
  goals: "",
  objectives: "",
  student_information: "",
  role_polly: "",
  role_student: "",
  conversation_starter: "",
  vocabulary: "",
  key_expressions: "",
  end_conversation: "",
  end_conversation_saying: "",
  feedback: "",
  scoring: "",
  additional_info: "",
});

const addNewImage = async (file: File) => {
  try {
    formData.cover = file;
    const base64Image = await getBase64(file);
    previewImage.value = base64Image;
  } catch (error) {
    console.error("Error processing image:", error);
  }
};

const getBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
};

const maxIndex = Object.keys(headdings).length - 1;

const nextSlide = () => {
  if (index.value < maxIndex) {
    index.value++;
  }
};

const previousSlide = () => {
  if (index.value > 0) {
    index.value--;
  }
};

const clearPreview = () => {
  previewImage.value = "";
  formData.cover = null as unknown as File | string;
  taskStore.addTask("img_gen", "");
};
    
// Add mutation for creating scenario
const createScenarioMutation = useMutation({
  mutationFn: (data: typeof formData) => post(apiRoutes.scenarios.create, data),
  onSuccess: () => {
    notify.success("Scenario created successfully");
    clearPreview();
    taskStore.addTask("modal", { open: false });
  },
  onError: (error) => {
    notify.error("Error creating scenario");
    console.error("Error:", error);
  }
});

// Update handleSave to use mutation
const handleSave = async () => {
  console.log(formData);
  const formDataToSend = new FormData();
  formDataToSend.append("cover", formData.cover as File);
  formDataToSend.append("class_id", route.params.classId as number   );
  formDataToSend.append("name", formData.name);
  formDataToSend.append("description", formData.description);
  formDataToSend.append("goals", formData.goals);
  formDataToSend.append("objectives", formData.objectives);
  formDataToSend.append("student_information", formData.student_information);
  formDataToSend.append("role_polly", formData.role_polly);
  formDataToSend.append("role_student", formData.role_student);
  formDataToSend.append("conversation_starter", formData.conversation_starter);
  formDataToSend.append("vocabulary", formData.vocabulary);
  formDataToSend.append("key_expressions", formData.key_expressions);
  formDataToSend.append("end_conversation", formData.end_conversation);
  formDataToSend.append("end_conversation_saying", formData.end_conversation_saying);
  formDataToSend.append("feedback", formData.feedback);
  formDataToSend.append("scoring", formData.scoring);
  formDataToSend.append("additional_info", formData.additional_info);
  createScenarioMutation.mutate(formDataToSend);
};

const handleCancel = () => {
  taskStore.addTask("modal", { open: false });
};

const inputConfig = {
  1: [
    {
      title: "This activity aims to help student...",
      size: "md",
      field: "goals",
    },
    {
      title: "In this class we have covered...",
      size: "md",
      field: "objectives",
    },
  ],
  2: [
    {
      title: "Indications about students' level and language limitations",
      size: "xl",
      field: "student_information",
    },
  ],
  3: [
    {
      title: "Chat GPT plays the role of .....",
      size: "xl",
      field: "role_polly",
    },
  ],
  4: [
    {
      title: "The student plays the role of .....",
      size: "xl",
      field: "role_student",
    },
  ],
  5: [
    {
      title: "Start the conversation with the student by saying...",
      size: "xl",
      field: "conversation_starter",
    },
  ],
  6: [
    {
      title:
        "Encourage the student to use target vocabulary and expressions (remind and elicit)",
      size: "md",
      field: "vocabulary",
    },
    {
      title:
        "Respond naturally to questions about....(Provide simple, clear answers, including...)",
      size: "md",
      field: "key_expressions",
    },
  ],
  7: [
    {
      title: "Wrap up the conversation when... ",
      size: "md",
      field: "end_conversation",
    },
    {
      title: "Wrap up the conversation by saying....",
      size: "md",
      field: "end_conversation_saying",
    },
  ],
  8: [
    {
      title: "After finishing the conversation, ChatGPT provides...",
      size: "xl",
      field: "feedback",
    },
  ],
  9: [
    {
      title:
        "ChatGPT will calculate an average score out of 100, formatted as:",
      size: "xl",
      field: "scoring",
    },
  ],
  10: [
    {
      title: "what else should Chat GPT take into consideration?",
      size: "xl",
      field: "additional_info",
    },
  ],
} as const;

const getInputsForIndex = (currentIndex: number) => {
  return inputConfig[currentIndex as keyof typeof inputConfig] || [];
};

// Watch aiImage changes to update formData.cover
watch(aiImage, (newValue) => {
  if (newValue) {
    formData.cover = newValue;
  }
});

// Only watch if you're actually using the changes

// Add isCreating ref for loading state
const isCreating = computed(() => createScenarioMutation.isPending.value);
</script>
