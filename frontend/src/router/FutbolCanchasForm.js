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
      reservaExito: false,
    };
  },
  computed: {
    ...mapGetters({
      user: 'getUser', // Obtiene la información del usuario desde Vuex
    }),
  },
  created() {
    this.getClientes();
  },
  methods: {
    async getClientes() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get('http://localhost:3000/api/reservas/getClientes', {
          headers: { Authorization: `Bearer ${token}` }
        });
        this.clientes = response.data;
        if (this.clientes.length > 0) {
          this.clienteSeleccionado = this.clientes[0].id;
          this.getCanchas();
        }
      } catch (error) {
        console.error('Error al obtener los clientes:', error);
      }
    },
    async getCanchas() {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.get(`http://localhost:3000/api/reservas/getCanchas?cliente_id=${this.clienteSeleccionado}`, {
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
        nombre_cliente: this.user.nombre // Usa el nombre desde Vuex
      };

      try {
        await axios.post('http://localhost:3000/api/reservas/makeReserva', reserva, {
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
    }
  }
};