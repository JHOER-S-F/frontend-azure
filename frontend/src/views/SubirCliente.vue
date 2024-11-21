<template>
  <div>
    <h1>Agregar Cliente</h1>
    <form @submit.prevent="subirCliente">
      <div>
        <label for="nombre">Nombre del Cliente:</label>
        <input type="text" v-model="cliente.nombre" required />
      </div>
      <div>
        <label for="direccion">Dirección del Cliente:</label>
        <input type="text" v-model="cliente.direccion" required />
      </div>
      <div>
        <label for="correo">Correo del Cliente:</label>
        <input type="email" v-model="cliente.correo" required />
      </div>
      <div>
        <label for="telefono">Teléfono del Cliente:</label>
        <input type="text" v-model="cliente.telefono" />
      </div>
      <div>
        <label for="imagen">Imagen del Cliente:</label>
        <input type="file" @change="onFileChange" required />
      </div>
      <button type="submit">Agregar Cliente</button>
    </form>
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
        correo: '',
        telefono: '',
        imagen: null
      }
    };
  },
  methods: {
    onFileChange(event) {
      const file = event.target.files[0];
      if (file) {
        this.cliente.imagen = file;
      }
    },
    async subirCliente() {
      const formData = new FormData();
      formData.append('nombre', this.cliente.nombre);
      formData.append('direccion', this.cliente.direccion);
      formData.append('correo', this.cliente.correo);
      formData.append('telefono', this.cliente.telefono);
      formData.append('imagen', this.cliente.imagen);

      try {
        const response = await axios.post('http://localhost:3000/api/clientes', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });
        console.log(response.data);
      } catch (error) {
        console.error('Error al agregar el cliente:', error);
      }
    }
  }
};
</script>
