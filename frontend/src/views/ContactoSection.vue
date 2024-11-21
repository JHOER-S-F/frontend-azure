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
  watch: {
    user: {
      immediate: true,
      handler(newUser) {
        if (newUser) {
          this.name = newUser.nombre || ''; // Asegúrate de que el nombre se llame "nombre" en tu store
          this.email = newUser.correo || ''; // Asegúrate de que el correo se llame "correo" en tu store
        }
      },
    },
  },
  created() {
    this.fetchUser(); // Llama a la función para obtener el usuario al crear el componente
  },
  methods: {
    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.$store.commit('SET_USER', response.data);
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        // No redirigimos a /login para permitir el acceso a la sección de contacto
      }
    },
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
        const response = await axios.post('http://localhost:3000/api/cam/contact', {
          name: this.user ? this.user.nombre : this.name, // Utiliza el nombre autenticado si está presente
          email: this.user ? this.user.correo : this.email, // Utiliza el correo autenticado si está presente
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
  background: linear-gradient(to right, #42b983, #3d668f);
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1);
  transition: transform 0.3s ease-in-out;
}

.contact-container:hover {
  transform: translateY(-5px);
}

.contact-title {
  color: var(--color-primario);
  font-size: 30px;
  margin-bottom: 20px;
  font-family: 'Montserrat', sans-serif;
  text-align: center;
}

.contact-text {
  color: #555;
  line-height: 1.8;
}

.contact-link {
  color: var(--color-secundario);
  text-decoration: none;
  font-weight: bold;
  transition: color 0.3s ease;
}

.contact-link:hover {
  color: var(--color-terciario);
}

.contact-info {
  margin-top: 25px;
  padding: 20px;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
}

.contact-subtitle {
  color: var(--color-terciario);
  margin-bottom: 10px;
  font-weight: bold;
}

.form-group {
  margin-bottom: 20px;
}

.form-label {
  font-size: 16px;
  color: var(--color-secundario);
  margin-bottom: 5px;
  display: block;
  font-weight: 600;
}

.form-input {
  width: 100%;
  padding: 12px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 16px;
  font-family: 'Montserrat', sans-serif;
  transition: border-color 0.3s ease, box-shadow 0.3s ease;
}

.form-input:focus {
  border-color: var(--color-secundario);
  outline: none;
  box-shadow: 0 0 5px rgba(66, 183, 131, 0.5);
}

.toggle-button {
  margin: 20px 0;
  padding: 10px;
  background-color: var(--color-primario);
  color: var(--color-blanco);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 16px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.toggle-button:hover {
  background-color: var(--color-secundario);
  transform: scale(1.05);
}

.submit-button {
  width: 100%;
  padding: 15px;
  background-color: var(--color-secundario);
  color: var(--color-blanco);
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}

.submit-button:hover {
  background-color: var(--color-terciario);
  transform: scale(1.05);
}

.error-message,
.success-message {
  margin-top: 15px;
  font-weight: bold;
}

.error-message {
  color: #e74c3c;
}

.success-message {
  color: #28a745;
}

</style>
