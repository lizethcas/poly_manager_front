<template>
  <div class="bg-white rounded-md p-4 h-screen my-5">
    <button @click="$emit('close')">Close</button>
    <UTable :columns="columns" :rows="students">
      <template #functions-data="{ row }">
        <div class="flex space-x-2">
          <Icon
            :name="IconType.block"
            :size="20"
            color="text-blue-500"
            @handleClick="handleEdit(row)"
          />
          <Icon
            :name="IconType.content"
            :size="20"
            color="text-blue-500"
            @handleClick="handleView(row)"
          />
          <Icon
            :name="IconType.delete"
            :size="20"
            color="text-blue-500"
            @handleClick="handleDelete(row)"
          />
        </div>
      </template>
    </UTable>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import Icon from '~/components/atomos/Icon.vue';
import { IconType } from '~/data/iconsType';

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