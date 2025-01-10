<template>
  <div class="w-4/5">
    <ContentLayout>
      <ClassCard :classes="[classData]" :showDragIcon="false" />
    </ContentLayout>
    <EditClassNavigation />
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
import ContentLayout from "~/layouts/contentLayout.vue";
import { useClassByIdQuery } from "~/composables/useClassesQuery";
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";

const route = useRoute();
const classId = Number(route.params.classId);
const {
  data: classData,
  isLoading,
  error,
  refetch,
} = useClassByIdQuery(classId);
</script>
