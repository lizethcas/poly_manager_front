<template>
  <div class="relative">
    <img
      :src="imageUrl"
      :alt="alt"
      class="w-48 h-48 object-cover rounded-[10px] cursor-pointer hover:shadow-lg"
      @click="showModal = true"
    />

   <!--  <div
      class="absolute w-full bottom-0 left-0 flex bg-black/50 border-t border-white/50 px-2 rounded-b-[10px]"
    >
      <UTooltip text="Expand image">
        <IconMolecule
          :name="IconType.expand"
          :size="30"
          :color="'text-white/50 hover:text-white'"
          class="cursor-pointer opacity-100 hover:scale-110"
          @click="showModal = true"
        />
      </UTooltip>
      <UTooltip text="Expand image">
        <IconMolecule
          :name="IconType.imgGen"
          :size="30"
          :color="'text-white/50 hover:text-white'"
          @click="showModal = true"
          class="mr-2 shimmer-effect transition-all duration-300"
        />
      </UTooltip>
    </div>

    <!-- Image Modal -->
    <IaGeneratorModal
      v-model="showModal"
      

    />
  </div> 
</template>

<script setup lang="ts">
import { ref } from "vue";
import IconMolecule from "~/components/atomos/Icon.vue";
import { IconType } from "~/data/iconsType";
import IaGeneratorModal from "~/components/organisim/IA/IaGeneratorModal.vue";

defineProps<{
  imageUrl: string;
  alt?: string;
}>();

const showModal = ref(false);
</script>
