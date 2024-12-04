<template>
  <div class="gestion-reservas">

    <!-- Lista de Reservas -->
    <div class="lista-reservas">
      <h2 class="subtitulo">Reservas Actuales</h2>
      <table class="tabla-reservas">
        <thead>
          <tr>
            <th>ID</th>
            <th>Cancha</th>
            <th>Fecha</th>
            <th>Hora Inicio</th>
            <th>Hora Fin</th>
            <th>Cliente</th>
            <th>Usuario</th>
            <th>Fecha de Creación</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reserva in reservas" :key="reserva.id">
            <td>{{ reserva.id }}</td>
            <td>{{ reserva.nombre_cancha }}</td>
            <td>{{ reserva.fecha }}</td>
            <td>{{ reserva.hora_inicio }}</td>
            <td>{{ reserva.hora_fin }}</td>
            <td>{{ reserva.nombre_cliente }}</td>
            <td>{{ reserva.nombre_usuario }}</td>
            <td>{{ reserva.fecha_creacion }}</td>
            <td>
              <button class="btn btn-editar" @click="editReserva(reserva.id)">Editar</button>
              <button class="btn btn-eliminar" @click="deleteReserva(reserva.id)">Eliminar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Formulario para editar una reserva -->
    <div v-if="isEditMode" class="formulario-editar">
      <h2 class="subtitulo">{{ formTitle }}</h2>
      <form @submit.prevent="submitForm">
        <div class="campo">
          <label for="cancha_id">Cancha:</label>
          <input type="text" id="cancha_id" v-model="form.cancha_id" required />
        </div>
        <div class="campo">
          <label for="fecha">Fecha:</label>
          <input type="date" id="fecha" v-model="form.fecha" required />
        </div>
        <div class="campo">
          <label for="hora_inicio">Hora Inicio:</label>
          <input type="time" id="hora_inicio" v-model="form.hora_inicio" required />
        </div>
        <div class="campo">
          <label for="hora_fin">Hora Fin:</label>
          <input type="time" id="hora_fin" v-model="form.hora_fin" required />
        </div>
        <div class="campo">
          <label for="cliente_id">Cliente:</label>
          <select id="cliente_id" v-model="form.cliente_id" required>
            <option v-for="cliente in clientes" :value="cliente.id" :key="cliente.id">{{ cliente.nombre }}</option>
          </select>
        </div>
        <button class="btn btn-actualizar" type="submit">Actualizar Reserva</button>
      </form>
    </div>

  </div>
</template>

