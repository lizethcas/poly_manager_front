<template>
    <UAlert title="Error" description="Ha ocurrido un error al cargar los cursos. Por favor, intente nuevamente."
        color="red" variant="solid" icon="i-heroicons-exclamation-triangle">
        <template #footer>
            <UButton color="white" variant="solid" label="Reintentar" @click="$emit('refetch')" icon="i-heroicons-arrow-path" />
        </template>
    </UAlert>
</template>
<script setup lang="ts">
defineEmits(['refetch'])

interface Props {
    error: {}
    message: string
}


const error = defineProps<Props>()
</script>
