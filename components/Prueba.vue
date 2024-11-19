<template>
    <form @submit.prevent="submitForm">

        <!-- Recorre las etiquetas y crea los campos dinámicamente -->
        <div v-for="(item, index) in labels" :key="item.id">
            <MoleculeBaseInput v-model="form[transformedKey(item.label_name)]" :type="item.type"
                :title="item.label_name" />
            <div v-if="showExtraElements && index === 1">
                <div class="flex gap-4">
                    <div v-for="(categoryOrLevel, index) in combinedOptions" :key="index" class="flex-1">
                        <SelectAtom :options="categoryOrLevel.options" :title="categoryOrLevel.title" />
                    </div>
                </div>
            </div>
        </div>



        <!-- Botón para guardar -->
        <MoleculeButtonGroup @handle-save="handleSave" />
    </form>
</template>

<script setup>
import { reactive, toRaw } from 'vue';
import { labels } from '~/data/cardModal';

// Función para transformar las claves
const transformedKey = (key) => {
    return key.toLowerCase().replace(/\s+/g, '_');
};

// Inicializa `form` dinámicamente con los campos de `labels`, pero transformando las claves
const form = reactive({});

// Inicializa los campos en `form` usando las claves transformadas
labels.forEach(label => {
    const transformedKeyLabel = transformedKey(label.label_name);
    form[transformedKeyLabel] = '';
});

// Manejo del evento `submit` del formulario
const submitForm = () => {
    // Recorre los campos y valida los obligatorios
    for (const item of labels) {
        const transformedKeyLabel = transformedKey(item.label_name);
        if (item.required && !form[transformedKeyLabel].trim()) {
            alert(`El campo "${item.label_name}" es obligatorio.`);
            return;
        }
    }

    // Muestra el formulario con las claves transformadas (ya en minúsculas con guiones bajos)
    console.log('Formulario enviado:', toRaw(form));
};

// Manejo del evento `handle-save`
const handleSave = () => {
    submitForm();
};
</script>
