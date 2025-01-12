<template>
  <header
    class="text-title-color mb-4 flex items-center bg-white  rounded-lg shadow-md pb-2 pr-2"
  >
    <img
      src="~/assets/images/back-button-round.webp"
      alt="regresar una pagina"
      class="w-8 h-8 cursor-pointer items-center m-2 my-4"
      @click="handleRoute"
    />
    <div class="w-full">
      <slot></slot>
    </div>
  </header>
  
</template>
<script setup lang="ts">
import { useRoute, useRouter } from "vue-router";
import { routes } from "~/data/routes";
const route = useRoute();

const courseId = route.params.courseId;
const classId = route.params.classId;
console.log(route.path);

const handleRoute = () => {
  if (route.path.includes(`/class-${classId}`)) {
    navigateTo(routes.routesAdmin.classes(courseId));
  } else {
    navigateTo(routes.routesAdmin.courses);
  }
};
</script>
