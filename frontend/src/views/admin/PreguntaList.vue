<template>
  <div class="preguntas-container">
    <h2 class="section-title">Gestionar Preguntas</h2>

    <!-- Formulario para Crear Pregunta -->
    <div v-if="modoCreacion" class="form-container">
      <h3 class="form-title">Crear Pregunta</h3>
      <form @submit.prevent="crearPregunta" class="form">
        <div class="form-group">
          <label for="nombre" class="label">Nombre:</label>
          <input type="text" v-model="nuevaPregunta.nombre" required class="input-field" />
        </div>
        <div class="form-group">
          <label for="correo" class="label">Correo:</label>
          <input type="email" v-model="nuevaPregunta.correo" required class="input-field" />
        </div>
        <div class="form-group">
          <label for="mensaje" class="label">Mensaje:</label>
          <textarea v-model="nuevaPregunta.mensaje" required class="textarea-field"></textarea>
        </div>
        <div class="form-actions">
          <button type="submit" class="btn-submit">Enviar Pregunta</button>
          <button type="button" @click="cancelarCreacion" class="btn-cancel">Cancelar</button>
        </div>
      </form>
    </div>

    <!-- Lista de Preguntas -->
    <div v-else class="questions-list">
      <h3 class="list-title">Preguntas Recibidas</h3>
      <ul class="questions">
        <li v-for="pregunta in preguntas" :key="pregunta.id" class="question-item">
          <div class="question-info">
            <strong class="question-name">{{ pregunta.nombre }}</strong> - 
            <span class="question-email">{{ pregunta.correo }}</span>
            <p class="question-message">{{ pregunta.mensaje }}</p>
          </div>
          <div class="action-buttons">
            <button @click="eliminarPregunta(pregunta.id)" class="btn-delete">Eliminar</button>
          </div>
        </li>
      </ul>
      <button @click="modoCreacion = true" class="btn-create">Crear Pregunta</button>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      preguntas: [],
      modoCreacion: false,
      nuevaPregunta: {
        nombre: '',
        correo: '',
        mensaje: ''
      }
    };
  },
  async created() {
    await this.obtenerPreguntas();
  },
  methods: {
    async obtenerPreguntas() {
      try {
        const response = await axios.get('/api/admin/preguntas');
        this.preguntas = response.data;
      } catch (error) {
        console.error('Error al obtener las preguntas:', error);
        alert('Hubo un error al obtener las preguntas');
      }
    },
    async crearPregunta() {
      try {
        await axios.post('/api/admin/preguntas', this.nuevaPregunta);
        alert('Pregunta enviada con éxito');
        this.modoCreacion = false;
        this.nuevaPregunta = { nombre: '', correo: '', mensaje: '' };
        await this.obtenerPreguntas(); // Actualizar la lista de preguntas
      } catch (error) {
        console.error('Error al crear la pregunta:', error);
        alert('Hubo un error al enviar la pregunta');
      }
    },
    async eliminarPregunta(id) {
      if (confirm('¿Estás seguro de que deseas eliminar esta pregunta?')) {
        try {
          await axios.delete(`/api/admin/preguntas/${id}`);
          this.preguntas = this.preguntas.filter(pregunta => pregunta.id !== id);
          alert('Pregunta eliminada con éxito');
        } catch (error) {
          console.error('Error al eliminar la pregunta:', error);
          alert('Hubo un error al eliminar la pregunta');
        }
      }
    },
    cancelarCreacion() {
      this.modoCreacion = false;
      this.nuevaPregunta = { nombre: '', correo: '', mensaje: '' };
    }
  }
};
</script>

<style scoped>
.preguntas-container {
  max-width: 900px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.section-title {
  font-size: 2rem;
  color: #42b983;
  text-align: center;
  margin-bottom: 30px;
}

/* Formulario */
.form-container {
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  font-size: 1.5rem;
  color: #3d668f;
  margin-bottom: 15px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 5px;
}

.label {
  font-size: 1rem;
  color: #333;
}

.input-field,
.textarea-field {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.input-field:focus,
.textarea-field:focus {
  border-color: #42b983;
}

.textarea-field {
  height: 120px;
}

.form-actions {
  display: flex;
  gap: 10px;
}

.btn-submit,
.btn-cancel {
  padding: 10px 20px;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-submit {
  background-color: #42b983;
  color: white;
  border: none;
}

.btn-submit:hover {
  background-color: #3d668f;
}

.btn-cancel {
  background-color: #e74c3c;
  color: white;
  border: none;
}

.btn-cancel:hover {
  background-color: #c0392b;
}

/* Lista de preguntas */
.questions-list {
  margin-top: 40px;
}

.list-title {
  font-size: 1.5rem;
  color: #3d668f;
  margin-bottom: 15px;
}

.questions {
  list-style-type: none;
  padding: 0;
}

.question-item {
  background-color: #f1f1f1;
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.question-info {
  font-size: 1rem;
  color: #333;
}

.question-name {
  font-weight: bold;
}

.question-email {
  color: #42b983;
}

.question-message {
  margin-top: 10px;
  font-style: italic;
  color: #666;
}

.action-buttons {
  display: flex;
  gap: 10px;
  margin-top: 10px;
}

.btn-delete {
  padding: 8px 12px;
  background-color: #e74c3c;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-delete:hover {
  background-color: #c0392b;
}

.btn-create {
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-create:hover {
  background-color: #3d668f;
}
</style>
