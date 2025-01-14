<template>
  <div class="form-container">
    <h3 class="form-title">Detailed Prompt for Voice Mode Practice:</h3>
    <div class="flex flex-col gap-2" id="section-form">
      <p class="form-step">1 Set the Scene:</p>
      <label for="name" class="form-label">Name Scenario</label>
      <input type="text" id="name" name="name" class="form-input" v-model="formData.name" />
      
      <label for="description" class="form-label">Description</label>
      <textarea id="description" name="description" class="form-input" v-model="formData.description" />

      <label for="cover" class="form-label">Cover Image</label>
      <input type="file" id="cover" name="cover" @change="handleCoverUpload" accept="image/*" />
    </div>

    <div class="flex flex-col gap-2" id="section-form">
      <p>2 Goals and Objectives:</p>
      <div>
        <label for="goal">Goals</label>
        <input type="text" v-for="(goal, index) in goals" :key="index" :id="'goal' + index" v-model="goals[index]" />
      </div>
      <button @click="addGoal">Add Goal</button>

      <div>
        <label for="objectives">Objectives</label>
        <input type="text" v-for="(objective, index) in objectives" :key="index" :id="'objective' + index" v-model="objectives[index]" />
      </div>
      <button @click="addObjective">Add Objective</button>
    </div>

    <div class="flex flex-col gap-2" id="section-form">
      <p>3 Conversation Details:</p>
      <label for="conversation_starter">Conversation Starter</label>
      <textarea id="conversation_starter" v-model="formData.conversation_starter" />

      <label for="end_conversation">End Conversation</label>
      <textarea id="end_conversation" v-model="formData.end_conversation" />

      <label for="end_conversation_saying">End Conversation Saying</label>
      <textarea id="end_conversation_saying" v-model="formData.end_conversation_saying" />

      <label for="feedback">Feedback</label>
      <textarea id="feedback" v-model="formData.feedback" />
    </div>

    <div class="flex flex-col gap-2" id="section-form">
      <p>4 Role Information:</p>
      <label for="role_student">Student Role</label>
      <textarea id="role_student" v-model="formData.role_student" class="form-input" required />

      <label for="role_polly">Polly Role</label>
      <textarea id="role_polly" v-model="formData.role_polly" class="form-input" required />
    </div>

    <div class="mt-4">
      <button type="submit" class="submit-button" @click="submitScenario">
        Guardar Escenario
      </button>
    </div>
  </div>
</template>

<script>
import axiosInstance from '../../services/axios.config';

export default {
  name: 'ScenarioIA',
  props: {
    classId: {
      type: [Number, String],
      required: true,
      default: 1
    }
  },
  data() {
    return {
      goals: [''],
      objectives: [''],
      vocabularies: [''],
      keyExpressions: [''],
      formData: {
        name: '',
        description: '',
        conversation_starter: '',
        end_conversation: '',
        end_conversation_saying: '',
        feedback: '',
        role_student: '',
        role_polly: '',
      },
      coverFile: null,
    };
  },
  methods: {
    addGoal() {
      this.goals.push(''); 
    },
    addObjective() {
      this.objectives.push('');
    },
    handleCoverUpload(event) {
      this.coverFile = event.target.files[0];
    },
    async submitScenario() {
      const formData = new FormData();
      
      // Convertir classId a número
      formData.append('class_model', Number(this.classId));
      
      // Datos básicos
      formData.append('name', this.formData.name);
      formData.append('description', this.formData.description);
      
      // Roles (requeridos)
      formData.append('role_student', this.formData.role_student);
      formData.append('role_polly', this.formData.role_polly);
      
      // Cover si existe
      if (this.coverFile) {
        formData.append('cover', this.coverFile);
      }

      // Arrays como JSON
      formData.append('goals', JSON.stringify(this.goals.filter(g => g.trim())));
      formData.append('objectives', JSON.stringify(this.objectives.filter(o => o.trim())));
      formData.append('vocabulary', JSON.stringify(this.vocabularies.filter(v => v.trim())));
      formData.append('key_expressions', JSON.stringify(this.keyExpressions.filter(k => k.trim())));

      // Campos de conversación
      formData.append('conversation_starter', this.formData.conversation_starter);
      formData.append('end_conversation', this.formData.end_conversation);
      formData.append('end_conversation_saying', this.formData.end_conversation_saying);
      formData.append('feedback', this.formData.feedback);

      try {
        const response = await axiosInstance.post('scenarios/', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });
        
        console.log('Escenario creado exitosamente:', response.data);
        this.$emit('scenario-created', response.data);
        this.resetForm();
      } catch (error) {
        console.error('Error al crear el escenario:', error.response?.data || error);
      }
    },
    resetForm() {
      console.log('Reiniciando el formulario...');
      this.formData = {
        name: '',
        description: '',
        conversation_starter: '',
        end_conversation: '',
        end_conversation_saying: '',
        feedback: '',
        role_student: '',
        role_polly: '',
      };
      this.goals = [''];
      this.objectives = [''];
      this.vocabularies = [''];
      this.keyExpressions = [''];
      console.log('Formulario reiniciado.');
    }
  }
}
</script>

<style scoped>
.form-container {
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5em;
  margin-bottom: 10px;
}

.form-step {
  font-weight: bold;
}

.form-label {
  margin-top: 10px;
  font-weight: bold;
  color: #333;
}

.form-select, .form-input {
  margin-top: 5px;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s;
}

.form-select:focus, .form-input:focus {
  border-color: #007bff;
  outline: none;
}

#section-form {
  margin-bottom: 10px;
  border: 1px solid #ccc;
  padding: 10px;
}

input {
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 4px;
  width: 100%;
  transition: border-color 0.3s;
  margin-bottom: 8px;
}

.flex {
  display: flex;
  flex-direction: column;
}

.gap-2 {
  gap: 10px;
}

.submit-button {
  background-color: #007bff;
  color: white;
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-weight: bold;
  transition: background-color 0.3s;
}

.submit-button:hover {
  background-color: #0056b3;
}
</style>