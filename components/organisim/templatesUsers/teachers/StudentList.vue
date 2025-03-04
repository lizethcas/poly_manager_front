<template>
  <div class="bg-white rounded-md p-4 h-screen my-5">
    <button @click="$emit('close')">Close</button>
    <UTable :columns="columns" :rows="students">
      <template #functions-data="{ row }">
        <div class="flex space-x-2">
          <UButton color="gray" variant="ghost" icon="i-heroicons-pencil-square-20-solid" @click="handleEdit(row)" />
          <UButton color="gray" variant="ghost" icon="i-heroicons-trash-20-solid" @click="handleDelete(row)" />
          <UButton color="gray" variant="ghost" icon="i-heroicons-eye-20-solid" @click="handleView(row)" />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

interface Students {
  id: number;
  user_username: string;
  user_email: string;
  profile_picture: string;
  phone: string;
  created_at: string;
}

const props = defineProps<{
  students: Students[];
}>();

defineEmits<{
  (e: "close"): void;
}>();

const columns = [
  {
    key: "user_username",
    label: "Name",
    sortable: true,
  },
  {
    key: "created_at",
    label: "Starting date",
    sortable: true,
  },
  {
    key: "functions",
    label: "Functions",
  },
];

const handleEdit = (row: Students) => {
  console.log('Edit:', row);
  // Aquí puedes agregar la lógica para editar el estudiante
};

const handleDelete = (row: Students) => {
  console.log('Delete:', row);
  // Aquí puedes agregar la lógica para eliminar el estudiante
};

const handleView = (row: Students) => {
  console.log('View:', row);
  // Aquí puedes agregar la lógica para ver los detalles del estudiante
};
</script>