<template>
    <ul
        class="fixed text-center rounded-md p-2 flex w-[80%] mx-auto justify-evenly bottom-14 shadow-lg bg-white left-0 right-0">
        <li v-for="icon in icons" :key="icon.name" class="flex flex-col items-center" @click="$emit('open-modal', icon.label, icon.name)">
            <Icon :name="icon.name" size="30" class="text-primary-color hover:text-tarawera-700 cursor-pointer" />
            <p class="text-sm text-primary-color hover:text-tarawera-700 cursor-pointer max-w-14">{{ icon.label }}</p>
        </li>
    </ul>
</template>
<script setup lang="ts">

const icons = [
    {
        name: 'tabler:layout-filled',
        label: 'Layout block' 
    },
    {
        name: 'mingcute:video-fill',
        label: 'Video layout'
    },
    {
        name: 'fluent:text-add-20-filled',
        label: 'Text block'
    },
    {
        name: 'typcn:info',
        label: 'Info block'
    },
    {
        name: 'mage:archive-fill',
        label: 'SCORM file'
    },
    {
        name: 'solar:gallery-bold',
        label: 'Gallery layout'
    },
    {
        name: 'mingcute:ai-fill',
        label: 'AI chat'
    },
    {
        name: 'mdi:multimedia',
        label: 'Multimedia block'
    },
    {
        name: 'game-icons:click',
        label: 'Interactive activities'
    },
    {
        name: 'ph:student-fill',
        label: 'Knowledge check'
    },
    {
        name: 'ph:list-fill',
        label: 'Word list'
    },
    {
        name: 'material-symbols-light:table',
        label: 'Table'
    },
    {
        name: 'bxs:ruler',
        label: 'Dividers'
    },
    {
        name: 'icon-park-solid:down-c',
        label: 'Continue'
    }
]

</script>