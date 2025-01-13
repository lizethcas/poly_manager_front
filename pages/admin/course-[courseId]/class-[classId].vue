<template>
  <div>
    <ContentLayout>
      <ClassCard :classes="[classData]" :showDragIcon="false" />
    </ContentLayout>
    <BaseTaskModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :title="modalTitle"
      :icon="modalIcon"
      @close="closeModal"
      :menuItems="getDataMenu(modalTitle)"
    />
  </div>
  <ContentTeacher />
  <EditClassNavigation  @open-modal="showModal"/>

  <Loading v-if="isLoading" />
  <Error
    v-if="error"
    :error="error"
    :message="error.message"
    @refetch="refetch"
  />
</template>
<script setup lang="ts">
definePageMeta({
  layout: "dashboard-layout",
});
import ClassCard from "~/components/organisim/ClassCard.vue";
import EditClassNavigation from "~/components/organisim/EditClassNavigation.vue";
import BaseTaskModal from "~/components/organisim/BaseTaskModal.vue";
import ContentLayout from "~/layouts/content-layout.vue";
import ContentTeacher from "~/components/organisim/templatesUsers/teachers/contenTeacher.vue";
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";
import { useTaskStore } from "~/stores/task.store";
import { useClassByIdQuery } from "~/composables/useClassesQuery";
import { useDataMenu } from "~/composables/useDataMenu";

const taskStore = useTaskStore();
const { getDataMenu } = useDataMenu();
const route = useRoute();
const classId = Number(route.params.classId);
const isModalOpen = ref(false)
const modalTitle = ref('')
const modalIcon = ref('')

// Add a watch to handle modal state changes
watch(() => taskStore.getTask("modal"), (newValue) => {
  isModalOpen.value = newValue?.modal ?? false
}, { immediate: true })

const showModal = (label: string, name: string) => {
  isModalOpen.value = true
  modalTitle.value = label
  modalIcon.value = name
}

const closeModal = () => {
 
  isModalOpen.value = false
}

const {
  data: classData,
  isLoading,
  error,
  refetch,
} = useClassByIdQuery(classId);
</script>
