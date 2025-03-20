<template>
  <div class="w-full max-w-3xl mx-auto p-4">
    <!-- Loading overlay -->
    <div v-if="isLoading" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-xl flex items-center">
        <svg class="animate-spin h-6 w-6 text-blue-500 mr-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <span>Loading your profile data...</span>
      </div>
    </div>

    <!-- Success/Error notifications -->
    <div 
      v-if="notification.show" 
      :class="[
        'fixed top-4 right-4 z-50 p-4 rounded-md shadow-lg max-w-sm transition-all duration-300',
        notification.type === 'success' ? 'bg-green-50 border-l-4 border-green-500' : 'bg-red-50 border-l-4 border-red-500'
      ]"
    >
      <div class="flex">
        <div :class="notification.type === 'success' ? 'text-green-500' : 'text-red-500'">
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" v-if="notification.type === 'success'">
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
          </svg>
          <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" v-else>
            <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
          </svg>
        </div>
        <div class="ml-3">
          <p :class="[
            'text-sm font-medium',
            notification.type === 'success' ? 'text-green-800' : 'text-red-800'
          ]">
            {{ notification.message }}
          </p>
        </div>
        <div class="ml-auto pl-3">
          <div class="-mx-1.5 -my-1.5">
            <button 
              @click="notification.show = false" 
              class="inline-flex rounded-md p-1.5" 
              :class="notification.type === 'success' ? 'text-green-500 hover:bg-green-100' : 'text-red-500 hover:bg-red-100'"
            >
              <span class="sr-only">Dismiss</span>
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="border border-[#e0e0ff] rounded-lg shadow-sm" v-if="!initialLoading">
      <!-- Basic Information Section -->
      <div class="p-6 relative">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">Basic information</h2>
          <button 
            v-if="!isEditingBasic" 
            @click="startEditingBasic" 
            class="text-blue-500 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
        
        <div class="grid md:grid-cols-[1fr_auto] gap-6">
          <!-- View Mode -->
          <div v-if="!isEditingBasic" class="space-y-4">
            <div v-if="basicInfoLoadingError" class="bg-red-50 p-4 rounded-md text-sm text-red-700">
              <p>There was an error loading your profile information. Please try again later.</p>
              <button @click="fetchUserProfile" class="mt-2 text-blue-500 underline">Retry</button>
            </div>
            <div v-else>
              <div class="grid grid-cols-[100px_1fr] items-center">
                <span class="text-sm text-gray-500">Name:</span>
                <span>{{ basicInfo.name || "—" }}</span>
              </div>
              <div class="grid grid-cols-[100px_1fr] items-center">
                <span class="text-sm text-gray-500">Surname:</span>
                <span>{{ basicInfo.surname || "—" }}</span>
              </div>
              <div class="grid grid-cols-[100px_1fr] items-center">
                <span class="text-sm text-gray-500">Gender:</span>
                <span>{{ basicInfo.gender || "—" }}</span>
              </div>
              <div class="grid grid-cols-[100px_1fr] items-center">
                <span class="text-sm text-gray-500">Birthday:</span>
                <span>{{ basicInfo.birthday || "—" }}</span>
              </div>
              <div class="grid grid-cols-[100px_1fr] items-center">
                <span class="text-sm text-gray-500">Phone:</span>
                <span>{{ basicInfo.phone || "—" }}</span>
              </div>
            </div>
          </div>
          
          <!-- Edit Mode -->
          <div v-else class="space-y-4">
            <div class="grid grid-cols-[100px_1fr] items-center gap-2">
              <span class="text-sm text-gray-500">Name:</span>
              <input 
                v-model="editBasicInfo.name" 
                type="text" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full"
                placeholder="Enter your name"
              />
            </div>
            <div class="grid grid-cols-[100px_1fr] items-center gap-2">
              <span class="text-sm text-gray-500">Surname:</span>
              <input 
                v-model="editBasicInfo.surname" 
                type="text" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full"
                placeholder="Enter your surname"
              />
            </div>
            <div class="grid grid-cols-[100px_1fr] items-center gap-2">
              <span class="text-sm text-gray-500">Gender:</span>
              <select 
                v-model="editBasicInfo.gender" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full"
              >
                <option value="">Select gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="grid grid-cols-[100px_1fr] items-center gap-2">
              <span class="text-sm text-gray-500">Birthday:</span>
              <input 
                v-model="editBasicInfo.birthday" 
                type="date" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full"
              />
            </div>
            <div class="grid grid-cols-[100px_1fr] items-center gap-2">
              <span class="text-sm text-gray-500">Phone:</span>
              <input 
                v-model="editBasicInfo.phone" 
                type="tel" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full"
                placeholder="Enter your phone number"
              />
            </div>
            
            <div class="flex justify-end space-x-2 mt-4">
              <button 
                @click="cancelEditBasic" 
                class="px-4 py-2 border border-gray-300 rounded-md text-sm"
              >
                Cancel
              </button>
              <button 
                @click="saveBasicInfo" 
                class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm flex items-center"
                :disabled="basicInfoSaving"
              >
                <svg v-if="basicInfoSaving" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                {{ basicInfoSaving ? 'Saving...' : 'Save' }}
              </button>
            </div>
          </div>
          
          <div class="flex justify-center md:justify-end">
            <div class="relative w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <img 
                :src="profileImage || 'https://via.placeholder.com/96'" 
                alt="Profile avatar" 
                class="object-cover"
              />
              <div class="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-50 flex items-center justify-center transition-all">
                <button 
                  @click="triggerImageUpload" 
                  class="text-transparent hover:text-white"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </button>
                <input
                  ref="fileInput"
                  type="file"
                  accept="image/*"
                  class="hidden"
                  @change="handleImageUpload"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <hr class="border-gray-100" />
      
      <!-- Resto de secciones sin cambios mayores para mantener la longitud de la respuesta -->

      <!-- Login Information Section -->
      <div class="p-6 relative">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">Login information</h2>
          <button 
            v-if="!isEditingLogin" 
            @click="startEditingLogin" 
            class="text-blue-500 flex items-center text-sm"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit
          </button>
        </div>
        
        <!-- View Mode -->
        <div v-if="!isEditingLogin" class="space-y-4">
          <div class="grid grid-cols-[100px_1fr] items-center">
            <span class="text-sm text-gray-500">Email for login:</span>
            <span>{{ loginInfo.email }}</span>
          </div>
          <div class="grid grid-cols-[100px_1fr] items-center">
            <span class="text-sm text-gray-500">Phone for login:</span>
            <span>{{ loginInfo.phone || "—" }}</span>
          </div>
          <div class="grid grid-cols-[100px_1fr] items-center">
            <span class="text-sm text-gray-500">Password:</span>
            <span>{{ loginInfo.password }}</span>
          </div>
        </div>
        
        <!-- Edit Mode -->
        <div v-else class="space-y-4">
          <div class="grid grid-cols-[100px_1fr] items-center gap-2">
            <span class="text-sm text-gray-500">Email for login:</span>
            <input 
              v-model="editLoginInfo.email" 
              type="email" 
              class="border border-gray-300 rounded-md px-3 py-1 w-full"
              placeholder="Enter your email"
            />
          </div>
          <div class="grid grid-cols-[100px_1fr] items-center gap-2">
            <span class="text-sm text-gray-500">Phone for login:</span>
            <input 
              v-model="editLoginInfo.phone" 
              type="tel" 
              class="border border-gray-300 rounded-md px-3 py-1 w-full"
              placeholder="Enter your phone number"
            />
          </div>
          <div class="grid grid-cols-[100px_1fr] items-center gap-2">
            <span class="text-sm text-gray-500">Password:</span>
            <div class="relative w-full">
              <input 
                v-model="editLoginInfo.password" 
                :type="showPassword ? 'text' : 'password'" 
                class="border border-gray-300 rounded-md px-3 py-1 w-full pr-10"
                placeholder="Enter your password"
              />
              <button 
                @click="showPassword = !showPassword" 
                type="button" 
                class="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500"
              >
                <svg v-if="showPassword" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </button>
            </div>
          </div>
          
          <div class="flex justify-end space-x-2 mt-4">
            <button 
              @click="cancelEditLogin" 
              class="px-4 py-2 border border-gray-300 rounded-md text-sm"
            >
              Cancel
            </button>
            <button 
              @click="saveLoginInfo" 
              class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      <hr class="border-gray-100" />
      
      <!-- Social Login Section -->
      <div class="p-6 relative">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-medium">Social login</h2>
        </div>
        
        <div class="space-y-4">
          <!-- Google -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span class="text-red-500 font-bold">G</span>
              </div>
              <span>Google</span>
            </div>
            <div class="flex items-center justify-between flex-1 max-w-[70%]">
              <span class="text-sm ml-4">{{ socialAccounts.google.name }}</span>
              <button class="text-blue-500 text-sm">
                Unlink
              </button>
            </div>
          </div>
          
          <!-- Apple ID -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span class="font-bold">A</span>
              </div>
              <span>Apple ID</span>
            </div>
            <div class="flex items-center justify-between flex-1 max-w-[70%]">
              <span class="text-sm ml-4 text-gray-500">Account is not linked</span>
              <button class="text-blue-500 text-sm">
                Link
              </button>
            </div>
          </div>
          
          <!-- Yandex -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span class="text-red-500 font-bold">Y</span>
              </div>
              <span>Yandex</span>
            </div>
            <div class="flex items-center justify-between flex-1 max-w-[70%]">
              <span class="text-sm ml-4 text-gray-500">Account is not linked</span>
              <button class="text-blue-500 text-sm">
                Link
              </button>
            </div>
          </div>
          
          <!-- VK -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span class="text-blue-500 font-bold">VK</span>
              </div>
              <span>VK</span>
            </div>
            <div class="flex items-center justify-between flex-1 max-w-[70%]">
              <span class="text-sm ml-4 text-gray-500">Account is not linked</span>
              <button class="text-blue-500 text-sm">
                Link
              </button>
            </div>
          </div>
          
          <!-- Telegram -->
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-2">
              <div class="w-6 h-6 flex items-center justify-center bg-white rounded-full">
                <span class="text-blue-500 font-bold">T</span>
              </div>
              <span>Telegram</span>
            </div>
            <div class="flex items-center justify-between flex-1 max-w-[70%]">
              <span class="text-sm ml-4 text-gray-500">Account is not linked</span>
              <button class="text-blue-500 text-sm">
                Link
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Footer -->
      <div class="p-6 border-t border-gray-100 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
        <div>
          <p class="text-sm">
            You can <button class="text-red-500 underline">delete your profile</button>
          </p>
          <p class="text-xs text-gray-500">Along with personal data and course progress</p>
        </div>
      </div>
    </div>

    <!-- Estado de carga inicial -->
    <div v-else class="border border-[#e0e0ff] rounded-lg shadow-sm p-8 bg-gray-50">
      <div class="flex flex-col items-center justify-center space-y-4">
        <svg class="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
        <p class="text-gray-600">Loading your profile information...</p>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { ref, reactive, onMounted } from 'vue'

