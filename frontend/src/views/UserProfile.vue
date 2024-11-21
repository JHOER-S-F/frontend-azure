<template>
  <div class="perfil-container" ref="perfilContainer">
    <!-- Imagen de perfil, clic para desplegar/ocultar información -->
    <div class="perfil-circle" @click="toggleDropdown" v-show="!isDropdownOpen">
      <img src="../assets/a2.jpg" alt="Perfil" />
    </div>

    <!-- Menú desplegable con la información del perfil -->
    <div v-if="isDropdownOpen" class="perfil-dropdown-menu">
      <!-- Imagen dentro del menú desplegable -->
      <div class="perfil-circle-dropdown">
        <img src="../assets/a2.jpg" alt="Perfil" />
      </div>

      <div class="perfil-info">
        <p><strong>Bienvenido</strong> {{ user.nombre }}</p>
        <p><strong>Correo</strong> {{ user.correo }}</p>
      </div>

      <button class="logout-button" @click="handleLogout">Cerrar Sesión</button>
    </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';
import axios from 'axios';

export default {
  data() {
    return {
      isDropdownOpen: false, // Estado para manejar la visibilidad del menú desplegable
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUser', // Getter que obtiene la información del usuario desde Vuex
    }),
  },
  methods: {
    ...mapActions({
      logout: 'logout', // Acción para cerrar sesión desde Vuex
    }),

    async fetchUser() {
      try {
        const response = await axios.get('http://localhost:3000/api/auth/user', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        this.$store.commit('SET_USER', response.data); // Guardar usuario en Vuex
      } catch (error) {
        console.error('Error al obtener la información del usuario:', error);
        if (error.response && error.response.status === 401) {
          this.$router.push('/login'); // Redirigir al login si no está autorizado
        }
      }
    },

    async handleLogout() {
      try {
        await this.logout(); // Acción para cerrar sesión
        localStorage.removeItem('token'); // Eliminar token del almacenamiento local
        this.$router.push('/login'); // Redirigir al login
      } catch (error) {
        console.error('Error al cerrar sesión:', error);
      }
    },

    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen; // Alternar el menú desplegable
    },

    // Cerrar el menú desplegable si se hace clic fuera de él
    handleClickOutside(event) {
      if (this.isDropdownOpen && !this.$refs.perfilContainer.contains(event.target)) {
        this.isDropdownOpen = false;
      }
    },
  },
  mounted() {
    this.fetchUser(); // Obtener información del usuario cuando el componente se monta
    document.addEventListener('click', this.handleClickOutside); // Agregar evento para detectar clic fuera
  },
  beforeUnmount() {
    document.removeEventListener('click', this.handleClickOutside); // Remover evento al desmontar
  },
};
</script>

<style scoped>
.perfil-container {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 100;
}

.perfil-circle, .perfil-circle-dropdown {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  box-shadow: 0px 4px 15px rgba(0, 0, 0, 0.2);
}

.perfil-circle img, .perfil-circle-dropdown img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.perfil-dropdown-menu {
  position: absolute;
  top: 100px;
  right: 0;
  background: linear-gradient(135deg, #42b983, #3d668f);
  border-radius: 15px;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.3);
  padding: 25px;
  width: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.perfil-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
  color: white;
}

.logout-button {
  background-color: #ff4d4f;
  color: white;
  padding: 12px 0;
  border: none;
  border-radius: 25px;
  cursor: pointer;
  width: 100%;
  font-size: 1.2rem;
  font-weight: bold;
  transition: background-color 0.3s ease, transform 0.3s ease;
}
</style>
