<template>
  <div class="max-w-sm rounded-lg overflow-hidden shadow-lg bg-white">
    <!-- Course Image -->
    <div class="relative h-48">
      <img 
        :src="course.imageUrl" 
        class="w-full h-full object-cover"
        alt="Course cover"
      />
    </div>

    <!-- Course Content -->
    <div class="p-6">
      <!-- Course Type and Level -->
      <div class="flex items-center gap-2 mb-2">
        <span class="bg-gray-100 px-3 py-1 rounded-full text-sm">
          {{ course.type }}
        </span>
        <div class="flex items-center gap-1">
          <span class="w-6 h-6 flex items-center justify-center rounded-full bg-green-100 text-green-600 text-sm">
            {{ course.level }}
          </span>
          <span class="text-green-600 text-sm">
            {{ course.levelName }}
          </span>
        </div>
      </div>

      <!-- Course Title -->
      <h2 class="text-2xl font-bold text-gray-800 mb-3">
        {{ course.title }}
      </h2>

      <!-- Course Description -->
      <p class="text-gray-600 mb-6">
        {{ course.description }}
      </p>

      <!-- Action Button -->
      <button class="w-full bg-teal-400 hover:bg-teal-500 text-white font-medium py-2 px-4 rounded-lg transition-colors">
        Learn more & enroll
      </button>

      <!-- Course Features -->
      <div class="flex items-center justify-between mt-6 pt-6 border-t border-gray-200">
        <div class="flex items-center gap-2">
          <div class="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
              <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
            </svg>
          </div>
          <span class="text-sm text-gray-600">{{ course.lessonCount }} Video Lessons</span>
        </div>

        <div class="flex items-center gap-2">
          <div class="text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-2 0a6 6 0 11-12 0 6 6 0 0112 0zm-8 2a1 1 0 100-2 1 1 0 000 2zm0 2a3 3 0 100-6 3 3 0 000 6z" />
            </svg>
          </div>
          <span class="text-sm text-gray-600">Constant Assistance</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Course {
  imageUrl: string;
  type: string;
  level: string;
  levelName: string;
  title: string;
  description: string;
  lessonCount: number;
}

defineProps<{
  course: Course;
}>();
</script>