<template>
    <Error
        v-if="error"
        :error="error"
        :message="error.message"
        @refetch="refetch"
    />
    <Loading v-else-if="isLoading" />
    <CourseCardStudent v-else :courses="courses" />
</template>
<script setup lang="ts">
import { useCoursesQuery } from "~/composables/useCourseQuery";
import CourseCardStudent from "~/components/organisim/templatesUsers/students/CourseCardStudent.vue";
import Loading from "~/components/organisim/alerts/Loading.vue";
import Error from "~/components/organisim/alerts/Error.vue";

const { data: courses, isLoading, error ,refetch} = useCoursesQuery();
</script>
