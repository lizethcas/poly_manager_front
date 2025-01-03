<template>
    <div>
        <h1>ChatAI</h1>
    </div>
    <div class="chat-container">
        <div class="messages" ref="messagesContainer">
            <div v-for="(message, index) in messages" 
                 :key="index" 
                 :class="['message', message.type]">
                {{ message.text }}
            </div>
        </div>
        <div class="input-container">
            <input v-model="userMessage" 
                   @keyup.enter="sendMessage" 
                   placeholder="Escribe tu mensaje aquí...">
            <button @click="sendMessage">Enviar</button>
        </div>
    </div>
</template>

<script>



export default {
    name: 'ChatAI',
    data() {
        return {
            messages: [],
            userMessage: '',
        }
    },
    methods: {
        async sendMessage() {
            if (!this.userMessage.trim()) return;
            
            this.messages.push({
                type: 'user',
                text: this.userMessage
            });
            
            const messageToSend = this.userMessage;
            this.userMessage = '';
            
            try {
                const response = await fetch('http://localhost:8000/chat/chat-ai/', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ message: messageToSend })
                });
                
                const data = await response.json();
                
                this.messages.push({
                    type: 'ai',
                    text: data.response
                });
                
                this.$nextTick(() => {
                    this.scrollToBottom();
                });
                
            } catch (error) {
                console.error('Error:', error);
                this.messages.push({
                    type: 'error',
                    text: 'Error al enviar el mensaje. Por favor, intenta de nuevo.'
                });
            }
        },
        scrollToBottom() {
            const container = this.$refs.messagesContainer;
            container.scrollTop = container.scrollHeight;
        }
    }
}
</script>

<style scoped>
.chat-container {
    display: flex;
    flex-direction: column;
    height: 500px;
    border: 1px solid #ccc;
    border-radius: 8px;
}

.messages {
    flex-grow: 1;
    overflow-y: auto;
    padding: 20px;
}

.message {
    margin: 10px 0;
    padding: 10px;
    border-radius: 8px;
    max-width: 70%;
}

.user {
    background-color: #007bff;
    color: white;
    align-self: flex-end;
    margin-left: auto;
}

.ai {
    background-color: #f0f0f0;
    color: black;
    align-self: flex-start;
}

.error {
    background-color: #ff4444;
    color: white;
}

.input-container {
    display: flex;
    padding: 20px;
    gap: 10px;
}

input {
    flex-grow: 1;
    padding: 10px;
    border: 1px solid #ccc;
    border-radius: 4px;
}

button {
    padding: 10px 20px;
    background-color: #007bff;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
}

button:hover {
    background-color: #0056b3;
}
</style>