// Estado de carga inicial
const initialLoading = ref(true);
const isLoading = ref(false); // Para operaciones específicas
const basicInfoLoadingError = ref(false);
const basicInfoSaving = ref(false);
const loginInfoSaving = ref(false);

// Estados para manejo de notificaciones
const notification = reactive({
  show: false,
  type: 'success',
  message: '',
  timeout: null
});

// Muestra una notificación
function showNotification(type, message, duration = 3000) {
  // Limpiar timeout anterior si existe
  if (notification.timeout) {
    clearTimeout(notification.timeout);
  }
  
  // Configurar nueva notificación
  notification.type = type;
  notification.message = message;
  notification.show = true;
  
  // Establecer timeout para ocultarla automáticamente
  notification.timeout = setTimeout(() => {
    notification.show = false;
  }, duration);
}

// Basic Information
const basicInfo = ref({
  name: "",
  surname: "",
  gender: "",
  birthday: "",
  phone: ""
});

// Imagen de perfil
const profileImage = ref(null);
const fileInput = ref(null);

function triggerImageUpload() {
  fileInput.value.click();
}

function handleImageUpload(event) {
  const file = event.target.files[0];
  if (file) {
    isLoading.value = true;
    
    // Simulación de carga a API
    setTimeout(() => {
      const reader = new FileReader();
      reader.onload = (e) => {
        profileImage.value = e.target.result;
        isLoading.value = false;
        showNotification('success', 'Profile picture updated successfully');
      };
      reader.readAsDataURL(file);
    }, 1500);
  }
}

