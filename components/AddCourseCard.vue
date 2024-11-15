<template>
    <form class="p-4 max-w-5xl m-auto">
        <div>
            <div class="flex items-center gap-4 mb-4">
                <label for="" class="min-w-[120px]">Cover:</label>
                <UInput type="file" size="xl" icon="i-heroicons-folder" class="w-full" />
            </div>

            <div class="flex items-center gap-4 mb-4 w-full">
                <label for="" class="min-w-[120px]">Lesson Title:</label>
                <UInput type="text" size="xl" class="flex-grow" />
            </div>
            <div class="flex items-center gap-4 mb-4">
                <label for="" class="min-w-[120px]"></label>
                <UTextarea color="white" variant="outline" placeholder="Description" class="w-full" />
            </div>

            <div class="flex items-start gap-4 my-4">
                <label for="" class="min-w-[120px]">Bullet Points:</label>
                <div class="flex flex-col w-full gap-4">
                    <UInput type="text" size="xl" class="w-full" />
                    <UInput type="text" size="xl" class="w-full" />
                </div>
            </div>

            <div class="flex items-start gap-4 my-4">
                <div class="min-w-[120px]"></div>
                <div
                    class="flex justify-center items-center gap-2 bg-light-grayish-blue py-2 cursor-pointer w-full transform hover:scale-100 hover:shadow-lg active:scale-95 active:shadow-sm transition-all duration-300">
                    <img src="../assets/images/add.webp" alt="" class="w-2">
                    <p class="text-fresh-green">Add a bullet Point</p>
                </div>
            </div>
        </div>


        <div class="flex justify-center gap-4 mt-6">
            <div class="min-w-[120px]"></div>
            <div class="w-full flex justify-center gap-4 ">
                <UButton color="gray" variant="outline" class="w-1/3 mx-2 flex justify-center items-center text-center">
                    Cancelar
                </UButton>
                <UButton color="blue" variant="solid" class="w-1/3 flex justify-center items-center text-center">
                    Guardar
                </UButton>
            </div>


        </div>
    </form>

  

</template>

<script lang="ts" setup>



</script>