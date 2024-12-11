<template>
    <div>
        <h3 class="text-s font-bold text-tarawera-700 my-4">Interactive Activities:</h3>
        <select v-model="selectedComponent">
            <option value="table">Table</option>
            <option value="flashcards">Flashcards</option>
            <option value="accordion">Accordion</option>
            <option value="tabs">Tabs</option>  
            <option value="buttonStack">Button Stack</option>
            <option value="procces">Procces</option>
            <option value="timeLine">Time Line</option>
        </select>
        <InteractiveActivitiesTable v-if="selectedComponent === 'table'" />
        <InteractiveActivitiesFlashcards v-if="selectedComponent === 'flashcards'" />
        <InteractiveActivitiesAccordion v-if="selectedComponent === 'accordion'" />
        <InteractiveActivitiesTabs v-if="selectedComponent === 'tabs'" />
        <InteractiveActivitiesButtonStack v-if="selectedComponent === 'buttonStack'" />
        <InteractiveActivitiesProcces v-if="selectedComponent === 'procces'" />
        <InteractiveActivitiesTimeLine v-if="selectedComponent === 'timeLine'" />
    </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import InteractiveActivitiesTable from '~/components/organisim/InteractiveActivitiesTable.vue'  
import InteractiveActivitiesFlashcards from '~/components/organisim/InteractiveActivitiesFlashcards.vue'
import InteractiveActivitiesAccordion from '~/components/organisim/InteractiveActivitiesAccordion.vue'
import InteractiveActivitiesTabs from '~/components/organisim/InteractiveActivitiesTabs.vue'
import InteractiveActivitiesButtonStack from '~/components/organisim/InteractiveActivitiesButtonStack.vue'
import InteractiveActivitiesProcces from '~/components/organisim/InteractiveActivitiesProcces.vue'
import InteractiveActivitiesTimeLine from '~/components/organisim/InteractiveActivitiesTimeLine.vue'
const selectedComponent = ref('table');
</script>


