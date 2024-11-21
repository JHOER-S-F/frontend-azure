<template>
  <div class="client-management">
    <h1 class="title">{{ isEditing ? 'Editar Cliente' : 'Gestión de Clientes' }}</h1>

    <!-- Formulario para crear o actualizar cliente -->
    <form @submit.prevent="handleSubmit" class="client-form">
      <input type="text" v-model="cliente.nombre" placeholder="Nombre" required class="form-input" />
      <input type="text" v-model="cliente.direccion" placeholder="Dirección" required class="form-input" />
      <input type="text" v-model="cliente.telefono" placeholder="Teléfono" required class="form-input" />
      <input type="email" v-model="cliente.correo" placeholder="Correo" required class="form-input" />
      <input type="file" @change="onFileChange" class="file-input" />
      <button type="submit" class="submit-btn">{{ isEditing ? 'Actualizar' : 'Crear' }} Cliente</button>
    </form>

    <div v-if="clientes.length" class="client-list">
      <h2 class="list-title">Clientes</h2>
      <ul class="list">
        <li v-for="cliente in clientes" :key="cliente.id" class="client-item">
          <div class="client-info">
            <p class="client-name"><strong>{{ cliente.nombre }}</strong></p>
            <p>{{ cliente.direccion }}</p>
            <p>{{ cliente.telefono }}</p>
            <p>{{ cliente.correo }}</p>
            <img v-if="cliente.imagenUrl" :src="cliente.imagenUrl" alt="Imagen del Cliente" class="client-image" />
            <div class="action-buttons">
              <button @click="editCliente(cliente)" class="edit-btn">Editar</button>
              <button @click="deleteCliente(cliente.id)" class="delete-btn">Eliminar</button>
            </div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      cliente: {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        imagen: null,
      },
      isEditing: false,
      editingId: null,
      clientes: [],
    };
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get('/api/admin/clientes');
        this.clientes = response.data;
        await this.loadImages();
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
        alert('Error al obtener los clientes');
      }
    },

    async loadImages() {
      for (const cliente of this.clientes) {
        if (cliente.id) {
          const imageUrl = await this.loadImage(cliente.id);
          cliente.imagenUrl = imageUrl;
        }
      }
    },

    async loadImage(clienteId) {
      try {
        const response = await axios.get(`/api/admin/clientes/${clienteId}/imagen`, { responseType: 'blob' });
        return await this.convertBlobToBase64(response.data);
      } catch (error) {
        console.error('Error al cargar la imagen:', error);
        return null;
      }
    },

    convertBlobToBase64(blob) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    },

    async handleSubmit() {
      const formData = new FormData();
      formData.append('nombre', this.cliente.nombre);
      formData.append('direccion', this.cliente.direccion);
      formData.append('telefono', this.cliente.telefono);
      formData.append('correo', this.cliente.correo);
      if (this.cliente.imagen) formData.append('imagen', this.cliente.imagen);

      try {
        if (this.isEditing) {
          const confirm = window.confirm("¿Está seguro de que desea actualizar este cliente?");
          if (!confirm) return;

          await axios.put(`/api/admin/clientes/${this.editingId}`, formData);
          alert('Cliente actualizado exitosamente!');
          this.isEditing = false;
          this.editingId = null;
        } else {
          const confirm = window.confirm("¿Está seguro de que desea crear este cliente?");
          if (!confirm) return;

          await axios.post('/api/admin/clientes', formData);
          alert('Cliente creado exitosamente!');
        }
        this.resetForm();
        this.fetchClientes();
      } catch (error) {
        console.error('Error al guardar el cliente:', error);
        alert('Error al guardar el cliente');
      }
    },

    resetForm() {
      this.cliente = {
        nombre: '',
        direccion: '',
        telefono: '',
        correo: '',
        imagen: null,
      };
    },

    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.cliente.imagen = file;
      }
    },

    async editCliente(cliente) {
      this.cliente = { ...cliente };
      this.editingId = cliente.id;
      this.isEditing = true;
    },

    async deleteCliente(clienteId) {
      const confirm = window.confirm("¿Está seguro de que desea eliminar este cliente?");
      if (!confirm) return;

      try {
        await axios.delete(`/api/admin/clientes/${clienteId}`);
        alert('Cliente eliminado exitosamente!');
        this.fetchClientes();
      } catch (error) {
        console.error('Error al eliminar el cliente:', error);
        alert('Error al eliminar el cliente');
      }
    },
  },
  mounted() {
    this.fetchClientes();
  },
};
</script>

<style scoped>
/* Contenedor principal de la gestión de clientes */
.client-management {
  max-width: 800px;
  margin: auto;
  padding: 20px;
  font-family: Arial, sans-serif;
  background-color: #f9f9f9;
  border-radius: 10px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

/* Título principal */
.title {
  text-align: center;
  color: #42b983;
  font-size: 2rem;
  margin-bottom: 20px;
}

/* Estilo del formulario */
.client-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}

.form-input,
.file-input {
  padding: 10px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.file-input:focus {
  border-color: #42b983;
}

.submit-btn {
  padding: 10px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 1.1rem;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #3d668f;
}

/* Estilos para la lista de clientes */
.client-list {
  margin-top: 30px;
}

.list-title {
  font-size: 1.5rem;
  color: #3d668f;
  margin-bottom: 20px;
}

.list {
  list-style-type: none;
  padding-left: 0;
}

.client-item {
  background-color: #f1f1f1;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.client-info {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.client-name {
  font-size: 1.2rem;
  color: #333;
}

.client-image {
  border-radius: 50%;
  margin-top: 10px;
  width: 100px;
  height: 100px;
}

.action-buttons {
  display: flex;
  gap: 10px;
}

.edit-btn,
.delete-btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background-color 0.3s ease;
}

.edit-btn {
  background-color: #f39c12;
  color: white;
}

.edit-btn:hover {
  background-color: #e67e22;
}

.delete-btn {
  background-color: #e74c3c;
  color: white;
}

.delete-btn:hover {
  background-color: #c0392b;
}
</style>