<script>
export default {
  data() {
    return {
      reservas: [],
      clientes: [],  // Lista de clientes para el select
      form: {
        id: null,
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        cliente_id: '',  // Usamos cliente_id en lugar de nombre_cliente
      },
      isEditMode: false,
      formTitle: 'Editar Reserva',
      successMessage: '',  // Mensaje de éxito
      errorMessage: '',  // Mensaje de error
    };
  },
  methods: {
    // Cargar las reservas al cargar el componente
    async loadReservas() {
      try {
        const response = await fetch('/api/admin/reservas');
        if (!response.ok) {
          throw new Error('Error al cargar las reservas');
        }
        const data = await response.json();
        this.reservas = data;
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Hubo un problema al cargar las reservas.';
        alert(this.errorMessage); // Alerta de error
      }
    },

    // Cargar la lista de clientes
    async loadClientes() {
      try {
        const response = await fetch('/api/admin/clientes');
        if (!response.ok) {
          throw new Error('Error al cargar los clientes');
        }
        const data = await response.json();
        this.clientes = data;
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Hubo un problema al cargar los clientes.';
        alert(this.errorMessage); // Alerta de error
      }
    },

    // Mostrar los datos de una reserva para editar
    async editReserva(id) {
      try {
        const response = await fetch(`/api/admin/reservas/${id}`);
        if (!response.ok) {
          throw new Error('Error al obtener la reserva');
        }
        const data = await response.json();
        this.form = { ...data };  // Asignamos todos los datos
        this.isEditMode = true;
        this.formTitle = 'Editar Reserva';
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Hubo un problema al obtener los datos de la reserva.';
        alert(this.errorMessage); // Alerta de error
      }
    },

    // Actualizar la reserva
    async submitForm() {
      try {
        const method = 'PUT';
        const url = `/api/admin/reservas/${this.form.id}`;
        const response = await fetch(url, {
          method,
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(this.form),
        });

        if (response.ok) {
          this.successMessage = 'Reserva actualizada correctamente.';
          alert(this.successMessage); // Alerta de éxito
          this.resetForm();
          this.loadReservas();
        } else {
          const data = await response.json();
          this.errorMessage = data.error || 'Hubo un problema al actualizar la reserva.';
          alert(this.errorMessage); // Alerta de error
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Hubo un problema al enviar los datos.';
        alert(this.errorMessage); // Alerta de error
      }
    },

    // Eliminar una reserva
    async deleteReserva(id) {
      try {
        const response = await fetch(`/api/admin/reservas/${id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          this.successMessage = 'Reserva eliminada correctamente.';
          alert(this.successMessage); // Alerta de éxito
          this.loadReservas();
        } else {
          const data = await response.json();
          this.errorMessage = data.error || 'Hubo un problema al eliminar la reserva.';
          alert(this.errorMessage); // Alerta de error
        }
      } catch (error) {
        console.error(error);
        this.errorMessage = 'Hubo un problema al eliminar la reserva.';
        alert(this.errorMessage); // Alerta de error
      }
    },

    // Restablecer el formulario
    resetForm() {
      this.form = {
        id: null,
        cancha_id: '',
        fecha: '',
        hora_inicio: '',
        hora_fin: '',
        cliente_id: '',
      };
      this.isEditMode = false;
      this.formTitle = 'Editar Reserva';
    },
  },
  mounted() {
    this.loadReservas();
    this.loadClientes();  // Cargamos la lista de clientes
  },
};
</script>





<style scoped>
/* Estilos generales */
.gestion-reservas {
  font-family: Arial, sans-serif;
  margin: 20px;
}

.titulo-principal, .subtitulo {
  text-align: center;
  margin-bottom: 20px;
}

.tabla-reservas {
  width: 100%;
  border-collapse: collapse;
  margin: 20px 0;
  background-color: #f9f9f9;
}

.tabla-reservas th, .tabla-reservas td {
  padding: 15px;
  text-align: left;
  border: 1px solid #ddd;
}

.tabla-reservas th {
  background-color: #78EB14;
  color: white;
}

/* Botones */
.btn {
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  opacity: 0.9;
}

.btn-editar {
  background-color: #407cc6;
  color: white;
}

.btn-eliminar {
  background-color: #c1b402;
  color: white;
}

.btn-actualizar {
  background-color: #78EB14;
  color: white;
}

/* Formulario */
.formulario-editar {
  max-width: 500px;
  margin: 0 auto;
  padding: 20px;
  background-color: #f9f9f9;
  border: 1px solid #ddd;
  border-radius: 8px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
}

.campo {
  margin-bottom: 15px;
}

.campo label {
  display: block;
  margin-bottom: 5px;
  font-weight: bold;
}

.campo input {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

/* Responsividad */
@media (max-width: 768px) {
  .tabla-reservas, .tabla-reservas thead, .tabla-reservas tbody, .tabla-reservas th, .tabla-reservas td, .tabla-reservas tr {
    display: block;
  }

  .tabla-reservas th, .tabla-reservas td {
    width: 100%;
    text-align: right;
    padding-left: 50%;
    position: relative;
  }

  .tabla-reservas th::before, .tabla-reservas td::before {
    content: attr(data-label);
    position: absolute;
    left: 10px;
    text-align: left;
  }
}
</style>
