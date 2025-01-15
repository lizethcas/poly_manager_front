<template>
  <div class="note-student-container">
    <!-- Formulario para crear/editar notas -->
    <div class="note-form">
      <h2>{{ isEditing ? 'Editar Nota' : 'Nueva Nota' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Título</label>
          <input 
            v-model="noteForm.title" 
            type="text" 
            id="title" 
            required
          >
        </div>

        <div class="form-group">
          <label for="content">Contenido</label>
          <textarea 
            v-model="noteForm.content" 
            id="content" 
            rows="4" 
            required
          ></textarea>
        </div>

        <div class="form-group">
          <label for="note_type">Tipo de Nota</label>
          <select v-model="noteForm.note_type" id="note_type">
            <option value="vocabulary">Vocabulario</option>
            <option value="grammar">Gramática</option>
            <option value="expressions">Expresiones</option>
            <option value="general">Nota General</option>
          </select>
        </div>

        <div class="form-group">
          <label for="tags">Etiquetas (separadas por coma)</label>
          <input 
            v-model="tagsInput" 
            type="text" 
            id="tags" 
            placeholder="ej: importante, repaso, examen"
          >
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ isEditing ? 'Actualizar' : 'Crear' }} Nota
          </button>
          <button 
            v-if="isEditing" 
            type="button" 
            class="btn-secondary" 
            @click="cancelEdit"
          >
            Cancelar
          </button>
        </div>
      </form>
    </div>

    <!-- Lista de notas -->
    <div class="notes-list">
      <h2>Mis Notas</h2>
      <div v-if="notes.length === 0" class="no-notes">
        No hay notas creadas aún.
      </div>
      <div v-else class="note-cards">
        <div 
          v-for="note in notes" 
          :key="note.id" 
          class="note-card"
          :class="note.note_type"
        >
          <h3>{{ note.title }}</h3>
          <p>{{ note.content }}</p>
          <div class="note-meta">
            <span class="note-type">{{ getNoteTypeName(note.note_type) }}</span>
            <div class="note-tags" v-if="note.tags && note.tags.length">
              <span 
                v-for="tag in note.tags" 
                :key="tag" 
                class="tag"
              >
                {{ tag }}
              </span>
            </div>
          </div>
          <div class="note-actions">
            <button @click="editNote(note)" class="btn-edit">Editar</button>
            <button @click="deleteNote(note.id)" class="btn-delete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axios.config';

export default {
  name: 'NoteStudent',
  data() {
    return {
      notes: [],
      isEditing: false,
      editingNoteId: null,
      tagsInput: '',
      noteForm: {
        title: '',
        content: '',
        note_type: 'general',
        tags: [],
        student: 1,
      }
    };
  },
  created() {
    this.fetchNotes();
  },
  methods: {
    async fetchNotes() {
      try {
        const response = await axiosInstance.get('class-notes/', {
          params: {
            student_id: 1
          }
        });
        this.notes = response.data || [];
        console.log('Notas cargadas:', this.notes);
      } catch (error) {
        console.error('Error al obtener las notas:', error);
      }
    },
    async handleSubmit() {
      try {
        this.noteForm.tags = this.tagsInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);

        let response;
        if (this.isEditing) {
          response = await axiosInstance.put(`class-notes/${this.editingNoteId}/`, this.noteForm);
          console.log('Nota actualizada:', response.data);
        } else {
          response = await axiosInstance.post('class-notes/', this.noteForm);
          console.log('Nota creada:', response.data);
        }

        alert(this.isEditing ? 'Nota actualizada exitosamente' : 'Nota creada exitosamente');
        
        this.resetForm();
        await this.fetchNotes();
      } catch (error) {
        console.error('Error al guardar la nota:', error);
        alert('Error al guardar la nota: ' + (error.response?.data?.message || error.message));
      }
    },
    async deleteNote(noteId) {
      if (confirm('¿Estás seguro de que deseas eliminar esta nota?')) {
        try {
          await axiosInstance.delete(`class-notes/${noteId}/`);
          alert('Nota eliminada exitosamente');
          await this.fetchNotes();
        } catch (error) {
          console.error('Error al eliminar la nota:', error);
          alert('Error al eliminar la nota: ' + (error.response?.data?.message || error.message));
        }
      }
    },
    editNote(note) {
      this.isEditing = true;
      this.editingNoteId = note.id;
      this.noteForm = {
        ...note,
        student: note.student || 1
      };
      this.tagsInput = note.tags ? note.tags.join(', ') : '';
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.isEditing = false;
      this.editingNoteId = null;
      this.noteForm = {
        title: '',
        content: '',
        note_type: 'general',
        tags: [],
        student: 1,
      };
      this.tagsInput = '';
    },
    getNoteTypeName(type) {
      const types = {
        vocabulary: 'Vocabulario',
        grammar: 'Gramática',
        expressions: 'Expresiones',
        general: 'Nota General'
      };
      return types[type] || type;
    }
  }
};
</script>

<style scoped>
.note-student-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.note-form {
  background: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

input, textarea, select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.btn-primary {
  background: #4CAF50;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-secondary {
  background: #9e9e9e;
  margin-left: 10px;
}

.note-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.note-card {
  background: #fff;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.note-card.vocabulary { border-left: 4px solid #2196F3; }
.note-card.grammar { border-left: 4px solid #4CAF50; }
.note-card.expressions { border-left: 4px solid #FF9800; }
.note-card.general { border-left: 4px solid #9C27B0; }

.note-meta {
  margin-top: 10px;
  font-size: 0.9em;
}

.note-type {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.tag {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 0.8em;
}

.note-actions {
  margin-top: 10px;
  display: flex;
  gap: 10px;
}

.btn-edit, .btn-delete {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit {
  background: #2196F3;
  color: white;
}

.btn-delete {
  background: #f44336;
  color: white;
}

.no-notes {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>