<template>
    <div>
        <h1>List of Scenarios</h1>
        <ul>
            <li v-for="scenario in scenarios" :key="scenario.id">
                <button @click="openPopup(scenario)">{{ scenario.name }}</button>
            </li>
        </ul>
        <div v-if="isPopupOpen" class="popup">
            <PracticeScenario :scenario="selectedScenario" />
            <button @click="closePopup">Cerrar</button>
        </div>
    </div>
</template>

<script>
import axiosInstance from '../../services/axios.config';
import PracticeScenario from './PracticeScenario.vue';

export default {
    components: {
        PracticeScenario
    },
    data() {
        return {
            scenarios: [],
            isPopupOpen: false,
            selectedScenario: {}
        };
    },
    created() {
        this.fetchScenarios();
    },
    methods: {
        async fetchScenarios() {
            try {
                const response = await axiosInstance.get('scenarios/');
                this.scenarios = response.data; // Axios ya procesa la respuesta JSON automáticamente
            } catch (error) {
                console.error('Error al obtener los escenarios:', error);
            }
        },
        openPopup(scenario) {
            this.selectedScenario = scenario;
            this.isPopupOpen = true;
        },
        closePopup() {
            this.isPopupOpen = false;
            this.selectedScenario = {};
        }
    }
};
</script>