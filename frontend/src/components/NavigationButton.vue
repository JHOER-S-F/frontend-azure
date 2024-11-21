<template>
    <button 
      :class="['sidebar-button', { active: isActive }]" 
      @click="changeSection"
    >
      {{ label }}
    </button>
  </template>
  
  <script>
  export default {
    props: {
      label: {
        type: String,
        required: true
      },
      section: {
        type: String,
        required: true
      },
      active: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      isActive() {
        return this.active;
      }
    },
    methods: {
      changeSection() {
        // Emitir el nombre de la sección al componente padre
        this.$emit('changeSection', this.section);
      }
    }
  };
  </script>
  
  <style scoped>
  .sidebar-button {
    width: 100%;
    padding: 1rem;
    text-align: left;
    background-color: transparent;
    border: none;
    color: white;
    font-size: 1.1rem;
    cursor: pointer;
    border-radius: 4px;
    transition: background-color 0.3s;
  }
  
  .sidebar-button:hover {
    background-color: #42b983;
  }
  
  .sidebar-button.active {
    background-color: #3d668f;
  }
  </style>
  