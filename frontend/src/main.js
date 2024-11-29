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

// Establecer la URL base de Axios desde las variables de entorno
const baseURL = process.env.NODE_ENV === 'production' 
  ? 'https://jhoer-soccerbook-cmcre0g5ffd5augt.eastus2-01.azurewebsites.net' 
  : 'http://localhost:3000';
axios.defaults.baseURL = baseURL;

// Configuración de interceptores de Axios para manejar errores globalmente
axios.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
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

// Verificar autenticación al cargar la aplicación
app.mount('#app');

// Comprobación del estado de autenticación al montar la app
app.config.globalProperties.$mounted = false;
app.mixin({
  mounted() {
    if (!this.$mounted) {
      this.$store.dispatch('checkAuth');
      this.$mounted = true;
    }
  }
});
