<template>
  <div class="user-management">
    <h2>Gestión de Usuarios</h2>
    
    <!-- Crear usuario -->
    <div class="create-user">
      <h3>Crear Usuario</h3>
      <form @submit.prevent="createUser">
        <div>
          <label for="nombre">Nombre:</label>
          <input v-model="newUser.nombre" type="text" id="nombre" required />
        </div>
        <div>
          <label for="correo">Correo:</label>
          <input v-model="newUser.correo" type="email" id="correo" required />
        </div>
        <div>
          <label for="password">Contraseña:</label>
          <input v-model="newUser.password" type="password" id="password" required />
        </div>
        <div>
          <label for="role">Rol:</label>
          <select v-model="newUser.role" id="role" required>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="cliente">cliente</option>
          </select>
        </div>
        <div>
          <label for="foto">Foto de perfil:</label>
          <input type="file" @change="handleFileUpload" id="foto" />
        </div>
        <button type="submit">Crear Usuario</button>
      </form>
    </div>

    <!-- Mostrar usuarios -->
    <div class="user-list">
      <h3>Lista de Usuarios</h3>
      <table>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Correo</th>
            <th>Rol</th>
            <th>Foto</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.nombre }}</td>
            <td>{{ user.correo }}</td>
            <td>{{ user.role }}</td>
            <td v-if="user.foto">
              <img :src="'data:image/jpeg;base64,' + user.foto" alt="Foto" width="50" height="50" />
            </td>
            <td>
              <button @click="deleteUser(user.id)">Eliminar</button>
              <button @click="editUser(user.id)">Editar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Editar usuario -->
    <div v-if="editingUser" class="edit-user">
      <h3>Editar Usuario</h3>
      <form @submit.prevent="updateUser">
        <div>
          <label for="edit-nombre">Nombre:</label>
          <input v-model="editingUser.nombre" type="text" id="edit-nombre" required />
        </div>
        <div>
          <label for="edit-correo">Correo:</label>
          <input v-model="editingUser.correo" type="email" id="edit-correo" required />
        </div>
        <div>
          <label for="edit-password">Contraseña:</label>
          <input v-model="editingUser.password" type="password" id="edit-password" />
        </div>
        <div>
          <label for="edit-role">Rol:</label>
          <select v-model="editingUser.role" id="edit-role" required>
            <option value="usuario">Usuario</option>
            <option value="admin">Administrador</option>
            <option value="cliente">cliente</option>
          </select>
        </div>
        <div>
          <label for="edit-foto">Foto de perfil:</label>
          <input type="file" @change="handleFileUpload" id="edit-foto" />
        </div>
        <button type="submit">Actualizar Usuario</button>
      </form>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      newUser: {
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
  created() {
    this.fetchUsers();
  },
  methods: {
    async createUser() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.newUser.nombre);
        formData.append('correo', this.newUser.correo);
        formData.append('password', this.newUser.password);
        formData.append('role', this.newUser.role);
        if (this.newUser.foto) {
          formData.append('foto', this.newUser.foto);
        }

        const response = await axios.post('/api/admin/usuarios', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        // Agregar el nuevo usuario a la lista
        this.users.push(response.data);
        this.resetForm();
        alert('Usuario creado exitosamente');
      } catch (error) {
        console.error(error);
        alert('Error al crear el usuario');
      }
    },

    async fetchUsers() {
      try {
        const response = await axios.get('/api/admin/usuarios');
        this.users = response.data;
      } catch (error) {
        console.error(error);
        alert('Error al obtener los usuarios');
      }
    },

    handleFileUpload(event) {
      const file = event.target.files[0];
      if (file) {
        this.newUser.foto = file;
      }
    },

    async deleteUser(id) {
      try {
        await axios.delete(`/api/admin/usuarios/${id}`);
        this.users = this.users.filter(user => user.id !== id);
        alert('Usuario eliminado');
      } catch (error) {
        console.error(error);
        alert('Error al eliminar el usuario');
      }
    },

    editUser(id) {
      this.editingUser = { ...this.users.find(user => user.id === id) };
    },

    async updateUser() {
      try {
        const formData = new FormData();
        formData.append('nombre', this.editingUser.nombre);
        formData.append('correo', this.editingUser.correo);
        formData.append('password', this.editingUser.password);
        formData.append('role', this.editingUser.role);

        // Si se ha subido una nueva foto, agregarla
        if (this.editingUser.foto) {
          formData.append('foto', this.editingUser.foto);
        } else {
          // Si no se sube una nueva foto, enviar el valor `null` para no modificar la foto
          formData.append('foto', null);
        }

        await axios.put(`/api/admin/usuarios/${this.editingUser.id}`, formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

        this.fetchUsers();
        this.editingUser = null;
        alert('Usuario actualizado');
      } catch (error) {
        console.error(error);
        alert('Error al actualizar el usuario');
      }
    },

    resetForm() {
      this.newUser = {
        nombre: '',
        correo: '',
        password: '',
        role: 'usuario',
        foto: '',
      };
    },
  },
};
</script>


<style scoped>
.user-management {
  padding: 20px;
}

.create-user, .edit-user {
  margin-bottom: 20px;
}

.create-user form, .edit-user form {
  display: grid;
  grid-gap: 10px;
}

.create-user label, .edit-user label {
  font-weight: bold;
}

.create-user button, .edit-user button {
  padding: 10px 20px;
  background-color: #42b983;
  color: white;
  border: none;
  cursor: pointer;
}

.create-user button:hover, .edit-user button:hover {
  background-color: #3d668f;
}

.user-list table {
  width: 100%;
  border-collapse: collapse;
}

.user-list th, .user-list td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: left;
}

.user-list th {
  background-color: #f4f4f4;
}

.user-list img {
  border-radius: 50%;
}
</style>
