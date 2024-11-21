
  export default {
    name: 'SobreNosotros',
    data() {
      return {
        activeAccordion: null, // Controla qué texto desplegable está abierto
      };
    },
    methods: {
      toggleAccordion(index) {
        this.activeAccordion = this.activeAccordion === index ? null : index;
      },
    },
  };