<template>
  <div class="vocabulary-container">
    <!-- Formulario para crear/editar entradas -->
    <div class="vocabulary-form">
      <h2>{{ isEditing ? 'Editar Entrada' : 'Nueva Entrada de Vocabulario' }}</h2>
      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="term">Término/Palabra/Frase</label>
          <input 
            v-model="vocabForm.term" 
            type="text" 
            id="term" 
            required
          >
        </div>

        <div class="form-group">
          <label for="translation">Traducción</label>
          <input 
            v-model="vocabForm.translation" 
            type="text" 
            id="translation" 
            required
          >
        </div>

        <div class="form-group">
          <label for="context">Contexto/Ejemplo de uso</label>
          <textarea 
            v-model="vocabForm.context" 
            id="context" 
            rows="2"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="entry_type">Tipo</label>
          <select v-model="vocabForm.entry_type" id="entry_type">
            <option value="word">Palabra</option>
            <option value="phrase">Frase</option>
            <option value="expression">Expresión</option>
            <option value="slang">Modismo</option>
            <option value="idiom">Frase hecha</option>
          </select>
        </div>

        <div class="form-group">
          <label for="category">Categoría</label>
          <input 
            v-model="vocabForm.category" 
            type="text" 
            id="category"
            placeholder="ej: Negocios, Viajes, Comida..."
          >
        </div>

        <div class="form-group">
          <label for="tags">Etiquetas (separadas por coma)</label>
          <input 
            v-model="tagsInput" 
            type="text" 
            id="tags" 
            placeholder="ej: importante, común, formal"
          >
        </div>

        <div class="form-group">
          <label>
            <input 
              type="checkbox" 
              v-model="vocabForm.is_favorite"
            > Marcar como favorito
          </label>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn-primary">
            {{ isEditing ? 'Actualizar' : 'Guardar' }} Entrada
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

    <!-- Lista de vocabulario -->
    <div class="vocabulary-list">
      <h2>Mi Vocabulario</h2>
      <div class="filters">
        <select v-model="filterType">
          <option value="">Todos los tipos</option>
          <option value="word">Palabras</option>
          <option value="phrase">Frases</option>
          <option value="expression">Expresiones</option>
          <option value="slang">Modismos</option>
          <option value="idiom">Frases hechas</option>
        </select>
        <select v-model="filterLevel">
          <option value="">Todos los niveles</option>
          <option v-for="level in 5" :key="level" :value="level">
            Nivel {{ level }}
          </option>
        </select>
      </div>

      <div v-if="filteredVocabulary.length === 0" class="no-entries">
        No hay entradas de vocabulario aún.
      </div>
      
      <div v-else class="vocabulary-cards">
        <div 
          v-for="entry in filteredVocabulary" 
          :key="entry.id" 
          class="vocab-card"
          :class="[entry.entry_type, { favorite: entry.is_favorite }]"
        >
          <div class="card-header">
            <h3>{{ entry.term }}</h3>
            <span class="proficiency-level">Nivel {{ entry.proficiency_level }}</span>
          </div>
          
          <p class="translation">{{ entry.translation }}</p>
          <p v-if="entry.context" class="context">{{ entry.context }}</p>
          
          <div class="meta-info">
            <span class="entry-type">{{ getEntryTypeName(entry.entry_type) }}</span>
            <span v-if="entry.category" class="category">{{ entry.category }}</span>
          </div>
          
          <div class="tags" v-if="entry.tags && entry.tags.length">
            <span 
              v-for="tag in entry.tags" 
              :key="tag" 
              class="tag"
            >{{ tag }}</span>
          </div>

          <div class="card-actions">
            <button @click="editEntry(entry)" class="btn-edit">Editar</button>
            <button @click="deleteEntry(entry.id)" class="btn-delete">Eliminar</button>
            <button 
              @click="updateProficiency(entry.id, 0.9)" 
              class="btn-practice"
              title="Marcar como practicado exitosamente"
            >
              ✓
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axiosInstance from '@/services/axios.config';

