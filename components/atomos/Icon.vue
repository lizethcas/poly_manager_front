<template>
    <div >
        <Icon :name="name" :size="size" :class="color" class="cursor-pointer mt-1" @click="$emit('handleClick')" />
    </div>
</template>
<script setup lang="ts">
defineEmits(['handleClick']);

interface IconProps {
    size: number
    name: string
    color?: string
}

const { size, name, color = 'text-white' } = defineProps<IconProps>();

</script>