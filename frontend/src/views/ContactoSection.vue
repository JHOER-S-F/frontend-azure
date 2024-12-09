<template>
  <section id="contacto" class="contact-container">
    <h2 class="contact-title">Contacto</h2>
    <p class="contact-text">
      Si tienes alguna pregunta, no dudes en 
      <a href="mailto:info@reservas.com" class="contact-link">contactarnos</a>.
    </p>
    <div class="contact-info">
      <h3 class="contact-subtitle">Información de Contacto</h3>
      <p><strong>Email:</strong> <a href="mailto:info@reservas.com">info@reservas.com</a></p>
      <p><strong>Teléfono:</strong> +57 3204401062</p>
      <p><strong>Dirección:</strong> Calle Ficticia 123, Ciudad, País</p>
    </div>
    
    <button @click="toggleForm" class="toggle-button">
      {{ showForm ? 'Ocultar Formulario' : 'Contactar' }}
    </button>

    <form v-if="showForm" @submit.prevent="sendMessage" class="contact-form">
      <div v-if="!user" class="form-group">
        <label for="name" class="form-label">Nombre:</label>
        <input id="name" type="text" v-model="name" required placeholder="Tu nombre" class="form-input" />
      </div>
      <div v-if="!user" class="form-group">
        <label for="email" class="form-label">Correo:</label>
        <input id="email" type="email" v-model="email" required placeholder="Tu correo" class="form-input" />
      </div>
      <div v-if="user" class="form-group">
        <label for="name" class="form-label">Nombre:</label>
        <input id="name" type="text" v-model="user.nombre" readonly class="form-input" />
      </div>
      <div v-if="user" class="form-group">
        <label for="email" class="form-label">Correo:</label>
        <input id="email" type="email" v-model="user.correo" readonly class="form-input" />
      </div>
      <div class="form-group">
        <label for="message" class="form-label">Mensaje:</label>
        <textarea id="message" v-model="message" required placeholder="Tu mensaje" rows="4" class="form-input"></textarea>
      </div>
      <button type="submit" class="submit-button">Enviar Mensaje</button>
    </form>
    
    <p v-if="error" class="error-message">{{ error }}</p>
    <p v-if="success" class="success-message">{{ success }}</p>
  </section>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  name: 'ContactoSection',
  data() {
    return {
      name: '',
      email: '',
      message: '',
      error: null,
      success: null,
      showForm: false,
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUser', // Obtener información del usuario desde Vuex
    }),
  },
  methods: {
    toggleForm() {
      this.showForm = !this.showForm;
    },
    async sendMessage() {
      this.error = null; 
      this.success = null; 

      if (!this.message) {
        this.error = 'El campo mensaje es obligatorio.';
        return;
      }

      try {
        const response = await axios.post('/api/cam/contact', {
          name: this.user ? this.user.nombre : this.name,
          email: this.user ? this.user.correo : this.email,
          message: this.message,
        });

        if (response.data.success) {
          this.success = response.data.success;
          if (!this.user) {
            this.name = '';
            this.email = '';
          }
          this.message = '';
        }
      } catch (error) {
        if (error.response && error.response.data && error.response.data.error) {
          this.error = error.response.data.error;
        } else {
          this.error = 'Error al enviar el mensaje. Intenta de nuevo más tarde.';
        }
      }
    },
  },
};
</script>




<style scoped>
.contact-container {
  max-width: 600px;
  margin: 50px auto;
  padding: 30px;
  background: linear-gradient(top, #b8e5ff 53%, #b8e5ff 100%);
  border-radius: 12px;
  box-shadow: 6px 7px 22px 1px rgba(87,86,87,0.56);
  transition: transform 0.3s ease-in-out;
}

.contact-container:hover {
  transform: translateY(-5px);
}

.contact-title {
  color: var(--color-verde);
  font-size: 30px;
  margin-bottom: 20px;
  font-family: 'Concert One', sans-serif;
  text-align: center;
}

.contact-text {
    font-family: 'Dosis', Sans-Serif;
    color: #555;
    line-height: 1.8;
}

.contact-link {
  color: var(--color-amarillo);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: var(--color-azul);
}

.contact-info {
  margin-top: 25px;
  padding: 20px;
  background-color: #ecece2;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  color: var(--color-gris);
}

.contact-subtitle {
  font-family: 'Dosis', Serif;
  color: var(--color-azul);
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-family: 'Advent Pro', Sans-Serif;
  font-size: 16px;
  color: var(--color-amarillo);
  margin-bottom: 5px;
  display: block;
  font-weight: 600;
}

.form-input {
  width: 100%;
  height:40px;
  margin-right: 40px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Dosis', sans-serif;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: var(--color-amarillo);
  outline: none;
  box-shadow: 0 0 5px rgba(66, 183, 131, 0.5);
}

.toggle-button {
  margin: 20px 0;
  padding: 10px;
  background-color: var(--color-verde);
  color: var(--color-blanco);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-family: 'Rajdhani', Sans-Serif;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.toggle-button:hover {
  background-color: var(--color-amarillo);
  transform: scale(1.05);
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: var(--color-amarillo);
  color: var(--color-negro);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-button:hover {
  background-color: var(--color-verde);
  color: #fff;
  transform: scale(1.05);
}

.error-message,
.success-message {
  margin-top: 15px;
  font-weight: bold;
}

.error-message {
  color: #f64835;
}

.success-message {
  color: #28a745;
}

</style>
