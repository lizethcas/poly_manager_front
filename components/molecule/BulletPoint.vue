<template>
    <div class="flex items-start gap-4 my-4">
        <div class="min-w-[120px]"></div>
        <button @click="addBulletPoint"
            class="flex justify-center items-center gap-2 bg-light-grayish-blue py-2 cursor-pointer w-full transform hover:scale-80 hover:shadow-lg active:scale-100 active:shadow-sm transition-all duration-300">
            <img src="../../assets/images/add.webp" alt="add a bullet point" class="w-5">
            <p class="text-primary-color">Add a bullet Point</p>
        </button>
    </div>


</template>

<script lang="ts" setup>
const emit = defineEmits(['addBulletPoint'])

const addBulletPoint = () => {
    emit('addBulletPoint');
};



</script>