const isEditingBasic = ref(false);
const editBasicInfo = reactive({
  name: "",
  surname: "",
  gender: "",
  birthday: "",
  phone: ""
});

function startEditingBasic() {
  // Copy current values to edit form
  Object.assign(editBasicInfo, basicInfo.value);
  isEditingBasic.value = true;
}

function saveBasicInfo() {
  basicInfoSaving.value = true;
  
  // Simulación de llamada API
  setTimeout(() => {
    try {
      // Simular posible error aleatorio (10% de probabilidad)
      if (Math.random() < 0.1) {
        throw new Error('Network error while saving profile');
      }
      
      // Actualizar datos
      Object.assign(basicInfo.value, editBasicInfo);
      isEditingBasic.value = false;
      showNotification('success', 'Profile information updated successfully');
    } catch (error) {
      showNotification('error', error.message || 'Failed to save profile information');
    } finally {
      basicInfoSaving.value = false;
    }
  }, 1500);
}

function cancelEditBasic() {
  isEditingBasic.value = false;
}

// Login Information
const loginInfo = ref({
  email: "",
  phone: "",
  password: "••••••"
});

const isEditingLogin = ref(false);
const editLoginInfo = reactive({ 
  email: "",
  phone: "",
  password: ""
});
const showPassword = ref(false);

