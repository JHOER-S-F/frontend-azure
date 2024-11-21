<template>
    <div>
      <!-- Sección Principal (Hero) -->
      <section class="hero">
        <h1>Bienvenidos a SoccerBook</h1>
        <p>Reserva tu cancha favorita en minutos</p>
        <a @click.prevent="handleReservation" class="btn">Reserva Ahora</a>
      </section>
  
      <!-- Sección de Características -->
      <section class="features">
        <div class="feature-item" data-animate="fade-in">
          <img src="../assets/a6.jpg" alt="Cancha">
          <h3>Rápido y Fácil</h3>
          <p>Reserva en solo unos pasos.</p>
        </div>
        <div class="feature-item" data-animate="fade-in">
          <img src="../assets/a2.jpg" alt="Calendario">
          <h3>Disponibilidad en Tiempo Real</h3>
          <p>Consulta las canchas disponibles.</p>
        </div>
        <div class="feature-item" data-animate="fade-in">
          <img src="../assets/a7.jpg" alt="Mapa">
          <h3>Encuentra Canchas Cercanas</h3>
          <p>Busca canchas cerca de tu ubicación.</p>
        </div>
      </section>
  
      <!-- Testimonios -->
      <section class="testimonials">
        <h2>Lo que dicen nuestros usuarios</h2>
        <br>
        <div class="testimonial visible" data-animate="slide-in">
          <p>"¡La mejor forma de reservar una cancha, fácil y rápido!"</p>
          <p>- Juan Pérez</p>
        </div>
        <div class="testimonial" data-animate="slide-in">
          <p>"Excelente plataforma, siempre encuentro la cancha que necesito."</p>
          <p>- María García</p>
        </div>
        <div class="testimonial" data-animate="slide-in">
          <p>"Me encanta lo fácil que es gestionar reservas desde mi móvil."</p>
          <p>- Carlos Rodríguez</p>
        </div>
      </section>
  
      <!-- Llamada a la Acción (CTA) -->
      <section class="cta">
        <h2>¿Listo para jugar?</h2>
        <br>
        <a @click.prevent="handleHeroClick" class="btn">{{ handleHeroClick ? 'Reserva Ahora' : 'Regístrate Ahora' }}</a>
        
      </section>
    </div>
  </template>
  
  <script>
  import SobreNosotrosLogic from '../router/HomePaget'; // Importando el archivo de lógica
  
  export default {
    name: 'SobreNosotros',
    ...SobreNosotrosLogic, // Usando la lógica importada
  };
  </script>
  

  <style scoped>
  @import url('../styles/HomePaget.css');  /* Importando los estilos externos */
  
  
  </style>
  
    