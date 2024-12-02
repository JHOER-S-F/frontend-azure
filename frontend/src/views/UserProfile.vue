<template>
  <div class="profile-container">
    <div class="perfil-circle" @click="toggleDropdown">
      <img :src="user.fotoBase64 ? 'data:image/jpeg;base64,' + user.fotoBase64 : defaultAvatar" alt="Foto de perfil" class="profile-image" />
    </div>

    <div v-if="isDropdownOpen" class="perfil-dropdown-menu">
      <div class="perfil-circle-dropdown">
        <img :src="user.fotoBase64 ? 'data:image/jpeg;base64,' + user.fotoBase64 : defaultAvatar" alt="Foto de perfil" />
      </div>

      <div class="perfil-info">
        <p><strong>Bienvenido:</strong> {{ user.nombre }}</p>
        <p><strong>Correo:</strong> {{ user.correo }}</p>
        <p><strong>Rol:</strong> {{ user.role }}</p>
        <button @click="editProfileImage">Actualizar Foto</button>
      </div>

      <div class="reservas-section">
        <h3>Mis Reservas</h3>
        <ul v-if="reservas.length > 0">
          <li v-for="reserva in reservas" :key="reserva.id">
            <p>Cancha: {{ reserva.cancha_id }}</p>
            <p>Fecha: {{ reserva.fecha }}</p>
            <p>Hora: {{ reserva.hora_inicio }} - {{ reserva.hora_fin }}</p>
          </li>
        </ul>
        <p v-else>No tienes reservas registradas.</p>
      </div>

      <button @click="handleLogout">Cerrar Sesión</button>
    </div>

    <input type="file" ref="fileInput" style="display: none" @change="handleFileUpload" />
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        fotoBase64: '', 
        nombre: '', 
        correo: '', 
        role: '', 
      },
      reservas: [],
      isDropdownOpen: false,
      defaultAvatar: 'https://via.placeholder.com/150',
    };
  },
  methods: {
    async fetchUserData() {
      try {
        const response = await axios.get('/api/profile/user', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.user = response.data.data;
      } catch (error) {
        console.error('Error al obtener los datos del usuario:', error);
      }
    },
    async fetchUserReservas() {
      try {
        const response = await axios.get('/api/profile/user/reservas', {
          headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
        });
        this.reservas = response.data.data;
      } catch (error) {
        console.error('Error al obtener las reservas:', error);
      }
    },
    editProfileImage() {
      this.$refs.fileInput.click();
    },
    handleFileUpload(event) {
      const file = event.target.files[0];
      const formData = new FormData();
      formData.append('image', file);

      axios
        .post('/api/profile/user/update-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        })
        .then(() => this.fetchUserData())
        .catch((error) => console.error('Error al actualizar la foto de perfil:', error));
    },
    toggleDropdown() {
      this.isDropdownOpen = !this.isDropdownOpen;
    },
    handleLogout() {
      localStorage.removeItem('token');
      this.$router.push('/login');
    },
  },
  mounted() {
    this.fetchUserData();
    this.fetchUserReservas();
  },
};
</script>

<style scoped>
/* Agrega tus estilos personalizados aquí */
.profile-container {
  position: relative;
}
.perfil-circle {
  cursor: pointer;
}
.perfil-dropdown-menu {
  position: absolute;
  background: white;
  border: 1px solid #ccc;
  padding: 10px;
  border-radius: 5px;
}
</style>


<style scoped>
.profile-container {
  position: fixed; /* Hace que el contenedor del perfil esté fijo en la pantalla */
  top: 20px; /* Espacio desde la parte superior */
  right: 20px; /* Espacio desde el borde derecho */
  z-index: 1000; /* Asegura que el perfil esté por encima de otros elementos */
  width: 80px; /* Mantener un tamaño pequeño para el contenedor */
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
  top: 100px; /* Ajusta la distancia del menú desplegable desde la imagen de perfil */
  right: 0;
  background: linear-gradient(135deg, #42b983, #3d668f);
  border-radius: 15px;
  box-shadow: 0px 6px 25px rgba(0, 0, 0, 0.3);
  padding: 25px;
  width: 270px;
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 999; /* Asegura que el menú esté por encima de otros elementos */
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

button {
  margin-top: 20px;
  padding: 10px 20px;
  cursor: pointer;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 5px;
}

.reservas-section {
  margin-top: 20px;
}

.reservas-section ul {
  list-style: none;
  padding: 0;
}

.reservas-section li {
  margin: 10px 0;
}
</style>
