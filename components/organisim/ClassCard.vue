<template>
    <p v-if="!classes" class="text-title-color">No hay clases</p>
    <main v-if="filteredClasses.length > 0" v-for="(classItem, index) in filteredClasses" :key="classItem.id" class="py-4"
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
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useGetCover } from '~/composables/useGetcover';
import type { ClassData } from '~/interfaces/models/class.interface..model';
const route = useRoute()

const courseId = route.params.courseId as string
// Define props
const props = defineProps<{
    classes: ClassData[]
}>();

// Add computed property for filtered classes
const filteredClasses = computed(() => {
    return props.classes.filter(classItem => classItem.course_id == courseId)
})

const classesRef = ref(props.classes);

const { getCoverUrl } = useGetCover();
const routeCourseId = useRoute().params.courseId as string;
const { onDragOver, onDrop, onDragStart } = useDragAnDrop(classesRef);

const openModalHandler = () => {
    console.log('open modal');
};

const handlePreviewClick = (classId: number | undefined, courseId: number | undefined) => {
    if (classId && courseId) {
        navigateTo(`/course/${courseId}/class/${classId}`);
    } else {
        console.error('Class ID or Course ID is undefined');
    }
}
</script>