import { useRouter } from 'vue-router';
  
export default {
  name: 'HomePage',
  setup() {
    const router = useRouter();
    
    // Función que verifica el estado de autenticación (ajusta según tu lógica de autenticación)
    const isAuthenticated = () => {
      // Reemplaza esta línea con tu lógica para verificar autenticación
      return localStorage.getItem('token');  // Ejemplo usando un token en localStorage
    };

    // Método para redirigir a la ruta correspondiente
    const handleReservation = () => {
      if (isAuthenticated()) {
        router.push('/reservar');
      } else {
        router.push('/login');
      }
    };

    const handleHeroClick= () => {
      if (isAuthenticated()) {
        router.push('/reservar');
      } else {
        router.push('/register');
      }
    };

    return {
      handleReservation,
      handleHeroClick
    };
  },

  mounted() {
    // Manejo de la animación de las secciones con data-animate
    const elementsToAnimate = document.querySelectorAll('[data-animate]');
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.1 });

    elementsToAnimate.forEach(element => {
      observer.observe(element);
    });

  // Manejo de los testimonios
document.addEventListener("DOMContentLoaded", () => {
const testimonials = document.querySelectorAll('.testimonial');
let currentIndex = 0;

// Inicialmente, oculta todos los testimonios
testimonials.forEach((testimonial, index) => {
  testimonial.classList.remove('visible');
  if (index !== currentIndex) {
    testimonial.style.display = 'none'; // Oculta todos excepto el primero
  }
});

// Muestra el primer testimonio
testimonials[currentIndex].classList.add('visible');
testimonials[currentIndex].style.display = 'block';

function showNextTestimonial() {
  // Oculta el testimonio actual
  testimonials[currentIndex].classList.remove('visible');
  testimonials[currentIndex].style.display = 'none';

  // Mueve al siguiente testimonio
  currentIndex = (currentIndex + 1) % testimonials.length;

  // Muestra el siguiente testimonio
  testimonials[currentIndex].classList.add('visible');
  testimonials[currentIndex].style.display = 'block';
}

// Cambia de testimonio cada 5 segundos, comenzando después de mostnrar el primero
setInterval(showNextTestimonial, 5000);
});

  }
};