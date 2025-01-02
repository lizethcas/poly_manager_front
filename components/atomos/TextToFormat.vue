<template>
  <div class="editor-container">
    <!-- Debug info -->
    <div style="background: #f0f0f0; padding: 10px; margin-bottom: 10px;">
      Debug: Hay {{ previousTexts.length }} textos previos
    </div>

    <!-- Textos previos -->
    <div v-if="previousTexts.length > 0" class="previous-texts">
      <h3>Textos anteriores:</h3>
      <div v-for="text in previousTexts" :key="text.id" class="previous-text">
        <h4>{{ text.title || 'Sin título' }}</h4>
        <div v-if="text.instructions" class="instructions">
          Instrucciones: {{ text.instructions }}
        </div>
        <div v-html="text.content" class="formatted-content"></div>
        <div class="text-date">
          Creado: {{ new Date(text.created_at).toLocaleDateString() }}
        </div>
      </div>
    </div>

    <!-- Campos adicionales -->
    <div class="form-header">
      <input 
        v-model="title" 
        type="text" 
        placeholder="Título del texto" 
        class="title-input"
      />
      <input 
        v-model="instructions" 
        type="text" 
        placeholder="Instrucciones (opcional)" 
        class="instructions-input"
      />
    </div>

    <!-- Barra de herramientas -->
    <div v-if="editor" class="toolbar">
      <button 
        @click="editor.chain().focus().toggleBold().run()"
        :class="{ 'is-active': editor.isActive('bold') }"
      >
        Negrita
      </button>
      <button 
        @click="editor.chain().focus().toggleItalic().run()"
        :class="{ 'is-active': editor.isActive('italic') }"
      >
        Cursiva
      </button>
      <button 
        @click="editor.chain().focus().toggleUnderline().run()"
        :class="{ 'is-active': editor.isActive('underline') }"
      >
        Subrayado
      </button>
      <input 
        type="color" 
        @input="setColor($event)"
      />
    </div>

    <!-- Editor -->
    <editor-content :editor="editor" />

    <!-- Botones de acción -->
    <div class="action-buttons">
      <button 
        @click="saveFormattedText" 
        :disabled="isLoading"
        class="save-button"
      >
        {{ isLoading ? 'Guardando...' : 'Guardar' }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import axiosInstance from '../../services/axios.config'

const props = defineProps({
  classId: {
    type: Number,
    required: true,
    default: 1
  },
  initialContent: {
    type: String,
    default: '<p>¡Hola! Escribe algo aquí...</p>'
  },
  editMode: {
    type: Boolean,
    default: false
  },
  textId: {
    type: Number,
    default: null
  }
})

const title = ref('')
const instructions = ref('')
const isLoading = ref(false)

const editor = useEditor({
  content: props.initialContent,
  extensions: [
    StarterKit,
    Underline,
    TextStyle,
    Color,
  ],
})

const setColor = (event) => {
  editor.value.chain().focus().setColor(event.target.value).run()
}

const previousTexts = ref([])

const loadPreviousTexts = async () => {
  try {
    console.log('Cargando textos previos para class_id:', props.classId)
    const response = await axiosInstance.get('formatted-texts/', {
      params: {
        class_id: props.classId,
        limit: 2
      }
    })
    console.log('Respuesta de textos previos:', response.data)
    previousTexts.value = Array.isArray(response.data) ? response.data : (response.data.data || [])
    console.log('Textos cargados:', previousTexts.value)
  } catch (error) {
    console.error('Error al cargar textos previos:', error)
  }
}

const saveFormattedText = async () => {
  if (!editor.value) {
    console.error('Editor no inicializado');
    return;
  }

  // Validar que classId esté definido
  if (!props.classId) {
    alert('Error: No se ha especificado la clase');
    return;
  }

  try {
    isLoading.value = true;
    const formattedTextData = {
      class_model: props.classId, // Asegurarnos de que esto tenga un valor
      title: title.value || 'Sin título',
      content: editor.value.getHTML(),
      instructions: instructions.value,
      order: 0
    };

    console.log('Enviando datos al servidor:', formattedTextData);

    let response;
    if (props.editMode && props.textId) {
      response = await axiosInstance.put(`formatted-texts/${props.textId}/`, formattedTextData);
    } else {
      response = await axiosInstance.post('formatted-texts/', formattedTextData);
    }

    console.log('Respuesta del servidor:', response.data);

    if (response.data.status === 'success') {
      alert('Texto guardado exitosamente');
      emit('saved', response.data.data);
      await loadPreviousTexts(); // Recargar los textos previos
    }
  } catch (error) {
    console.error('Error detallado:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      headers: error.response?.headers
    });
    
    let errorMessage = 'Error al guardar el texto: ';
    if (error.response?.data?.message) {
      errorMessage += error.response.data.message;
    } else if (error.response?.data) {
      errorMessage += JSON.stringify(error.response.data);
    } else {
      errorMessage += error.message;
    }
    
    alert(errorMessage);
  } finally {
    isLoading.value = false;
  }
};

onBeforeUnmount(() => {
  editor.value?.destroy()
})

// Si estamos en modo edición, cargar el contenido existente
onMounted(async () => {
  if (props.editMode && props.textId) {
    try {
      const response = await axiosInstance.get(`/formatted-texts/${props.textId}/`)
      if (response.data) {
        title.value = response.data.title || ''
        instructions.value = response.data.instructions || ''
        editor.value?.commands.setContent(response.data.content)
      }
    } catch (error) {
      console.error('Error al cargar el texto:', error)
    }
  }

  await loadPreviousTexts()
})

// Definir eventos que emitirá el componente
const emit = defineEmits(['saved'])
</script>

<style scoped>
.editor-container {
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  padding: 1rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.title-input,
.instructions-input {
  padding: 0.5rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  width: 100%;
}

.toolbar {
  padding: 0.5rem;
  border-bottom: 1px solid #ccc;
  display: flex;
  gap: 0.5rem;
}

.toolbar button {
  padding: 0.5rem 1rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  background: white;
  cursor: pointer;
}

.toolbar button.is-active {
  background: #e9ecef;
  border-color: #dee2e6;
}

.action-buttons {
  padding: 1rem;
  border-top: 1px solid #ccc;
  display: flex;
  justify-content: flex-end;
}

.save-button {
  padding: 0.5rem 1rem;
  background-color: #4CAF50;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.save-button:disabled {
  background-color: #cccccc;
  cursor: not-allowed;
}

:deep(.ProseMirror) {
  padding: 1rem;
  min-height: 150px;
  outline: none;
}

:deep(.ProseMirror p) {
  margin: 0;
}

.previous-texts {
  margin-bottom: 2rem;
  padding: 1rem;
  border-bottom: 1px solid #ccc;
}

.previous-text {
  margin-bottom: 1.5rem;
  padding: 1rem;
  background-color: #f8f9fa;
  border-radius: 4px;
}

.previous-text h4 {
  margin: 0 0 0.5rem 0;
  color: #333;
}

.instructions {
  font-style: italic;
  color: #666;
  margin-bottom: 0.5rem;
}

.formatted-content {
  margin: 1rem 0;
  padding: 1rem;
  background-color: white;
  border-radius: 4px;
  border: 1px solid #dee2e6;
}

.text-date {
  font-size: 0.8rem;
  color: #666;
  text-align: right;
}

/* Permitir que los estilos del contenido formateado se apliquen */
:deep(.formatted-content *) {
  max-width: 100%;
}
</style>
