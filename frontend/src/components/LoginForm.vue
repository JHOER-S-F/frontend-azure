<template>
  <div class="login-container">
    <h2>INICIAR SESIÓN</h2>
    <form @submit.prevent="loginUser">
      <div class="form-group">
        <label for="correo">Correo:</label>
        <input 
          v-model="credentials.correo" 
          type="email" 
          placeholder="CORREO" 
          id="correo" 
          required
          autocomplete="email"  
        />
      </div>
      <div class="form-group">
        <label for="password">Contraseña:</label>
        <input 
          v-model="credentials.password" 
          type="password" 
          placeholder="CONTRASEÑA" 
          id="password" 
          required
          autocomplete="current-password"  
        />
      </div>
      <div v-if="errorMessage" class="error-message">
        {{ errorMessage }}
      </div>
      <button type="submit">Iniciar Sesión</button>
    </form>
  </div>
</template>

<script>
import { mapActions } from 'vuex';
import { jwtDecode } from 'jwt-decode'; // Importación correcta de jwt-decode

export default {
  data() {
    return {
      credentials: {
        correo: '', 
        password: ''
      },
      errorMessage: null
    };
  },
  methods: {
    ...mapActions(['login']), // Mapea la acción de login desde Vuex

    async loginUser() {
      try {
        this.errorMessage = null; // Limpiar mensaje de error previo
        // Llama a la acción de login del store
        await this.login(this.credentials);

        // Obtiene el token desde localStorage
        const token = localStorage.getItem('token');
        if (token) {
          const user = jwtDecode(token); // Decodifica el token para obtener información del usuario
          console.log('Usuario:', user); // Muestra la información del usuario en la consola

          // Almacena el rol del usuario para usarlo en redirección
          localStorage.setItem('role', user.role); 

          // Redirige según el rol del usuario
          if (user.role === 'admin') {
            this.$router.push('/admin-dashboard'); // Redirige al dashboard del admin
          } else {
            this.$router.push('/user-dashboard'); // Redirige al dashboard del usuario
          }
        }
      } catch (error) {
        this.handleError(error); // Llama a la función de manejo de errores
      }
    },

    handleError(error) {
      // Manejo de errores más específico
      if (error.response) {
        if (error.response.status === 401) {
          this.errorMessage = 'Correo o contraseña incorrectos'; // Mensaje específico para error 401
        } else if (error.response.data && error.response.data.errors) {
          this.errorMessage = error.response.data.errors.join(', '); // Mensaje de error del backend
        } else {
          this.errorMessage = 'Error en el servidor. Inténtalo más tarde.'; // Mensaje para otros errores
        }
      } else {
        this.errorMessage = 'Error al procesar la solicitud. Inténtalo nuevamente más tarde.'; // Mensaje de error general
      }
      console.error('Error de inicio de sesión:', error);
    }
  }
};
</script>



<style scoped>
.login-container {
  text-align: center;
  max-width: 400px;
  margin: 50px auto; /* Espaciado superior para centrar verticalmente */
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: var(--color-blanco); /* Color de fondo usando la paleta */
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
}

h2 {
  color: var(--color-verde); /* Usar color verde para el título */
  font-size: 24px;
  margin-bottom: 20px;
}

.form-group {
  margin-bottom: 15px;
}

input {
  width: 100%;
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
  font-size: 16px;
  text-align: center;
  transition: border-color 0.3s; /* Transición suave para el borde */
}

input:focus {
  border-color: var(--color-amarillo); /* Usar color amarillo al enfocar */
  outline: none; /* Sin borde de enfoque */
}

button {
  width: 100%;
  padding: 10px;
  background-color: var(--color-amarillo); /* Color de fondo usando la paleta */
  color: var(--color-blanco); /* Color de texto usando la paleta */
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 16px;
  transition: background-color 0.3s; /* Transición suave para el fondo */
}

button:hover {
  background-color: var(--color-azul); /* Color de fondo al pasar el ratón */
}

.error-message {
  color: #f64835; /* Color rojo para los mensajes de error */
  margin-bottom: 10px;
  font-weight: bold; /* Resaltar mensaje de error */
}
</style>
