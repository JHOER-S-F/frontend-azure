<template>
  <section id="sobre" class="sobre-container">
    <h2>Sobre Nosotros</h2>
    <p>
      Somos un equipo dedicado a proporcionar las <strong>mejores instalaciones deportivas</strong> para que disfrutes de tus partidos de fútbol con amigos y familiares.
    </p>

    <div class="accordion-container">
      <div class="accordion" :class="{'active': activeAccordion === 0}">
        <h3 @click="toggleAccordion(0)">
          ¿Quiénes Somos?
          <span class="accordion-icon">{{ activeAccordion === 0 ? '▲' : '▼' }}</span>
        </h3>
        <div class="accordion-content">
          <div class="accordion-text-image">
            <img src="../assets/a1.jpg" alt="Quiénes somos" class="accordion-image" />
            <p v-if="activeAccordion === 0">
              Somos un grupo de apasionados por el deporte que busca ofrecer una experiencia de calidad en nuestras canchas, facilitando un ambiente saludable y divertido.
            </p>
          </div>
        </div>
      </div>

      <div class="accordion" :class="{'active': activeAccordion === 1}">
        <h3 @click="toggleAccordion(1)">
          ¿A Qué Nos Dedicamos?
          <span class="accordion-icon">{{ activeAccordion === 1 ? '▲' : '▼' }}</span>
        </h3>
        <div class="accordion-content">
          <div class="accordion-text-image">
            <img src="../assets/a2.jpg" alt="A qué nos dedicamos" class="accordion-image" />
            <p v-if="activeAccordion === 1">
              Nos dedicamos a la gestión de reservas de canchas deportivas, asegurándonos de que nuestros clientes tengan acceso a instalaciones modernas y cómodas para disfrutar del fútbol.
            </p>
          </div>
        </div>
      </div>

      <div class="accordion" :class="{'active': activeAccordion === 2}">
        <h3 @click="toggleAccordion(2)">
          ¿Qué Servicios Brindamos?
          <span class="accordion-icon">{{ activeAccordion === 2 ? '▲' : '▼' }}</span>
        </h3>
        <div class="accordion-content">
          <div class="accordion-text-image">
            <img src="../assets/a3.jpg" alt="Qué servicios brindamos" class="accordion-image" />
            <p v-if="activeAccordion === 2">
              Ofrecemos canchas de fútbol de césped sintético, alquiler de equipamiento, vestuarios, y un sistema de reservas en línea que facilita la organización de tus partidos.
            </p>
          </div>
        </div>
      </div>

      <div class="accordion" :class="{'active': activeAccordion === 3}">
        <h3 @click="toggleAccordion(3)">
          Nuestra Misión
          <span class="accordion-icon">{{ activeAccordion === 3 ? '▲' : '▼' }}</span>
        </h3>
        <div class="accordion-content">
          <div class="accordion-text-image">
            <img src="../assets/a4.jpg" alt="Nuestra misión" class="accordion-image" />
            <p v-if="activeAccordion === 3">
              Facilitar el acceso a canchas de fútbol para que aficionados y profesionales disfruten de su pasión por el deporte. A través de nuestra plataforma en línea, brindamos una experiencia de reserva fácil y rápida, integrando un catálogo de canchas disponibles en un solo lugar.
            </p>
          </div>
        </div>
      </div>

      <div class="accordion" :class="{'active': activeAccordion === 4}">
        <h3 @click="toggleAccordion(4)">
          Nuestra Visión
          <span class="accordion-icon">{{ activeAccordion === 4 ? '▲' : '▼' }}</span>
        </h3>
        <div class="accordion-content">
          <div class="accordion-text-image">
            <img src="../assets/a5.jpg" alt="Nuestra visión" class="accordion-image" />
            <p v-if="activeAccordion === 4">
              Para el 2026, seremos la plataforma líder de reserva de canchas de fútbol, accesible en toda la región. Nuestro objetivo es ser el referente principal para aficionados y profesionales, ofreciendo una experiencia optimizada que sea sinónimo de facilidad, confianza y satisfacción.
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script>
import SobreNosotrosLogic from '../router/SobreNosotros.js'; // Importando el archivo de lógica

export default {
  name: 'SobreNosotros',
  ...SobreNosotrosLogic, // Usando la lógica importada
};
</script>

<style scoped>
@import url('../styles/SobreNosotros.css');  /* Importando los estilos externos */

/* Los estilos locales pueden ir aquí si los necesitas */
</style>


