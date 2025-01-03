<template>
  <NuxtLayout>
    <div class="min-h-screen bg-gray-50 flex">
    
      <div class="h-fit px-1 fixed top-0 right-0 lg:z-0 z-10 flex flex-row gap-2 w-full bg-white py-4 rounded-md items-center lg:hidden border-b border-gray-200">
        <Icon
          @click="toggleSidebar"
          name="material-symbols-light:menu"
          size="24"
          class="text-tarawera-600 group-hover:text-fuscous-gray-600"
        />
        <SearchInput class="pr-4 m-auto" />
      </div>

      <!-- Sidebar -->
      <div
        :class="`${
          isSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 w-48 lg:w-64 bg-white shadow-sm fixed h-full transition-transform duration-300 ease-in-out lg:z-0 z-10`"
      >
        <!-- Logo section -->
        <div class="px-6 py-4 border-b">
          <NuxtLink class="flex items-center">
            <span class="text-[#478ADF] font-bold text-md">PolyAcademy</span>
          </NuxtLink>
        </div>

        <!-- Navigation Links -->
        <nav class="mt-6">
          <div class="px-4 space-y-2">
            <!--   <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            :class="{ 'bg-blue-50 text-blue-600': $route.path === '/dashboard' }"
                            @click="navigateToDashboard('student')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Student
                        </NuxtLink>
                        <NuxtLink to="/dashboard"
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                            :class="{ 'bg-blue-50 text-blue-600': $route.path === '/dashboard' }"
                            @click="navigateToDashboard('teacher')">
                            <span class="mr-3">
                                <i class="fas fa-home"></i>
                            </span>
                            Dashboard Teacher
                        </NuxtLink> -->
            <NuxtLink
              to="/courses"
              class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
              @click="navigateToDashboard('student')"
            >
              <span class="">
                <i class="fas fa-book"></i>
              </span>
              Courses estudents
            </NuxtLink>
            <NuxtLink
              to="/courses"
              class="flex items-start text-gray-700 hover:bg-gray-100 rounded-md"
              @click="navigateToDashboard('teacher')"
            >
              <span class="">
                <i class="fas fa-book"></i>
              </span>
              Courses teacher
            </NuxtLink>
            <!--  <NuxtLink 
                            class="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md">
                            <span class="mr-3">
                                <i class="fas fa-users"></i>
                            </span>
                            Students
                        </NuxtLink> -->
            <!-- Add more menu items as needed -->

            
             <div @click="openListSceneariosPopup" class="cursor-pointer">List Scenearios</div>
             <div @click="openScenarioPopup" class="cursor-pointer">Scenario</div>
             <div @click="openTextToFormatPopup" class="cursor-pointer">Text to format</div>
             <div @click="openImgCropPopup" class="cursor-pointer">Img Crop</div>
             <div @click="openImgGenPopup" class="cursor-pointer">Img Gen</div>
             <div @click="openImgBanckPopup" class="cursor-pointer">Img Banck</div>
          </div>
        </nav>
      </div>

      <!-- Overlay for mobile -->
      <div
        v-if="isSidebarOpen"
        @click="toggleSidebar"
        class="fixed inset-0 z-0 lg:hidden"
      ></div>

      <!-- Main Content Area -->
      <div class="flex-1 lg:ml-64 ">
        <!-- Header -->
        <header class="bg-white shadow-sm"></header>

        <!-- Main Content -->
        <main class="max-w-7xl mx-auto lg:px-4 py-6">
          <NuxtPage />
        </main>
      </div>
    </div>

    <div v-if="isPopupOpen" class="popup-overlay" @click="closePopup">
      <div class="popup-content" @click.stop>
        <ListScenearios />
        <button @click="closePopup">Cerrar</button>
      </div>
    </div>

    <div v-if="isScenarioPopupOpen" class="popup-overlay" @click="closeScenarioPopup">
      <div class="popup-content overflow-y-auto max-h-[80vh]" @click.stop>
        <ScenarioIA />
        <button @click="closeScenarioPopup">Cerrar</button>
      </div>
    </div>

    <div v-if="isTextToFormatPopupOpen" class="popup-overlay" @click="closeTextToFormatPopup">
      <div class="popup-content overflow-y-auto max-h-[80vh]" @click.stop>
        <TextToFormat />
        <button @click="closeTextToFormatPopup" class="close-button">
          Cerrar
        </button>
      </div>
    </div>

    <div v-if="isImgCropPopupOpen" class="popup-overlay" @click="closeImgCropPopup">
      <div class="popup-content" @click.stop>
        <ImgCrop />
        <button @click="closeImgCropPopup">Cerrar</button>
      </div>
    </div>

    <div v-if="isImgGenPopupOpen" class="popup-overlay" @click="closeImgGenPopup">
      <div class="popup-content" @click.stop>
        <ImgGen />
        <button @click="closeImgGenPopup">Cerrar</button>
      </div>
    </div>

    <div v-if="isImgBanckPopupOpen" class="popup-overlay" @click="closeImgBanckPopup">
      <div class="popup-content" @click.stop>
        <ImgBanck />
        <button @click="closeImgBanckPopup">Cerrar</button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import { useTaskStore } from "~/stores/task.store";
import { ref } from "vue";
import ListScenearios from '~/components/atomos/ListScenearios.vue';
import ScenarioIA from '~/components/atomos/ScenarioIA.vue';
import TextToFormat from '~/components/atomos/TextToFormat.vue';
import ImgCrop from '~/components/atomos/ImgCrop.vue';
import ImgGen from '~/components/atomos/ImgGen.vue';
import ImgBanck from '~/components/atomos/ImgBanck.vue';
const taskStore = useTaskStore();
const isSidebarOpen = ref(false);
const isPopupOpen = ref(false);
const isScenarioPopupOpen = ref(false);
const isTextToFormatPopupOpen = ref(false);
const isImgCropPopupOpen = ref(false);
const isImgGenPopupOpen = ref(false);
const isImgBanckPopupOpen = ref(false);

const toggleSidebar = () => {
  isSidebarOpen.value = !isSidebarOpen.value;
};

const navigateToDashboard = (userType: string) => {
  taskStore.addTask("userType", userType);
  // Close sidebar on mobile after navigation
  isSidebarOpen.value = false;
};

const openListSceneariosPopup = () => {
  isPopupOpen.value = true;
  isScenarioPopupOpen.value = false;
};

const openScenarioPopup = () => {
  isScenarioPopupOpen.value = true;
  isPopupOpen.value = false;
};

const openTextToFormatPopup = () => {
  isTextToFormatPopupOpen.value = true;
  isPopupOpen.value = false;
};

const openImgCropPopup = () => {
  isImgCropPopupOpen.value = true;
  isPopupOpen.value = false;
};

const openImgGenPopup = () => {
  isImgGenPopupOpen.value = true;
  isPopupOpen.value = false;
};

const openImgBanckPopup = () => {
  isImgBanckPopupOpen.value = true;
  isPopupOpen.value = false;
};

const closeImgBanckPopup = () => {
  isImgBanckPopupOpen.value = false;
};

const closePopup = () => {
  isPopupOpen.value = false;
};

const closeScenarioPopup = () => {
  isScenarioPopupOpen.value = false;
};

const closeTextToFormatPopup = () => {
  isTextToFormatPopupOpen.value = false;
};

const closeImgCropPopup = () => {
  isImgCropPopupOpen.value = false;
};

const closeImgGenPopup = () => {
  isImgGenPopupOpen.value = false;
};

</script>

<style scoped>
.popup-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.popup-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}
</style>
