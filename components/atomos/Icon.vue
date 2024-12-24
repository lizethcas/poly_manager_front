<template>
    <div class="bg-gray-200 rounded-md p-1 flex items-center justify-center">
        <Icon :name="name" :size="size" class="text-gray-500 cursor-pointer" @click="$emit('handleClick')" />
    </div>
</template>
<script setup lang="ts">
defineEmits(['handleClick']);

interface IconProps {
    size: number
    name: string
}

const { size, name } = defineProps<IconProps>();

</script>