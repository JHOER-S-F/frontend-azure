<template>
  <div v-if="userRole === 'admin'" class="admin-dashboard">
    <div class="dashboard">
      <h1 class="dashboard-title">Administrador</h1>
      <div class="stats">
        <div v-if="dashboardData" class="stat">
          <p>Total de Canchas: {{ dashboardData.totalCanchas }}</p>
          <p>Total de Clientes: {{ dashboardData.totalClientes }}</p>
          <p>Total de Reservas: {{ dashboardData.totalReservas }}</p>
          <p>Total de Preguntas: {{ dashboardData.totalPreguntas }}</p>
          <p>Total de usuarios: {{ dashboardData.totalUsuarios }}</p>
        </div>
        <div v-else>
          <p>Cargando estadísticas...</p>
        </div>
      </div>
      <div class="top-data">
        <h2>Canchas más reservadas</h2>
        <ul>
          <li v-for="cancha in topCanchas" :key="cancha.nombre">
            {{ cancha.nombre }} - {{ cancha.reservasCount }} reservas
          </li>
        </ul>
        <h2>Clientes más activos</h2>
        <ul>
          <li v-for="cliente in topClientes" :key="cliente.nombre">
            {{ cliente.nombre }} - {{ cliente.reservasCount }} reservas
          </li>
        </ul>
      </div>
    </div>

    <button class="toggle-button" @click="toggleSidebar">☰</button>

    <div class="sidebar" :class="{ open: isOpen }">
      <NavigationButton
        v-for="section in sections"
        :key="section.name"
        :label="section.label"
        :section="section.name"
        :active="currentSection === section.name"
        @changeSection="currentSection = $event"
      />
      <button class="logout-btn" @click="logout">Cerrar sesión</button>
    </div>

    <div v-if="currentSection === 'canchas'" class="section-content">
      <h2>Gestionar Canchas</h2>
      <CanchaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'clientes'" class="section-content">
      <h2>Gestionar Clientes</h2>
      <ClienteList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'preguntas'" class="section-content">
      <h2>Gestionar Preguntas</h2>
      <PreguntaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'reservas'" class="section-content">
      <h2>Gestionar Reservas</h2>
      <ReservaList @fetchData="fetchData" />
    </div>
    <div v-if="currentSection === 'usuarios'" class="section-content">
      <h2>Gestionar Usuarios</h2>
      <UsuarioList @fetchData="fetchData" />
    </div>
  </div>

  <div v-else>
    <p>No tienes acceso a esta página.</p>
  </div>
</template>

<script>
import axios from "axios";
import CanchaList from "./views/admin/CanchaList.vue";
import ClienteList from "./views/admin/ClienteList.vue";
import PreguntaList from "./views/admin/PreguntaList.vue";
import ReservaList from "./views/admin/ReservaList.vue";
import UsuarioList from "./views/admin/UsuarioList.vue";
import NavigationButton from "./components/NavigationButton.vue";

export default {
  data() {
    return {
      dashboardData: null,
      topCanchas: [],
      topClientes: [],
      currentSection: "canchas",
      isOpen: false,
      sections: [
        { name: "canchas", label: "Gestionar Canchas" },
        { name: "clientes", label: "Gestionar Clientes" },
        { name: "preguntas", label: "Gestionar Preguntas" },
        { name: "reservas", label: "Gestionar Reservas" },
        { name: "usuarios", label: "Gestionar Usuarios" },
      ],
    };
  },
  created() {
    this.fetchDashboardData();
    this.fetchTopCanchasReservadas();
    this.fetchTopClientesActivos();
  },
  computed: {
    userRole() {
      return this.$store.getters.userRole;
    },
  },
  methods: {
    async fetchDashboardData() {
      try {
        const response = await axios.get("/api/admin/dashboard");
        this.dashboardData = response.data;
      } catch (error) {
        console.error("Error al obtener las estadísticas del dashboard", error);
      }
    },
    async fetchTopCanchasReservadas() {
      try {
        const response = await axios.get("/api/admin/top-canchas");
        this.topCanchas = response.data;
      } catch (error) {
        console.error("Error al obtener las canchas más reservadas", error);
      }
    },
    async fetchTopClientesActivos() {
      try {
        const response = await axios.get("/api/admin/top-clientes");
        this.topClientes = response.data;
      } catch (error) {
        console.error("Error al obtener los clientes más activos", error);
      }
    },
    fetchData() {
      console.log("Recargando datos...");
    },
    logout() {
      localStorage.removeItem("token");
      localStorage.removeItem("tokenExpiration");
      localStorage.removeItem("userRole");
      this.$store.commit("CLEAR_AUTH_TOKEN");
      this.$router.push("/login");
    },
    toggleSidebar() {
      this.isOpen = !this.isOpen;
    },
  },
  components: {
    CanchaList,
    ClienteList,
    PreguntaList,
    ReservaList,
    UsuarioList,
    NavigationButton,
  },
};
</script>

<style scoped>
/* Estilos generales */
.admin-dashboard {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-family: 'Arial', sans-serif;
  background-color: #f4f7fa;
  padding: 20px;
}

.dashboard {
  background: #fff;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  padding: 20px;
  width: 100%;
  max-width: 1200px;
}

.dashboard-title {
  text-align: center;
  font-size: 2.5rem;
  color: #42b983;
  margin-bottom: 20px;
}

.stats, .top-data {
  margin-bottom: 2rem;
}

h2 {
  font-size: 1.5rem;
  color: #3d668f;
  margin-bottom: 10px;
}

ul {
  list-style-type: none;
  padding-left: 0;
}

li {
  background-color: #f1f1f1;
  margin: 5px 0;
  padding: 10px;
  border-radius: 6px;
}

/* Barra de navegación */
.toggle-button {
  position: fixed;
  top: 1rem;
  left: 1rem;
  background-color: #42b983;
  color: white;
  border: none;
  padding: 1rem;
  font-size: 1.5rem;
  cursor: pointer;
  border-radius: 4px;
  z-index: 1000;
  transition: background-color 0.3s;
}

.toggle-button:hover {
  background-color: #3d668f;
}

.sidebar {
  position: fixed;
  top: 0;
  left: -250px;
  width: 250px;
  height: 100%;
  background-color: #333;
  color: white;
  padding: 20px;
  transition: transform 0.3s ease-in-out;
  z-index: 999;
}

.sidebar.open {
  transform: translateX(250px);
}

.sidebar button {
  display: block;
  width: 100%;
  margin: 1rem 0;
  padding: 1rem;
  background-color: transparent;
  color: white;
  text-align: left;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  border-radius: 4px;
  transition: background-color 0.3s;
}

.sidebar button.active {
  background-color: #42b983;
}

.sidebar button:hover {
  background-color: #3d668f;
}

.logout-btn {
  background-color: red;
  color: white;
  font-weight: bold;
  margin-top: 20px;
}

/* Contenido de las secciones */
.section-content {
  width: 100%;
  padding: 20px;
  margin-top: 50px;
}

.section-content h2 {
  color: #3d668f;
}

/* Estilos de transición y sombras */
button {
  padding: 0.75rem 1.5rem;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  transition: background-color 0.3s, transform 0.3s;
}

button:hover {
  background-color: #3d668f;
  transform: translateY(-2px);
}

button:active {
  transform: translateY(1px);
}
</style>
