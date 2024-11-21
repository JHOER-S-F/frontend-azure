<template>
  <nav class="navbar">
    <ul class="nav-list">
      
      <h1 ><a class="titlle" href="/">SoccerBook</a></h1>


      <!-- Enlaces visibles para todos -->
      <li><router-link to="/contacto" class="nav-link">Contacto</router-link></li>
      <li><router-link to="/sobre-nosotros" class="nav-link">Sobre Nosotros</router-link></li>

      <!-- Enlaces visibles solo si el usuario está autenticado -->
      <li v-if="isLoggedIn">
        <router-link to="/reservar" class="nav-link">Reservar</router-link>
      </li>

      <!-- Enlaces visibles solo si el usuario no está autenticado -->
      <li v-if="!isLoggedIn">
        <router-link to="/login" class="nav-link">Iniciar Sesión</router-link></li>
      <li v-if="!isLoggedIn">
        <router-link to="/register" class="nav-link">Registrarse</router-link></li>

      <!-- Botón de cerrar sesión visible solo si el usuario está autenticado -->
      <li v-if="isLoggedIn">
        <button @click="handleLogout" class="logout-button">Cerrar Sesión</button>
      </li>
    </ul>
  </nav>
</template>

<script>
import { mapGetters, mapActions } from 'vuex';

export default {
  computed: {
    // Obtener el estado de autenticación desde Vuex
    ...mapGetters(['isLoggedIn']),
  },
  methods: {
    // Mapeo de acciones de Vuex
    ...mapActions(['logout']),
    
    // Método para manejar el cierre de sesión
    handleLogout() {
      this.logout()
        .then(() => {
          // Redirigir al usuario a la página de inicio de sesión después de cerrar sesión
          this.$router.push('/');
        })
        .catch((err) => {
          console.error('Error al cerrar sesión:', err);
        });
    },
  },
};
</script>

<style scoped>
@import url('../styles/NavBarComponent.css');  /* Importando los estilos externos */

/* Los estilos locales pueden ir aquí si los necesitas */
</style>