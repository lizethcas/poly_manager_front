<template>
    <!-- no esta funcionando -->
    <AddCourseButton @handleAdd="handleAdd" />
    
</template>

<script lang="ts" setup>
import homeData from '~/data/home.data';
const isOpen = ref(false)

const handleAdd = () => {
    console.log('click');
}
</script>