function startEditingLogin() {
  Object.assign(editLoginInfo, { ...loginInfo.value, password: '' });
  isEditingLogin.value = true;
}

function saveLoginInfo() {
  loginInfoSaving.value = true;
  
  // Simulación de llamada API
  setTimeout(() => {
    try {
      if (Math.random() < 0.1) {
        throw new Error('Failed to update login information');
      }
      
      // Only update password if it was changed
      if (editLoginInfo.password) {
        loginInfo.value.password = '••••••';
      }
      
      // Update other fields
      loginInfo.value.email = editLoginInfo.email;
      loginInfo.value.phone = editLoginInfo.phone;
      
      isEditingLogin.value = false;
      
      showNotification('success', 'Login information updated successfully');
    } catch (error) {
      showNotification('error', error.message || 'An error occurred while saving login information');
    } finally {
      loginInfoSaving.value = false;
    }
  }, 1500);
}

function cancelEditLogin() {
  isEditingLogin.value = false;
}

// Social Accounts
const socialAccounts = ref({
  google: { connected: false, name: "" },
  appleId: { connected: false },
  yandex: { connected: false },
  vk: { connected: false },
  telegram: { connected: false }
});

// Simulación de conexión/desconexión de cuenta social
function toggleSocialAccount(platform) {
  isLoading.value = true;
  
  setTimeout(() => {
    try {
      if (Math.random() < 0.1) {
        throw new Error(`Could not ${socialAccounts.value[platform].connected ? 'disconnect' : 'connect'} ${platform} account`);
      }
      
      socialAccounts.value[platform].connected = !socialAccounts.value[platform].connected;
      
      if (socialAccounts.value[platform].connected) {
        socialAccounts.value[platform].name = "Mark Andrew Chernetskiy";
        showNotification('success', `${platform} account connected successfully`);
      } else {
        socialAccounts.value[platform].name = "";
        showNotification('success', `${platform} account disconnected successfully`);
      }
    } catch (error) {
      showNotification('error', error.message);
    } finally {
      isLoading.value = false;
    }
  }, 1500);
}

// Función para obtener datos del perfil de usuario
async function fetchUserProfile() {
  try {
    initialLoading.value = true;
    basicInfoLoadingError.value = false;
    
    // Simulación de llamada a API
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // Simular error ocasional (10% de probabilidad)
    if (Math.random() < 0.1) {
      throw new Error("Failed to fetch profile data");
    }
    
    // Simulación de datos recibidos de la API
    const apiResponse = {
      basicInfo: {
        name: "Andres",
        surname: "Pipe",
        gender: "Male",
        birthday: "1990-05-15",
        phone: "+1 234 567 8901"
      },
      loginInfo: {
        email: "andres.pipe@gmail.com",
        phone: "+1 234 567 8901",
        password: "••••••"
      },
      socialAccounts: {
        google: { connected: true, name: "Andres Pipe" },
        appleId: { connected: false },
        yandex: { connected: false },
        vk: { connected: false },
        telegram: { connected: false }
      },
      profileImage: "https://via.placeholder.com/96/008080/ffffff?text=AP"
    };
    
    // Actualizar estado con los datos recibidos
    basicInfo.value = apiResponse.basicInfo;
    loginInfo.value = apiResponse.loginInfo;
    socialAccounts.value = apiResponse.socialAccounts;
    profileImage.value = apiResponse.profileImage;
    
  } catch (error) {
    console.error("Error fetching user profile:", error);
    basicInfoLoadingError.value = true;
    showNotification('error', 'Failed to load profile data');
  } finally {
    initialLoading.value = false;
  }
}

// Cargar datos al montar el componente
onMounted(() => {
  fetchUserProfile();
});
</script>