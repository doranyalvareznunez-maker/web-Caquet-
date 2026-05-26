// =============================================
// 1. MENÚ DESPLEGABLE CON MOUSEOVER / MOUSEOUT
// =============================================
document.addEventListener('DOMContentLoaded', function () {

  // Menú hamburguesa (móvil)
  const menuToggle = document.getElementById('menu-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', function () {
      const isOpen = navMenu.classList.toggle('nav-open');
      menuToggle.setAttribute('aria-expanded', isOpen);
    });
  }

  // Submenús desplegables con mouseover / mouseout
  const itemsConSubmenu = document.querySelectorAll('.has-submenu');

  itemsConSubmenu.forEach(function (item) {
    const submenu = item.querySelector('.submenu');

    item.addEventListener('mouseover', function () {
      if (submenu) {
        submenu.style.display = 'block';
        submenu.setAttribute('aria-hidden', 'false');
      }
    });

    item.addEventListener('mouseout', function () {
      if (submenu) {
        submenu.style.display = 'none';
        submenu.setAttribute('aria-hidden', 'true');
      }
    });

    // Accesibilidad: también con teclado (focus)
    item.addEventListener('focusin', function () {
      if (submenu) submenu.style.display = 'block';
    });

    item.addEventListener('focusout', function (e) {
      if (!item.contains(e.relatedTarget) && submenu) {
        submenu.style.display = 'none';
      }
    });
  });


  // =============================================
  // 2. SLIDER DE IMÁGENES CON SETINTERVAL
  // =============================================
  const slides = document.querySelectorAll('.slide');
  const btnPrev = document.getElementById('slider-prev');
  const btnNext = document.getElementById('slider-next');
  const dotsContainer = document.getElementById('slider-dots');
  let currentSlide = 0;
  let sliderInterval;

  function mostrarSlide(index) {
    slides.forEach(function (slide, i) {
      slide.classList.remove('active');
      slide.setAttribute('aria-hidden', 'true');
    });
    if (dotsContainer) {
      dotsContainer.querySelectorAll('.dot').forEach(function (dot, i) {
        dot.classList.toggle('active-dot', i === index);
      });
    }
    slides[index].classList.add('active');
    slides[index].setAttribute('aria-hidden', 'false');
  }

  function siguienteSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    mostrarSlide(currentSlide);
  }

  function anteriorSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    mostrarSlide(currentSlide);
  }

  function iniciarInterval() {
    sliderInterval = setInterval(siguienteSlide, 3500);
  }

  function reiniciarInterval() {
    clearInterval(sliderInterval);
    iniciarInterval();
  }

  if (slides.length > 0) {
    // Crear dots de navegación
    if (dotsContainer) {
      slides.forEach(function (_, i) {
        const dot = document.createElement('button');
        dot.classList.add('dot');
        dot.setAttribute('aria-label', 'Ir a imagen ' + (i + 1));
        if (i === 0) dot.classList.add('active-dot');
        dot.addEventListener('click', function () {
          currentSlide = i;
          mostrarSlide(currentSlide);
          reiniciarInterval();
        });
        dotsContainer.appendChild(dot);
      });
    }

    mostrarSlide(0);
    iniciarInterval();

    if (btnNext) {
      btnNext.addEventListener('click', function () {
        siguienteSlide();
        reiniciarInterval();
      });
    }

    if (btnPrev) {
      btnPrev.addEventListener('click', function () {
        anteriorSlide();
        reiniciarInterval();
      });
    }

    // Pausa al pasar el mouse
    const sliderWrapper = document.getElementById('slider');
    if (sliderWrapper) {
      sliderWrapper.addEventListener('mouseover', function () {
        clearInterval(sliderInterval);
      });
      sliderWrapper.addEventListener('mouseout', function () {
        iniciarInterval();
      });
    }
  }


  // =============================================
  // 3. MENSAJES PERSONALIZADOS - DOM (hora + idioma)
  // =============================================
  const mensajes = {
    es: {
      manana: '¡Buenos días! Descubre el Caquetá con la fresca mañana amazónica. 🌅',
      tarde:  '¡Buenas tardes! El mejor momento para planear tu aventura en la selva. 🌿',
      noche:  '¡Buenas noches! Sueña con los ríos y la biodiversidad del Caquetá. 🌙'
    },
    en: {
      manana: 'Good morning! Discover Caquetá in the fresh Amazon morning. 🌅',
      tarde:  'Good afternoon! The perfect time to plan your jungle adventure. 🌿',
      noche:  'Good night! Dream of the rivers and biodiversity of Caquetá. 🌙'
    }
    
  };

  let idiomaActual = 'es';

  function obtenerPeriodo() {
    const hora = new Date().getHours();
    if (hora >= 6 && hora < 12) return 'manana';
    if (hora >= 12 && hora < 19) return 'tarde';
    return 'noche';
  }

  function actualizarMensaje() {
    const contenedor = document.getElementById('mensaje-bienvenida');
    if (!contenedor) return;
    const periodo = obtenerPeriodo();
    const texto = mensajes[idiomaActual][periodo];
    contenedor.textContent = texto;
    contenedor.setAttribute('lang', idiomaActual);

    // Animación suave
    contenedor.style.opacity = '0';
    setTimeout(function () {
      contenedor.style.opacity = '1';
    }, 200);
  }

  // Selector de idioma
  const selectorIdioma = document.getElementById('selector-idioma');
  if (selectorIdioma) {
    selectorIdioma.addEventListener('change', function () {
      idiomaActual = this.value;
      actualizarMensaje();
    });
  }

  // Inicializar mensaje
  actualizarMensaje();

});
