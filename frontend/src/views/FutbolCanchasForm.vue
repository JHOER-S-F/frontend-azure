<template>
  <div>
    <h1 class="titulo">RESERVA TU CANCHA IDEAL</h1>

    <!-- Selección de cliente personalizada -->
    <div class="contenedor">
      <label for="clienteSelect" class="label">SELECCIONA UN CLIENTE</label>
      <div class="custom-select">
        <div 
          class="selected-client" 
          @click="toggleClientDropdown" 
          :title="selectedClient ? selectedClient.nombre : 'Seleccionar Cliente'">
          <div v-if="selectedClient" class="client-image-container">
            <img :src="`data:image/jpeg;base64,${selectedClient.imagen}`" alt="Cliente" class="client-image" />
          </div>
          <div v-if="selectedClient">
            <p class="dcliente">{{ selectedClient.nombre }} <br> {{ selectedClient.direccion }}</p>
          </div>
          <p v-else>Selecciona un Cliente</p>
        </div>
        <ul v-if="isClientDropdownOpen" class="dropdown-list">
          <li 
            v-for="cliente in clientes" 
            :key="cliente.id" 
            class="dropdown-item" 
            @click="selectCliente(cliente)">
            <div class="client-image-container">
              <img :src="`data:image/jpeg;base64,${cliente.imagen}`" alt="Cliente" class="client-image" />
            </div>
            <div>
              <p>{{ cliente.nombre }} <br> {{ cliente.direccion }}</p>
            </div>
          </li>
        </ul>
      </div>
    </div>

    <!-- Lista de canchas disponibles -->
    <div v-if="clienteSeleccionado">
      <h2 class="segundot">CANCHAS DISPONIBLES</h2>
      <ul v-if="canchas.length > 0" class="lista-canchas">
        <li v-for="cancha in canchas" :key="cancha.id" class="item-cancha">
          <span>{{ cancha.nombre }} <br> {{ cancha.direccion }}</span>
          <button @click="seleccionarCancha(cancha)" class="boton-reservar">Reservar</button>
        </li>
      </ul>
      <p v-else>NO HAY DISPONIBILIDAD</p>
    </div>

    <!-- Formulario de reserva -->
    <div v-if="canchaSeleccionada" class="formulario-reserva">
      <h3>RESERVAR CANCHA {{ canchaSeleccionada.nombre }}</h3>
      <form @submit.prevent="reservarCancha">
        <div class="campo-formulario">
          <label for="fecha">FECHA DE LA RESERVA</label>
          <input type="date" v-model="fecha" id="fecha" required class="input"/>
        </div>
        <div class="campo-formulario">
          <label for="horaInicio">INGRESO</label>
          <input type="time" v-model="horaInicio" id="horaInicio" required class="input"/>
        </div>
        <div class="campo-formulario">
          <label for="horaFin">SALIDA</label>
          <input type="time" v-model="horaFin" id="horaFin" required class="input"/>
        </div>
        <div class="campo-formulario">
  <label for="nombreCliente">SU NOMBRE</label>
  <input 
    type="text" 
    v-model="nombreCliente" 
    placeholder="Escribe tu nombre" 
    id="nombreCliente" 
    readonly 
    class="input"
  />
</div>

        <button type="submit" class="boton-reservar">REALIZAR RESERVA</button>
      </form>
    </div>

    <!-- Mensaje de éxito -->
    <div v-if="reservaExito" class="mensaje-exito">
      <p>¡RESERVA EXITOSA! <br> LA CANCHA HA SIDO RESERVADA CORRECTAMENTE</p>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import { mapGetters } from 'vuex';

export default {
  data() {
    return {
      clientes: [],
      canchas: [],
      clienteSeleccionado: null,
      canchaSeleccionada: null,
      fecha: '',
      horaInicio: '',
      horaFin: '',
      nombreCliente: '',  // Esto será el nombre del usuario autenticado
      reservaExito: false,
      selectedClient: null, 
      isClientDropdownOpen: false, 
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUser',  // Obtiene el usuario autenticado desde Vuex
    }),
  },
  created() {
    this.getClientes(); 
    this.nombreCliente = this.user.nombre;  // Asigna el nombre del usuario autenticado al cargar el componente
  },
  methods: {
    async getClientes() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('/api/reservas/getClientes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.clientes = response.data;
        if (this.clientes.length > 0) {
          this.selectedClient = this.clientes[0];
          this.clienteSeleccionado = this.clientes[0].id;
          this.getCanchas(); 
        }
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },
    toggleClientDropdown() {
      this.isClientDropdownOpen = !this.isClientDropdownOpen;
    },
    selectCliente(cliente) {
      this.selectedClient = cliente;
      this.clienteSeleccionado = cliente.id;
      this.isClientDropdownOpen = false; 
      this.getCanchas(); 
    },
    async getCanchas() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`/api/reservas/getCanchas?cliente_id=${this.clienteSeleccionado}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.canchas = response.data;
      } catch (error) {
        console.error('Error al obtener las canchas:', error);
      }
    },
    seleccionarCancha(cancha) {
      this.canchaSeleccionada = cancha;
      this.reservaExito = false; 
    },
    async reservarCancha() {
      const token = localStorage.getItem('token');
      const reserva = {
        cancha_id: this.canchaSeleccionada.id,
        fecha: this.fecha,
        hora_inicio: this.horaInicio,
        hora_fin: this.horaFin,
        nombre_cliente: this.nombreCliente
      };

      try {
        await axios.post('/api/reservas/makeReserva', reserva, {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.reservaExito = true; 
        this.resetForm(); 
      } catch (error) {
        console.error('Error al realizar la reserva:', error);
      }
    },
    resetForm() {
      this.fecha = '';
      this.horaInicio = '';
      this.horaFin = '';
      this.canchaSeleccionada = null;
      this.nombreCliente = this.user.nombre;  // Restablece el nombre del usuario autenticado después de la reserva
    }
  }
};
</script>




<style scoped>
@import url('../styles/FutbolCanchasForm.css');  /* Importando los estilos externos */

/* Los estilos locales pueden ir aquí si los necesitas */
</style>