<template>
    <div>
        <h1>List of Scenarios</h1>
        <ul>
            <li v-for="scenario in scenarios" :key="scenario.id">
                <button @click="openPopup(scenario)">{{ scenario.id }}</button>
            </li>
        </ul>
        <div v-if="isPopupOpen" class="popup">
            <PracticeScenario :scenario="selectedScenario" />
            <button @click="closePopup">Close</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import { useQuery } from '@tanstack/vue-query';
import { get } from '~/services/routes.api';
import { apiRoutes } from '~/services/routes.api';
import PracticeScenario from '~/components/organisim/templatesUsers/teachers/PracticeScenario.vue';

const isPopupOpen = ref(false);
const selectedScenario = ref({});

// Vue Query hook for fetching scenarios
const { data: scenarios } = useQuery({
  queryKey: ['scenarios'],
  queryFn: () => get(apiRoutes.scenarios.getAll)
});
console.log(scenarios);
const openPopup = (scenario) => {
  selectedScenario.value = scenario;
  isPopupOpen.value = true;
};

const closePopup = () => {
  isPopupOpen.value = false;
  selectedScenario.value = {};
};
</script>