export default {
  name: 'VocabularyStudent',
  data() {
    return {
      vocabulary: [],
      isEditing: false,
      editingEntryId: null,
      tagsInput: '',
      filterType: '',
      filterLevel: '',
      vocabForm: {
        term: '',
        translation: '',
        context: '',
        entry_type: 'word',
        category: '',
        tags: [],
        is_favorite: false,
        student: 1, // ID fijo por ahora
      }
    };
  },
  computed: {
    filteredVocabulary() {
      return this.vocabulary.filter(entry => {
        const typeMatch = !this.filterType || entry.entry_type === this.filterType;
        const levelMatch = !this.filterLevel || entry.proficiency_level === parseInt(this.filterLevel);
        return typeMatch && levelMatch;
      });
    }
  },
  created() {
    this.fetchVocabulary();
  },
  methods: {
    async fetchVocabulary() {
      try {
        const response = await axiosInstance.get('vocabulary/', {
          params: {
            student_id: 1
          }
        });
        this.vocabulary = response.data.data || [];
      } catch (error) {
        console.error('Error al obtener el vocabulario:', error);
        alert('Error al cargar el vocabulario');
      }
    },
    async handleSubmit() {
      try {
        this.vocabForm.tags = this.tagsInput
          .split(',')
          .map(tag => tag.trim())
          .filter(tag => tag);

        let response;
        if (this.isEditing) {
          response = await axiosInstance.put(`vocabulary/${this.editingEntryId}/`, this.vocabForm);
        } else {
          response = await axiosInstance.post('vocabulary/', this.vocabForm);
        }

        alert(this.isEditing ? 'Entrada actualizada exitosamente' : 'Entrada creada exitosamente');
        this.resetForm();
        await this.fetchVocabulary();
      } catch (error) {
        console.error('Error al guardar la entrada:', error);
        alert('Error al guardar: ' + (error.response?.data?.message || error.message));
      }
    },
    async deleteEntry(entryId) {
      if (confirm('¿Estás seguro de que deseas eliminar esta entrada?')) {
        try {
          await axiosInstance.delete(`vocabulary/${entryId}/`);
          alert('Entrada eliminada exitosamente');
          await this.fetchVocabulary();
        } catch (error) {
          console.error('Error al eliminar la entrada:', error);
          alert('Error al eliminar la entrada');
        }
      }
    },
    async updateProficiency(entryId, successRate) {
      try {
        await axiosInstance.post(`vocabulary/${entryId}/update_proficiency/`, {
          success_rate: successRate
        });
        await this.fetchVocabulary();
      } catch (error) {
        console.error('Error al actualizar el nivel:', error);
        alert('Error al actualizar el nivel de dominio');
      }
    },
    editEntry(entry) {
      this.isEditing = true;
      this.editingEntryId = entry.id;
      this.vocabForm = {
        ...entry,
        student: entry.student || 1
      };
      this.tagsInput = entry.tags ? entry.tags.join(', ') : '';
    },
    cancelEdit() {
      this.resetForm();
    },
    resetForm() {
      this.isEditing = false;
      this.editingEntryId = null;
      this.vocabForm = {
        term: '',
        translation: '',
        context: '',
        entry_type: 'word',
        category: '',
        tags: [],
        is_favorite: false,
        student: 1,
      };
      this.tagsInput = '';
    },
    getEntryTypeName(type) {
      const types = {
        word: 'Palabra',
        phrase: 'Frase',
        expression: 'Expresión',
        slang: 'Modismo',
        idiom: 'Frase hecha'
      };
      return types[type] || type;
    }
  }
};
</script>

<style scoped>
.vocabulary-container {
  padding: 20px;
  max-width: 1200px;
  margin: 0 auto;
}

.vocabulary-form {
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
  margin-bottom: 30px;
}

.form-group {
  margin-bottom: 15px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.form-group input,
.form-group textarea,
.form-group select {
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

.vocabulary-cards {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.vocab-card {
  background: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

.vocab-card.word { border-left: 4px solid #2196F3; }
.vocab-card.phrase { border-left: 4px solid #4CAF50; }
.vocab-card.expression { border-left: 4px solid #FF9800; }
.vocab-card.slang { border-left: 4px solid #9C27B0; }
.vocab-card.idiom { border-left: 4px solid #F44336; }
.vocab-card.favorite { background: #fff8e1; }

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.proficiency-level {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  font-size: 0.8em;
}

.translation {
  color: #666;
  font-style: italic;
  margin-bottom: 10px;
}

.context {
  font-size: 0.9em;
  color: #555;
  margin-bottom: 10px;
}

.meta-info {
  margin-top: 10px;
  font-size: 0.9em;
}

.entry-type,
.category {
  background: #f0f0f0;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 0.8em;
}

.tags {
  margin-top: 10px;
}

.tag {
  background: #e0e0e0;
  padding: 2px 8px;
  border-radius: 12px;
  margin-right: 5px;
  font-size: 0.8em;
}

.card-actions {
  margin-top: 15px;
  display: flex;
  gap: 10px;
}

.btn-edit,
.btn-delete,
.btn-practice {
  padding: 5px 10px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-edit { background: #2196F3; color: white; }
.btn-delete { background: #f44336; color: white; }
.btn-practice { background: #4CAF50; color: white; }

.filters {
  margin-bottom: 20px;
  display: flex;
  gap: 10px;
}

.filters select {
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.no-entries {
  text-align: center;
  padding: 20px;
  color: #666;
}
</style>