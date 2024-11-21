<template>
  <div class="user-management">
    <h1 class="title">Gestión de Usuarios</h1>

    <!-- Formulario de creación de usuario -->
    <form @submit.prevent="createUser" autocomplete="on" class="form-container">
      <h2 class="subtitle">Crear Usuario</h2>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="user.nombre" required class="input" autocomplete="name" />
      </div>
      <div class="form-group">
        <label for="correo">Correo</label>
        <input type="email" v-model="user.correo" required class="input" autocomplete="email" />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" v-model="user.password" required class="input" autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label for="role">Rol</label>
        <select v-model="user.role" class="select">
          <option value="usuario">Usuario</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <div class="form-group">
        <label for="foto">Foto de Perfil</label>
        <input type="file" @change="onFileChange" class="file-input" />
      </div>
      <button type="submit" class="button primary">Crear Usuario</button>
    </form>

    <!-- Formulario de actualización de usuario -->
    <form v-if="editingUser" @submit.prevent="updateUser" autocomplete="on" class="form-container">
      <h2 class="subtitle">Actualizar Usuario</h2>
      <div class="form-group">
        <label for="nombre">Nombre</label>
        <input type="text" v-model="editingUser.nombre" required class="input" autocomplete="name" />
      </div>
      <div class="form-group">
        <label for="correo">Correo</label>
        <input type="email" v-model="editingUser.correo" required class="input" autocomplete="email" />
      </div>
      <div class="form-group">
        <label for="password">Contraseña</label>
        <input type="password" v-model="editingUser.password" class="input" autocomplete="new-password" />
      </div>
      <div class="form-group">
        <label for="role">Rol</label>
        <select v-model="editingUser.role" class="select">
          <option value="usuario">Usuario</option>
          <option value="administrador">Administrador</option>
        </select>
      </div>
      <div class="form-group">
        <label for="foto">Foto de Perfil</label>
        <input type="file" @change="onFileChangeUpdate" class="file-input" />
      </div>
      <button type="submit" class="button primary">Actualizar Usuario</button>
    </form>

    <!-- Lista de usuarios -->
    <h2 class="subtitle">Usuarios Registrados</h2>
    <div v-if="users.length === 0" class="no-users">No hay usuarios registrados.</div>
    <ul class="user-list">
      <li v-for="user in users" :key="user.id" class="user-card">
        <div>
          <p class="user-name"><strong>{{ user.nombre }}</strong></p>
          <p class="user-email">{{ user.correo }}</p>
          <p class="user-role">{{ user.role }}</p>
          <img v-if="user.foto" :src="'data:image/jpeg;base64,' + user.foto" alt="Foto de perfil" class="user-photo" />
        </div>
        <div class="actions">
          <button @click="deleteUser(user.id)" class="button danger">Eliminar</button>
          <button @click="editUser(user)" class="button secondary">Editar</button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      user: {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: null,
      },
      users: [],
      editingUser: null,
    };
  },
  methods: {
    async fetchUsers() {
      try {
        const response = await axios.get('/api/admin/usuarios');
        this.users = response.data;
      } catch (error) {
        console.error('Error al obtener usuarios:', error);
      }
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.user.foto = reader.result.split(',')[1]; // Convertir imagen a base64
        };
        reader.readAsDataURL(file);
      }
    },

    onFileChangeUpdate(event) {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = () => {
          this.editingUser.foto = reader.result.split(',')[1]; // Convertir imagen a base64
        };
        reader.readAsDataURL(file);
      }
    },

    async createUser() {
      const confirmation = confirm('¿Estás seguro de que deseas crear este usuario?');
      if (confirmation) {
        try {
          const formData = new FormData();
          formData.append('nombre', this.user.nombre);
          formData.append('correo', this.user.correo);
          formData.append('password', this.user.password);
          formData.append('role', this.user.role);
          if (this.user.foto) {
            const base64Image = this.user.foto.split(',')[1]; // Convertir imagen base64
            formData.append('foto', base64Image);
          }

          await axios.post('/api/admin/usuarios', formData);
          this.fetchUsers();
          this.resetForm();
          alert('Usuario creado con éxito.');
        } catch (error) {
          console.error('Error al crear el usuario:', error);
          alert('Hubo un error al crear el usuario.');
        }
      }
    },

    async updateUser() {
      const confirmation = confirm('¿Estás seguro de que deseas actualizar este usuario?');
      if (confirmation) {
        try {
          const formData = new FormData();
          formData.append('nombre', this.editingUser.nombre);
          formData.append('correo', this.editingUser.correo);
          if (this.editingUser.password) {
            formData.append('password', this.editingUser.password);
          }
          formData.append('role', this.editingUser.role);
          if (this.editingUser.foto) {
            const base64Image = this.editingUser.foto.split(',')[1];
            formData.append('foto', base64Image);
          }

          await axios.put(`/api/admin/usuarios/${this.editingUser.id}`, formData);
          this.fetchUsers();
          this.editingUser = null;
          alert('Usuario actualizado con éxito.');
        } catch (error) {
          console.error('Error al actualizar el usuario:', error);
          alert('Hubo un error al actualizar el usuario.');
        }
      }
    },

    async deleteUser(id) {
      const confirmation = confirm('¿Estás seguro de que deseas eliminar este usuario?');
      if (confirmation) {
        try {
          await axios.delete(`/api/admin/usuarios/${id}`);
          this.fetchUsers();
          alert('Usuario eliminado con éxito.');
        } catch (error) {
          console.error('Error al eliminar el usuario:', error);
          alert('Hubo un error al eliminar el usuario.');
        }
      }
    },

    editUser(user) {
      this.editingUser = { ...user };
    },

    resetForm() {
      this.user = {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: null,
      };
    },
  },
  mounted() {
    this.fetchUsers();
  },
};
</script>

<style scoped>
/* Variables de colores */
:root {
  --primary-color: #42b983;
  --secondary-color: #3d668f;
  --danger-color: #e74c3c;
  --light-gray: #f4f4f4;
  --dark-gray: #333;
  --white: #fff;
}

/* General */
.user-management {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
  background: var(--light-gray);
  border-radius: 8px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.title {
  text-align: center;
  color: var(--primary-color);
  margin-bottom: 20px;
}

.subtitle {
  color: var(--secondary-color);
  margin-bottom: 10px;
}

/* Formularios */
.form-container {
  background: var(--white);
  padding: 20px;
  border-radius: 8px;
  margin-bottom: 20px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.form-group {
  margin-bottom: 15px;
}

.input,
.select,
.file-input {
  width: 100%;
  padding: 10px;
  border: 1px solid var(--dark-gray);
  border-radius: 4px;
  outline: none;
}

.input:focus,
.select:focus {
  border-color: var(--primary-color);
  box-shadow: 0 0 3px var(--primary-color);
}

.button {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.3s ease;
}

.button.primary {
  background-color: var(--primary-color);
  color: var(--white);
}

.button.primary:hover {
  background-color: var(--secondary-color);
}

.button.secondary {
  background-color: var(--secondary-color);
  color: var(--white);
}

.button.secondary:hover {
  background-color: var(--primary-color);
}

.button.danger {
  background-color: var(--danger-color);
  color: var(--white);
}

.button.danger:hover {
  background-color: darken(var(--danger-color), 10%);
}

/* Lista de usuarios */
.user-list {
  list-style: none;
  padding: 0;
}

.user-card {
  background: var(--white);
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.user-name {
  color: var(--dark-gray);
}

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  object-fit: cover;
}

.actions {
  display: flex;
  gap: 10px;
}
</style>