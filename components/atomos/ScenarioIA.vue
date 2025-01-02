<template>
  <div class="form-container">
    <h3 class="form-title">Detailed Prompt for Voice Mode Practice:</h3>
    <div class="flex flex-col gap-2" id="section-form">
      <p class="form-step">1 Set the Scene:</p>
      <label for="name" class="form-label">Name Scenario</label>
      <input type="text" id="name" name="name" class="form-input" v-model="formData.name" />
      <label for="type" class="form-label">Type Scenario</label>
      <select name="type" id="type" class="form-select">
        <option value="real">Real</option>
        <option value="fantasy">Fantasy</option>
        <option value="historical">Historical</option>
      </select>
      <label for="location" class="form-label">Location</label>
      <input type="text" id="location" name="location" class="form-input" v-model="formData.location" />
      <label for="description_scenario" class="form-label">Description Scenario</label>
      <textarea id="description_scenario" name="description_scenario" class="form-input" v-model="formData.description" />
    </div>
    <div class="flex flex-col gap-2" id="section-form">
      <p>2 Lesson Goals and Objectives:</p>
      <p>This activity aims to help the student:</p>
      <div>
        <label for="goal">Goal</label>
        <input type="text" v-for="(goal, index) in goals" :key="index" :id="'goal' + index" v-model="goals[index]" />
      </div>
      <button @click="addGoal">Add Goal</button>
      <p>Use vocabulary and key expressions learned in the lesson, including:</p>
      <div>
        <label for="vocabulary">Vocabulary</label>
        <input type="text" v-for="(vocab, index) in vocabularies" :key="index" :id="'vocabulary' + index" v-model="vocabularies[index]" />
      </div>
      <button @click="addVocabulary">Add Vocabulary</button>
      <div>
        <label for="key_expressions">Key Expressions</label>
        <input type="text" v-for="(keyExpression, index) in keyExpressions" :key="index" :id="'key_expression' + index" v-model="keyExpressions[index]" />
      </div>
      <button @click="addKeyExpression">Add Key Expression</button>
      <label for="additional_info_objectives">Additional Information</label>
      <input type="text" id="additional_info_objectives" name="additional_info_objectives" />
    </div>
    <div class="flex flex-col gap-2" id="section-form">
      <p>3 Roles</p>
      <div>
        <p>Estudent</p>
        <p>Level student</p>
        <label for="limitations_student">Limitaciones </label>
        <input type="text" id="limitations_student" name="limitations_student" v-model="formData.limitations_student" />
        <label for="role_student">Role student</label>
        <input type="text" id="role_student" name="role_student" v-model="formData.role_student" />
      </div>
      <div>
        <p>Polly</p>
        <label for="role_polly">Role polly</label>
        <input type="text" id="role_polly" name="role_polly" v-model="formData.role_polly" />
        <div>
          <label for="instructions_polly">Instrucciones</label>
          <input type="text" v-for="(instruction, index) in instructions" :key="index" :id="'instructions_polly' + index" v-model="instructions[index]" />
        </div>
        <button @click="addInstructions">Add Instructions</button>
        <div>
          <label for="limitations_polly">Limitaciones</label>
          <input type="text" v-for="(limitation, index) in limitations" :key="index" :id="'limitations_polly' + index" v-model="limitations[index]" />
        </div>
        <button @click="addLimitationsPolly">Add Limitations</button>
        <div>
          <label for="finish_conversation">Finish conversation</label>
          <input type="text" id="finish_conversation" name="finish_conversation" />
        </div>
      </div>
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
      required: true
    }
  },
  data() {
    return {
      goals: [''],
      vocabularies: [''],
      keyExpressions: [''],
      instructions: [''],
      limitations: [''],
      formData: {
        name: '',
        type: 'real',
        location: '',
        description: '',
        limitations_student: '',
        role_student: '',
        role_polly: '',
        finish_conversation: '',
      },
      classId: '1',
    };
  },
  methods: {
    addGoal() {
      this.goals.push(''); 
    },
    addVocabulary() {
      this.vocabularies.push(''); 
    },
    addKeyExpression() {
      this.keyExpressions.push(''); 
    },
    addInstructions() {
      this.instructions.push(''); 
    },
    addLimitationsPolly() {
      this.limitations.push(''); 
    },
    async submitScenario() {
      console.log('Iniciando el proceso de envío del escenario...');
      const scenarioData = {
        class_model: parseInt(this.classId),
        name: this.formData.name,
        type: this.formData.type,
        location: this.formData.location,
        description: this.formData.description,
        goals: this.goals.filter(goal => goal.trim() !== ''),
        vocabulary: this.vocabularies.filter(vocab => vocab.trim() !== ''),
        key_expressions: this.keyExpressions.filter(expr => expr.trim() !== ''),
        limitations_student: this.formData.limitations_student,
        role_student: this.formData.role_student,
        role_polly: this.formData.role_polly,
        instructions_polly: this.instructions.filter(instr => instr.trim() !== ''),
        limitations_polly: this.limitations.filter(limit => limit.trim() !== ''),
      };

      console.log('Datos del escenario a enviar:', scenarioData);

      try {
        const response = await axiosInstance.post('scenarios/', scenarioData);
        console.log('Respuesta del servidor:', response.data);

        if (response.data) {
          console.log('Escenario creado exitosamente:', response.data);
          this.$emit('scenario-created', response.data);
          this.resetForm();
        }
      } catch (error) {
        console.error('Error al crear el escenario:', error.response?.data || error);
        // Aquí podrías manejar los errores, por ejemplo mostrando una notificación
      }
    },
    resetForm() {
      console.log('Reiniciando el formulario...');
      this.formData = {
        name: '',
        type: 'real',
        location: '',
        description: '',
        limitations_student: '',
        role_student: '',
        role_polly: '',
        finish_conversation: '',
      };
      this.goals = [''];
      this.vocabularies = [''];
      this.keyExpressions = [''];
      this.instructions = [''];
      this.limitations = [''];
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