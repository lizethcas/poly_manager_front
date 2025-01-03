<template>
  <div class="fixed right-0 top-0 h-full w-[300px] bg-white shadow-lg flex flex-col">
    <!-- Header del chat -->
    <div class="p-4 bg-[#4086DF] text-white flex items-center gap-2">
      <div class="flex items-center gap-2">
        <Icon name="material-symbols:support-agent" size="20" />
        <span class="font-medium">Support Team</span>
      </div>
      <span class="text-xs ml-auto">online</span>
    </div>

    <!-- Área de mensajes -->
    <div class="flex-1 p-4 overflow-y-auto">
      <!-- Ejemplo de mensaje del sistema -->
      <div class="mb-4">
        <div class="bg-gray-100 rounded-lg p-3 max-w-[80%]">
          <p class="text-sm text-gray-700">
            Ask a question or share feedback. We typically respond within an hour or two.
          </p>
        </div>
        <div class="text-xs text-gray-400 mt-1">10:40</div>
      </div>
    </div>

    <!-- Input para escribir mensajes -->
    <div class="p-4 border-t">
      <div class="relative">
        <input
          type="text"
          placeholder="Send a message..."
          class="w-full px-4 py-2 border rounded-full focus:outline-none focus:border-blue-400"
        />
        <button class="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
          <Icon name="material-symbols:send" size="20" />
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Aquí puedes agregar la lógica del chat
</script> 