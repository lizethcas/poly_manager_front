<template>
  <div class="p-4">
    <div class="flex justify-between items-center mb-6">
      <h3 class="text-2xl font-bold">Students</h3>
      <button 
        class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        @click="openAddStudentModal"
      >
        Add Student
      </button>
    </div>

    <!-- Students List -->
    <div class="grid gap-4">
      <div v-if="students.length === 0" class="text-gray-500 text-center py-8">
        No students enrolled in this course yet.
      </div>
      
      <div v-else v-for="student in students" :key="student.id" 
        class="bg-white p-4 rounded-lg shadow flex justify-between items-center">
        <div class="flex items-center gap-4">
          <img 
            :src="student.avatar || '/default-avatar.png'" 
            :alt="student.name"
            class="w-12 h-12 rounded-full object-cover"
          >
          <div>
            <h4 class="font-semibold">{{ student.name }}</h4>
            <p class="text-sm text-gray-600">{{ student.email }}</p>
          </div>
        </div>
        
        <div class="flex gap-2">
          <button 
            class="text-gray-600 hover:text-blue-500"
            @click="editStudent(student)"
          >
            Edit
          </button>
          <button 
            class="text-gray-600 hover:text-red-500"
            @click="removeStudent(student.id)"
          >
            Remove
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Student {
  id: string;
  name: string;
  email: string;
  avatar?: string;
}

const route = useRoute();
const courseId = route.params.courseId;

// Mock data - Replace with your actual data fetching logic
const students = ref<Student[]>([
  {
    id: '1',
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=John'
  },
  {
    id: '2',
    name: 'Jane Smith',
    email: 'jane@example.com',
    avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Jane'
  }
]);

const openAddStudentModal = () => {
  // Implement your add student logic
  console.log('Open add student modal');
};

const editStudent = (student: Student) => {
  // Implement your edit student logic
  console.log('Edit student:', student);
};

const removeStudent = (studentId: string) => {
  // Implement your remove student logic
  console.log('Remove student:', studentId);
};
</script> 