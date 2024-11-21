<template>
  <div class="container">
    <h1 class="form-title">{{ isEdit ? 'Actualizar Cancha' : 'Crear Cancha' }}</h1>

    <form @submit.prevent="handleSubmit" class="form">
      <div class="form-group">
        <label for="nombre" class="form-label">Nombre de la Cancha:</label>
        <input v-model="form.nombre" type="text" id="nombre" required class="form-input" />
      </div>

      <div class="form-group">
        <label for="direccion" class="form-label">Dirección:</label>
        <input v-model="form.direccion" type="text" id="direccion" required class="form-input" />
      </div>

      <div class="form-group">
        <label for="cliente_id" class="form-label">Cliente:</label>
        <select v-model="form.cliente_id" id="cliente_id" required class="form-select">
          <option v-for="cliente in clientes" :key="cliente.id" :value="cliente.id">
            {{ cliente.nombre }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label for="disponibilidad" class="form-label">Disponibilidad:</label>
        <select v-model="form.disponibilidad" id="disponibilidad" class="form-select">
          <option value="1">Disponible</option>
          <option value="0">No disponible</option>
        </select>
      </div>

      <button type="submit" class="submit-btn">{{ isEdit ? 'Actualizar' : 'Crear' }}</button>
    </form>

    <h2 class="list-title">Lista de Canchas</h2>
    <div v-if="canchas.length === 0" class="empty-message">No hay canchas disponibles.</div>
    <ul class="cancha-list">
      <li v-for="cancha in canchas" :key="cancha.id" class="cancha-item">
        <span class="cancha-name">{{ cancha.nombre }} - {{ cancha.direccion }}</span>
        <button @click="editCancha(cancha)" class="edit-btn">Editar</button>
        <button @click="deleteCancha(cancha.id)" class="delete-btn">Eliminar</button>
      </li>
    </ul>
  </div>
</template>

<script>
import axios from "axios";

export default {
  data() {
    return {
      form: {
        id: null,
        nombre: "",
        direccion: "",
        cliente_id: "",
        disponibilidad: 1,
      },
      clientes: [],
      canchas: [],
      isEdit: false,
    };
  },
  created() {
    this.fetchClientes();
    this.fetchCanchas();
  },
  methods: {
    async fetchClientes() {
      try {
        const response = await axios.get("/api/admin/clientes");
        this.clientes = response.data;
      } catch (error) {
        console.error("Error al obtener clientes:", error);
        alert("Error al obtener clientes");
      }
    },
    async fetchCanchas() {
      try {
        const response = await axios.get("/api/admin/canchas");
        this.canchas = response.data;
      } catch (error) {
        console.error("Error al obtener canchas:", error);
        alert("Error al obtener canchas");
      }
    },
    async handleSubmit() {
      if (this.isEdit) {
        await this.updateCancha();
      } else {
        await this.createCancha();
      }
    },
    async createCancha() {
      const confirm = window.confirm("¿Está seguro de que desea crear esta cancha?");
      if (!confirm) return;

      try {
        const response = await axios.post("/api/admin/canchas", this.form);
        this.canchas.push(response.data);
        this.clearForm();
        alert("Cancha creada exitosamente!");
      } catch (error) {
        console.error("Error al crear la cancha:", error);
        alert("Error al crear la cancha");
      }
    },
    async updateCancha() {
      const confirm = window.confirm("¿Está seguro de que desea actualizar esta cancha?");
      if (!confirm) return;

      try {
        await axios.put(`/api/admin/canchas/${this.form.id}`, this.form);
        this.fetchCanchas();
        this.clearForm();
        this.isEdit = false;
        alert("Cancha actualizada exitosamente!");
      } catch (error) {
        console.error("Error al actualizar la cancha:", error);
        alert("Error al actualizar la cancha");
      }
    },
    async deleteCancha(id) {
      const confirm = window.confirm("¿Está seguro de que desea eliminar esta cancha?");
      if (!confirm) return;

      try {
        await axios.delete(`/api/admin/canchas/${id}`);
        this.fetchCanchas();
        alert("Cancha eliminada exitosamente!");
      } catch (error) {
        console.error("Error al eliminar la cancha:", error);
        alert("Error al eliminar la cancha");
      }
    },
    editCancha(cancha) {
      this.form = { ...cancha };
      this.isEdit = true;
    },
    clearForm() {
      this.form = {
        id: null,
        nombre: "",
        direccion: "",
        cliente_id: "",
        disponibilidad: 1,
      };
    },
  },
};
</script>

<style scoped>
/* Estilos generales */
.container {
  max-width: 900px;
  margin: auto;
  padding: 20px;
  font-family: 'Arial', sans-serif;
  background-color: #f9f9f9;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.form-title {
  text-align: center;
  font-size: 2rem;
  color: #42b983;
  margin-bottom: 20px;
}

.form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.form-group {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 1.1rem;
  margin-bottom: 5px;
}

.form-input,
.form-select {
  padding: 10px;
  border: 1px solid #ccc;
  border-radius: 6px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
}

.form-input:focus,
.form-select:focus {
  border-color: #42b983;
}

.submit-btn {
  padding: 10px 15px;
  background-color: #42b983;
  color: white;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-size: 1.1rem;
  transition: background-color 0.3s ease;
}

.submit-btn:hover {
  background-color: #3d668f;
}

.list-title {
  font-size: 1.5rem;
  color: #3d668f;
  margin-top: 30px;
}

.empty-message {
  text-align: center;
  font-size: 1.2rem;
  color: #e74c3c;
}

.cancha-list {
  list-style-type: none;
  padding-left: 0;
}

.cancha-item {
  background-color: #f1f1f1;
  padding: 15px;
  margin-bottom: 10px;
  border-radius: 6px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.cancha-name {
  font-size: 1.1rem;
  color: #333;
}

.edit-btn,
.delete-btn {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
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
