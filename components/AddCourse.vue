<template>
    <!-- no esta funcionando -->
    <div @click="isOpen = true"
        class="rounded-lg cursor-pointer w-full border-fresh-green border-2 text-center mt-2 p-3 flex flex-col items-center justify-center">
        <button class="">
            <img src="../assets/images/add.webp" alt="Agregar nuevo curso">
            <p class="text-fresh-green pt-2">{{ homeData.buttom }}</p>
        </button>

    </div>
    <UModal v-model="isOpen">
        <div class="p-4">
            <Placeholder class="h-48" />
        </div>
    </UModal>
</template>

<script lang="ts" setup>
import homeData from '~/data/home.data';
const isOpen = ref(false)

</script>