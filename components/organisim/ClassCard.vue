<template>
    <p v-if="!classes" class="text-title-color">cargando</p>
    <main v-if="classes.length > 0" v-for="(classItem, index) in classes.slice().reverse()" :key="classItem.id" class="py-4"
        draggable="true" @dragstart="onDragStart($event, index)" @dragover="onDragOver($event)"
        @drop="onDrop($event, index)">
        <div class="flex items-center cursor-grab hover:cursor-grabbing">
            <div class="flex items-center w-32 h-32">
                <div>
                    <Icon name="mingcute:dots-fill" size="40" class="text-gray-500" />
                </div>
                <div class="rounded-xl cursor-pointer w-max-32">
                    <img v-if="classItem.cover" :src="getCoverUrl(classItem.cover)" alt=""
                        class="rounded-3xl object-contain w-full h-auto m-1" />
                </div>
            </div>
            <div class="mx-4">
                <p class="text-md font-bold text-primary-color">{{ classItem.class_name }}</p>
                <div class="flex text-xs items-center gap-2 border border-gray-500 rounded-full p-1 w-fit mb-2">
                    <Icon name="material-symbols-light:check" size="14" class="text-gray-500" />
                    <p class="text-xs px-1">12/30</p>
                </div>

                <div class="flex items-center gap-2">
                    <AtomosButtonAtom :type="'edit'" :size="'24px'"
                        @handleClick="handlePreviewClick(classItem.id, Number(routeCourseId))" />
                    <AtomosButtonAtom :type="'preview'" :size="'24px'" @handleClick="openModalHandler" />
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
import { useDragAnDrop } from '~/composables/useDragAndDrop';
import { ApiService } from '~/services/create.course.api';
import type { ClassData } from '~/interfaces/models/class.interface..model';

import { navigateTo } from '#app';
import { classesData } from '~/data/classes.data';

// Extraemos las propiedades reactivas del store
const { getCoverUrl } = useGetCover();
const classStore = useClassStore();
const { classes, loading } = toRefs(classStore);
const routeCourseId = useRoute().params.courseId as string;
const { onDragOver, onDrop, onDragStart } = useDragAnDrop(classes);

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
/* aun no esta implementado */
/* const onDragStart = (event: DragEvent, index: number) => {
    event.dataTransfer?.setData('index', index.toString()); // Guardamos el índice del elemento arrastrado
};

const onDragOver = (event: DragEvent) => {
    event.preventDefault(); // Necesario para que el drop funcione
};

const onDrop = (event: DragEvent, targetIndex: number) => {
    const draggedIndex = Number(event.dataTransfer?.getData('index'));
    if (draggedIndex !== targetIndex) {
        const draggedItem = classes.value[draggedIndex];
        classes.value.splice(draggedIndex, 1);
        classes.value.splice(targetIndex, 0, draggedItem); // Insertamos el elemento arrastrado en la nueva posición
    }
}; */
/* aun no esta implementado */
const openModalHandler = () => {
    console.log('open modal');

};

const handlePreviewClick = (classId: number | undefined, courseId: number | undefined) => {
    console.log(classId, courseId);
    if (classId && courseId) {
        navigateTo(`/course/${courseId}/class/${classId}`);
    } else {
        console.error('Class ID or Course ID is undefined');
    }
}
</script>