<template>

    <div class="rounded-lg  w-full border-fresh-green border-2 text-center mt-2 p-3 ">
        <div class="flex flex-col items-center justify-center cursor-pointer w-fit m-auto" @click="isOpen = true">
            <img src="../assets/images/add.webp" alt="Agregar nuevo curso">
            <p class="text-fresh-green pt-2">{{ homeData.buttom }}</p>
        </div>

    </div>



    


</template>

<script lang="ts" setup>
import homeData from '~/data/home.data';
const isOpen = ref(false)

</script>