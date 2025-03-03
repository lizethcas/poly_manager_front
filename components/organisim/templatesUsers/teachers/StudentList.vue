<template>
  <div class="bg-white rounded-md p-4">
    <button @click="$emit('close')">Close</button>
    <UTable :columns="columns" :rows="students" />

   <!--  <h1>{{students}}</h1> -->
  </div>
  
</template>

<script lang="ts" setup>
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
console.log(props.students);

defineEmits<{
  (e: "close"): void;
}>();

const functions = [
  {
    id: 1,
    name: "Edit",
  },
  {
    id: 2,
    name: "Delete",
  },
  {
    id: 3,
    name: "View",
  },
];
const algo ="algo"

const columns = [
  
  {
    key: "user_username",
    label: "Name",
    sortable: true,
  },
 
  {
    key: "created_at",
    label: "Starting date ",
    sortable: true,
    
  },
  {
    key: "algo",
    label: "Functions",
  },
];


</script>
