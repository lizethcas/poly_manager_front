<template>
  <div class="flex flex-col h-[600px] bg-white rounded-t-md shadow-lg border overflow-hidden">
    <!-- Header -->
    <div class="p-4 border-b">
      <h2 class="text-lg font-semibold flex items-center gap-2">
        <div class="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
        AI Assistant
      </h2>
    </div>

    <!-- Chat Messages -->
    <div class="flex-1 overflow-y-auto p-4 space-y-4 min-h-0" ref="messagesContainer">
      <div v-for="(message, index) in messages" 
           :key="index" 
           :class="[
              'flex',
              message.type === 'user' ? 'justify-end' : 'justify-start'
           ]">
        <div :class="[
          'max-w-[80%] p-3 rounded-2xl',
          message.type === 'user' ? 'bg-blue-600 text-white rounded-br-sm' : 
          message.type === 'ai' ? 'bg-gray-100 text-gray-800 rounded-bl-sm' :
          'bg-red-500 text-white'
        ]">
          <p class="text-sm whitespace-pre-wrap" v-html="formatMessage(message.text)"></p>
        </div>
      </div>
      
      <!-- Typing Indicator -->
      <div v-if="isTyping" class="flex justify-start">
        <div class="bg-gray-100 p-3 rounded-2xl rounded-bl-sm">
          <div class="flex gap-2">
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.2s"></div>
            <div class="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style="animation-delay: 0.4s"></div>
          </div>
        </div>
      </div>
    </div>

    <!-- Input Area -->
    <div class="border-t p-4">
      <div class="flex items-center gap-2 bg-gray-50 rounded-lg border">
        <input v-model="userMessage" 
               @keyup.enter="sendMessage" 
               placeholder="Escribe un mensaje..."
               class="flex-grow p-3 bg-transparent text-sm focus:outline-none">
        <button @click="sendMessage"
                class="p-3 text-blue-600 hover:text-blue-700 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.894 2.553a1 1 0 00-1.788 0l-7 14a1 1 0 001.169 1.409l5-1.429A1 1 0 009 15.571V11a1 1 0 112 0v4.571a1 1 0 00.725.962l5 1.428a1 1 0 001.17-1.408l-7-14z" />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'

const messages = ref([])
const userMessage = ref('')
const messagesContainer = ref(null)
const isTyping = ref(false)

const scrollToBottom = () => {
    nextTick(() => {
        const container = messagesContainer.value
        container.scrollTop = container.scrollHeight
    })
}

const sendMessage = async () => {
    if (!userMessage.value.trim()) return
    
    messages.value.push({
        type: 'user',
        text: userMessage.value
    })
    
    const messageToSend = userMessage.value
    userMessage.value = ''
    
    try {
        isTyping.value = true
        scrollToBottom()

        const response = await fetch('http://localhost:8000/chat/chat-ai/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ message: messageToSend })
        })
        
        const data = await response.json()
        isTyping.value = false
        
        messages.value.push({
            type: 'ai',
            text: data.response
        })
        
        scrollToBottom()
        
    } catch (error) {
        console.error('Error:', error)
        isTyping.value = false
        messages.value.push({
            type: 'error',
            text: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
        })
    }
}

const formatMessage = (text) => {
  return text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}
</script>