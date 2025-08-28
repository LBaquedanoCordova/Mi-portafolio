import { initTheme } from "./theme.js";
import { gsap } from "./gsapInstance.js";

const html = document.documentElement;
const nav = document.querySelector(".nav");
const imgLogo = nav.querySelector(".nav__logo-image");
const navOptions = nav.querySelector(".nav__options");
const navThemeToggle = navOptions.querySelector(".nav__theme-toggle");
const pathMenuIcon = nav.querySelector("#navMenuIcon");
const pathThemeIcon = navThemeToggle.querySelector("#themeIcon");
const navLinks = navOptions.querySelectorAll("li .nav__link");

const sections = [];
const tempBlockedSections = new Set();

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: [0.25, 0.5, 0.75],
};

//Anima la transición de una ruta SVG entre dos formas usando GSAP y morphSVG.
function updatePathSVG({iconElemPath, useFinalPath, pathOriginal, pathFinal}){
  try {
    gsap.to(iconElemPath, {
      duration: 0.3,
      morphSVG: {
        type: "rotational",
        map: "position",
        shape: useFinalPath ? pathFinal : pathOriginal,
      },
      ease: "power4.inOut"
    });
  } catch (error) {
    if (useFinalPath) {
      iconElemPath.setAttribute("d", pathFinal);
    } else {
      iconElemPath.setAttribute("d", pathOriginal);
    }
  }
}

// Alterna el menú de navegación abierto/cerrado y actualiza el icono correspondiente
function toggleNavigationMenu(force) {
  const isOpen = nav.classList.contains("nav--open");
  const shouldOpen = force !== undefined ? force : !isOpen;
  const pathMorphMenu = {
    pathOriginal: "M5 7 25 7M5 15 25 15M5 23 25 23",
    pathFinal: "M6.35 6 23.35 24M23.35 6 6.35 24"
  };

  if (isOpen === shouldOpen) return;

  nav.classList.toggle("nav--open", shouldOpen);

  requestAnimationFrame(() => {
    navOptions.classList.toggle("nav__options--visible", shouldOpen);
  });

  updatePathSVG({iconElemPath: pathMenuIcon, useFinalPath: shouldOpen, ...pathMorphMenu});
}

// Cierra el menú de navegación si el ancho de la ventana es mayor a 767px
function handleResize() {
  if (window.innerWidth > 767) {
    toggleNavigationMenu(false);
  }
}

// Cambia el icono del tema actual claro/oscuro y aplica animacion si es necesario
function setNavThemeIcon(theme) {
  const pathMorphTheme = {
    pathOriginal: "M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z",
    pathFinal: "M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
  };

  if (!pathThemeIcon) return;

  const isDark = theme === "dark";
  
  if (!pathThemeIcon.dataset.initiated) {
    pathThemeIcon.setAttribute("d", isDark ? pathMorphTheme.pathFinal : pathMorphTheme.pathOriginal);
    pathThemeIcon.dataset.initiated = "true";
  } else {
    updatePathSVG({iconElemPath: pathThemeIcon, useFinalPath: isDark, ...pathMorphTheme});
  }
  
  pathThemeIcon.classList.toggle("theme-icon--sun", !isDark);
  pathThemeIcon.classList.toggle("theme-icon--moon", isDark);
}

// Cambia el theme de la interfaz entre claro y oscuro.
function handlerToggleTheme() {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);

  initTheme({
    html,
    imgLogo,
    navThemeToggle,
    onThemeChange: setNavThemeIcon
  });
  toggleNavigationMenu(false);
}

// Inicializa el theme visual al cargar la página, sin animaciones 
initTheme({ html, imgLogo, navThemeToggle, onThemeChange: setNavThemeIcon});

// Limpia estilos residuales tras la animación para restaurar el desenfoque en Chrome
function handleNavTransitionEnd() {
  nav.addEventListener("animationend", () => {
      nav.classList.remove("nav--animating-in");},
    { once: true }
  );
}
handleNavTransitionEnd();

// Maneja el clic en los enlaces de navegación con desplazamiento suave y bloqueo temporal
function handlerNavbarLink() {
  event.preventDefault();

  const item = event.target;
  const targetId = item.dataset.target;
  const section = document.getElementById(targetId);

  if (tempBlockedSections.has(targetId)) return;

  tempBlockedSections.add(targetId);

  setTimeout(() => {
    tempBlockedSections.delete(targetId); // desbloquear después de un corto tiempo
  }, 500);

  const navbarHeight = nav.offsetHeight;

  window.scrollTo({
    top: section.offsetTop - navbarHeight,
    behavior: "smooth",
  });

  toggleNavigationMenu(false);
}

// Mapa de selectores de la barra de navegación y sus manejadores de eventos
const navbarHandlers = new Map([
  [".nav__theme-toggle", handlerToggleTheme],
  [".nav__toggle", toggleNavigationMenu],
  [".nav__link", handlerNavbarLink]
]);

// Activa el enlace de navegación cuando la seccion correspondiente es visible
function activateLinkById(id) {
  navLinks.forEach((link) => {
    link.classList.toggle("nav__link--active", link.dataset.target === id);
  });
}

// Elimina la clase activa de todos los enlaces de navegación
function clearActiveLinks() {
  navLinks.forEach((link) => link.classList.remove("nav__link--active"));
}

// Observa qué sección es más visible en el viewport y activa su enlace en la barra de navegación
function setupSectionObserver(sections) {
  let visibleSections = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;

      if (entry.isIntersecting) {
        // Guardamos el área visible real
        const visibleHeight = entry.intersectionRect.height;
        visibleSections.set(id, visibleHeight);
      } else {
        visibleSections.delete(id);
      }
    });

    if (visibleSections.size === 0) {
      clearActiveLinks();
      return;
    }

    // Obtener el ID con mayor altura visible
    let mostVisibleId = null;
    let maxHeight = 0;
    for (const [id, height] of visibleSections.entries()) {
      if (height > maxHeight) {
        mostVisibleId = id;
        maxHeight = height;
      }
    }

    activateLinkById(mostVisibleId);
  }, observerOptions);

  // Empezamos a observar cada sección
  sections.forEach(({ section }) => observer.observe(section));
}

// Mapea los enlaces de navegación a sus respectivas secciones del DOM
function mapNavLinksToSections() {
  navLinks.forEach((link) => {
    const targetId = link.dataset.target;
    const section = document.getElementById(targetId);

    if (section) {
      sections.push({ id: targetId, section, link });
    }
  });
}

// Inicializa los manejadores y observadores del navbar para la navegación de secciones.
function initNavbarHandler() {
  mapNavLinksToSections();

  nav.addEventListener("click", (e) => {
    for (const [selector, handler] of navbarHandlers) {
      const item = e.target.closest(selector);
      if(item) {
        handler();
        break;
      }
    }
  });
  setupSectionObserver(sections);
}

// Inicializa los eventos y funcionalidades principales de la barra de navegación
export const initNavbar = () => {
  window.addEventListener("resize", handleResize);
  initNavbarHandler();
};
