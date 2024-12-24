<template>
    <div v-if="userType === 'student'">
        <DashboardStudent />
    </div>
    <div v-else>
        <DashboardTeacher />
    </div>
</template>

<script setup lang="ts">
import DashboardStudent from '~/components/organisim/templatesUsers/students/DashboardStudent.vue'
import DashboardTeacher from '~/components/organisim/templatesUsers/teachers/DashboardTeacher.vue'

import { useTaskStore } from '~/stores/task.store'; 
const taskStore = useTaskStore()

const userType = computed(() => taskStore.getTask('userType'))


watch(userType, (newUserType) => {
    console.log(taskStore.getTask('userType'))
})

</script>