<template>
  <div>
    <h2
      class="text-3xl font-light mb-8 text-primary-color flex items-center gap-3"
    >
      <IconMolecule
        :name="IconType.imgGen"
        :size="30"
        :color="'text-primary-color'"
      />
      AI Image Generation
    </h2>

    <div class="space-y-6">
      <div class="gap-2">
        <MoleculeInput
          v-model="prompt"
          type="text_area"
          size="xl"
          placeholder="Describe the image you want to create..."
          :containerClass="''"
          class="w-full"
        />
        <UButton
          @click="generateImage"
          :loading="isLoading"
          :disabled="isLoading"
          color="indigo"
        >
          {{ isLoading ? "Generating..." : "Generate" }}
        </UButton>
      </div>

      <div v-if="imageUrl" class="relative group">
        <img
          :src="imageUrl"
          alt="Generated image"
          class="w-48 h-48 object-cover rounded-xl hover:shadow-lg cursor-pointer"
        />
        <div
          class="absolute bottom-0 left-0 flex bg-black/50 border-t border-white/50 w-48 px-2 rounded-b-xl"
        >
          <UTooltip text="Save image">
            <IconMolecule
              :name="IconType.save"
              :size="30"
              :color="'text-white/50 hover:text-white'"
              class="cursor-pointer opacity-100 hover:scale-110"
              @click="
                saveImage();
                $emit('close-modal');
              "
            />
          </UTooltip>
          <UTooltip text="Expand image">
            <IconMolecule
              :name="IconType.expand"
              :size="30"
              :color="'text-white/50 hover:text-white'"
              class="cursor-pointer opacity-100 hover:scale-110"
              @click="showModal = true"
            />
          </UTooltip>
        </div>
      </div>

      <!-- Image Modal -->
      <UModal v-model="showModal">
        <div class="p-4">
          <img
            :src="imageUrl"
            alt="Generated image"
            class="max-w-full max-h-[90vh] object-contain rounded-lg m-auto"
          />
        </div>
      </UModal>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { axiosDashboard } from "~/services/axios.config";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
import MoleculeInput from "~/components/molecule/Input.vue";
import { useToast } from "~/composables/useToast";
import { useTaskStore } from "~/stores/task.store";

const taskStore = useTaskStore();
const prompt = ref("");
const imageUrl = ref("");
const isLoading = ref(false);
const toast = useToast();
const showModal = ref(false);

const emit = defineEmits(["close-modal"]);

const generateImage = async () => {
  if (!prompt.value.trim()) {
    toast.error("Por favor, ingresa una descripción");
    return;
  }

  isLoading.value = true;

  imageUrl.value = "";

  try {
    const response = await axiosDashboard.post("img_gen/", {
      prompt: prompt.value,
    });

    if (response.data.url) {
      imageUrl.value = response.data.url;
    } else {
      toast.error("Error al generar la imagen");
    }
  } catch (err) {
    toast.error("Error al generar la imagen");
  } finally {
    isLoading.value = false;
  }
};

const saveImage = () => {
  taskStore.addTask("img_gen", imageUrl.value);
  console.log(taskStore.getTask("img_gen"));
  toast.success("Image saved to tasks");
  
};
</script>
