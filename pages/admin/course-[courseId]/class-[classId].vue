<template>
  <div>
    <ContentLayout>
      <ClassCard :classes="[classData]" :showDragIcon="false" />
    </ContentLayout>
    <EditClassNavigation  @open-modal="showModal"/>
    <BaseTaskModal
      v-if="isModalOpen"
      :is-open="isModalOpen"
      :title="modalTitle"
      :icon="modalIcon"
      @close="closeModal"
      :menuItems="getDataMenu(modalTitle)"
    />
  </div>
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
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";

import { useClassByIdQuery } from "~/composables/useClassesQuery";
import { useDataMenu } from "~/composables/useDataMenu";

const { getDataMenu } = useDataMenu();
const route = useRoute();
const classId = Number(route.params.classId);
const isModalOpen = ref(false)
const modalTitle = ref('')
const modalIcon = ref('')


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
