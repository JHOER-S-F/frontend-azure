import { createApp } from 'vue';
import App from './App.vue'; // Importar el componente principal
import router from './router'; // Importar el router
import store from './store/auth'; // Asegúrate de que el store esté importado correctamente
import axios from 'axios';
import { library } from '@fortawesome/fontawesome-svg-core';
import { faFacebook, faTwitter, faInstagram } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import './styles/global.css'; // Importar estilos globales

// FontAwesome imports
library.add(faFacebook, faTwitter, faInstagram);

// Establecer la URL base de axios
axios.defaults.baseURL = 'http://localhost:3000';

// Configuración de interceptores de Axios para manejar errores globalmente
axios.interceptors.response.use(
  response => response,
  error => {
    // Manejar errores globalmente (ej. 401, 500, etc.)
    if (error.response && error.response.status === 401) {
      // Si la respuesta es 401 (no autorizado), se puede hacer logout
      store.dispatch('logout');
    }
    return Promise.reject(error);
  }
);

// Crear la app Vue
const app = createApp(App);

// Usar el router y el store
app.use(router);
app.use(store);

// Registrar el componente FontAwesome de forma global
app.component('font-awesome-icon', FontAwesomeIcon);

// Verificar autenticación al cargar la aplicación (esto se hace después de montar la app)
app.mount('#app');

// Cuando la app se haya montado, verificar el estado de autenticación
app.config.globalProperties.$mounted = false;
app.mixin({
  mounted() {
    if (!this.$mounted) {
      this.$store.dispatch('checkAuth'); // Verificar autenticación después de montar
      this.$mounted = true;
    }
  }
});
