<template>
  <div class="p-4">
    
   <!-- Classes List -->
    <div class="grid gap-4">
      <div v-if="classes.length === 0" class="text-gray-500 text-center py-8">
        No classes scheduled for this course yet.
      </div>
      
      <div v-else v-for="class_ in classes" :key="class_.id" 
        class="bg-white p-4 rounded-lg shadow">
        <div class="flex justify-between items-start">
          <div>
            <h4 class="font-semibold text-lg">{{ class_.title }}</h4>
            <p class="text-gray-600 mt-1">{{ class_.description }}</p>
            
            <div class="mt-3 flex gap-4 text-sm">
              <div class="flex items-center gap-1">
                <i class="fas fa-calendar text-gray-400"></i>
                <span>{{ formatDate(class_.date) }}</span>
              </div>
              <div class="flex items-center gap-1">
                <i class="fas fa-clock text-gray-400"></i>
                <span>{{ class_.duration }} minutes</span>
              </div>
            </div>
          </div>
          
          <div class="flex gap-2">
            <button 
              class="text-gray-600 hover:text-blue-500"
              @click="editClass(class_)"
            >
              Edit
            </button>
            <button 
              class="text-gray-600 hover:text-red-500"
              @click="removeClass(class_.id)"
            >
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Class {
  id: string;
  title: string;
  description: string;
  date: Date;
  duration: number;
}

const route = useRoute();
const courseId = route.params.courseId;

// Mock data - Replace with your actual data fetching logic
const classes = ref<Class[]>([
  {
    id: '1',
    title: 'Introduction to the Course',
    description: 'Overview of what we will learn in this course',
    date: new Date('2024-03-20T10:00:00'),
    duration: 60
  },
  {
    id: '2',
    title: 'Basic Concepts',
    description: 'Understanding the fundamental concepts',
    date: new Date('2024-03-22T10:00:00'),
    duration: 90
  }
]);

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }).format(date);
};

const openAddClassModal = () => {
  // Implement your add class logic
  console.log('Open add class modal');
};

const editClass = (class_: Class) => {
  // Implement your edit class logic
  console.log('Edit class:', class_);
};

const removeClass = (classId: string) => {
  // Implement your remove class logic
  console.log('Remove class:', classId);
};
</script> 