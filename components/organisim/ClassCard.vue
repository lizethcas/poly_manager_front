<template>
    <p v-if="!classes" class="text-title-color">cargando</p>
    <main v-if="classes.length > 0 " v-for="classItem in classes.slice().reverse()" class="py-4">
        <div class="flex items-center cursor-grab hover:cursor-grabbing" >
            <div class="flex items-center   w-32 h-32">
                <div>
                    <Icon name="mingcute:dots-fill" size="40" class="text-gray-500" @dragstart="onDragStart"/>
                </div>

                <div class="rounded-xl cursor-pointer w-max-32">
                    <img v-if="classItem.cover" :src="getCoverUrl(classItem.cover)" alt=""
                        class="rounded-3xl object-contain  w-full h-auto m-1" />
                </div>
            </div>
            <div class="mx-4">
                <p class="text-xl font-bold text-primary-color">{{ classItem.class_name }}</p>
                <div class="flex items-center gap-2 border border-gray-500 rounded-full p-2 w-fit mb-2">
                    <Icon name="material-symbols-light:check" size="24" class="text-gray-500" />
                    <p>12/30</p>
                </div>

                <div class="flex items-center gap-2">
                    <AtomosButtonAtom :type="'edit'" :size="'24px'" @handleClick="openModalHandler" />
                    <AtomosButtonAtom :type="'preview'" :size="'24px'" @handleClick="handlePreviewClick(classItem.id, routeCourseId)" />
                </div>



            </div>

        </div>
    </main>
    <!-- Aquí puedes acceder a `classes` y `loading` de forma reactiva -->
</template>

<script setup lang="ts">
import { onMounted } from 'vue';
import { toRefs } from 'vue';
import { useClassStore } from '~/stores/class.store';
import { useGetUrl } from '~/composables/useGetUrl';
import {ApiService} from '~/services/create.course.api';
import type { ClassData } from '~/interfaces/models/class.interface..model';

import { navigateTo } from '#app';

// Extraemos las propiedades reactivas del store
const { getCoverUrl } = useGetUrl();
const classStore = useClassStore();
const { classes, loading } = toRefs(classStore);
const routeCourseId = useRoute().params.courseId as string;
console.log(routeCourseId);

onMounted(async () => {
    classStore.loading = true; // Marcamos como cargando
    const apiService = new ApiService();
    try {
        const fetchedClasses = await apiService.getCourseById(Number(routeCourseId));
        classStore.setClasses(fetchedClasses as ClassData[]); // Actualizamos el store
    } catch (error) {
        console.error('Error fetching classes', error);
    } finally {
        classStore.loading = false; // Terminamos de cargar
    }
});

const onDragStart = (event: DragEvent) => {
    // Aquí puedes manejar el inicio del arrastre, por ejemplo, cambiar el estilo o estado
    event.dataTransfer?.setData('text', 'Esto es un drag');
};

const openModalHandler = () => {
    console.log('open modal');
    // Add your modal logic here
};

const handlePreviewClick = (classId: number | undefined, courseId: number | undefined) => {
  if (classId && courseId) {
    navigateTo(`/course/${courseId}/class/${classId}`);
  } else {
    console.error('Class ID or Course ID is undefined');
  }
}
</script>