<template>

    <div class="rounded-lg  w-full border-fresh-green border-2 text-center mt-2 p-3 ">
        <button class="flex flex-col items-center justify-center cursor-pointer w-fit m-auto" @click="emit('handleAdd')"
            aria-label="Agregar nuevo curso">
            <img src="../assets/images/add.webp" alt="Ícono para agregar un nuevo curso" role="img" />
            <p class="text-fresh-green pt-2">{{ homeData.buttom }}</p>
        </button>
    </div>

    

</template>

<script lang="ts" setup>
import homeData from '~/data/home.data';
const emit = defineEmits(['handleAdd']);


/* const isOpen = ref(false)

const openModal = () => {
    isOpen.value = true;
};

const closeModal = () => {
    isOpen.value = false;
};
 */
</script>