<template>
  <div id="app">
    <!-- Mostrar la barra de navegación solo si el usuario no es administrador -->
    <NavBarComponent v-if="!isAdmin"  />

    <!-- Mostrar perfil de usuario si está autenticado -->
    <UserProfile v-if="isLoggedIn" />

   <!-- Router View para cargar las vistas basadas en las rutas -->
    <router-view v-if="!isAdmin" />

    <!-- Mostrar el Dashboard solo si el usuario es admin -->
    <AdminDashboard v-if="isAdmin" />

    <!-- Pie de página -->
    <FooterSection />
  </div>
</template>

<script>
import NavBarComponent from './components/NavBarComponent.vue';
import FooterSection from './components/FooterSection.vue';
import UserProfile from './views/UserProfile.vue';
import AdminDashboard from './AdminDashboard.vue';
import { mapGetters, mapActions } from 'vuex';

export default {
  name: 'App',
  components: {
    NavBarComponent,
    AdminDashboard,
    FooterSection,
    UserProfile,    
  },
  computed: {
    ...mapGetters(['isLoggedIn', 'userRole']),
    isAdmin() {
      return this.userRole === 'admin';
    },
  },
  methods: {
    ...mapActions(['checkAuth']),
  },
  created() {
    this.checkAuth();
  },
};
</script>

<style scoped>
/* Estilos globales o específicos */
</style>
