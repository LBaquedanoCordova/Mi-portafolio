import { initTheme } from "./theme.js";

const html = document.documentElement;
const nav = document.querySelector(".nav");
const imgLogo = nav.querySelector(".nav__logo-image");
const navOptions = nav.querySelector(".nav__options");
const navThemeToggle = navOptions.querySelector(".nav__theme-toggle");
const navToggleIcon = nav.querySelector(".nav__toggle-icon");
const navThemeIcon = navThemeToggle.querySelector(
  ".nav__theme-icon--light-mode"
);
const navLinks = navOptions.querySelectorAll("li .nav__link");

const sections = [];
const tempBlockedSections = new Set();

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: [0.25, 0.5, 0.75],
};

// Actualiza las clases de un elemento reemplazando las antiguas por las nuevas
function updateIcon(element, oldClasses, newClasses) {
  element?.classList.remove(...oldClasses);
  element?.classList.add(...newClasses);
}

// Cierra el menú de navegación si está abierto
function closeNavigationMenu() {
  if (nav.classList.contains("nav--open")) {
    nav.classList.remove("nav--open");
    navOptions.classList.remove("nav__options--active");

    updateIcon(
      navToggleIcon,
      ["fa-xmark", "nav__toggle-icon--close"],
      ["fa-bars", "nav__toggle-icon"]
    );
  }
}

// Cierra el menú de navegación si el ancho de la ventana es mayor a 767px
function handleResize() {
  if (window.innerWidth > 767) {
    closeNavigationMenu();
  }
}

// Alterna la visibilidad del menú de navegación y actualiza el icono del botón
function  handlerNavigationMenu() {
  const isActive = nav.classList.toggle("nav--open");
  navOptions.classList.toggle("nav__options--active", isActive);

  updateIcon(
    navToggleIcon,
    isActive
      ? ["fa-bars", "nav__toggle-icon"]
      : ["fa-xmark", "nav__toggle-icon--close"],
    isActive
      ? ["fa-xmark", "nav__toggle-icon--close"]
      : ["fa-bars", "nav__toggle-icon"]
  );
}

// Actualiza el icono del tema de navegación según el tema actual
function updateNavThemeIcon(theme) {
  const isDark = theme === "dark";
  updateIcon(
    navThemeIcon,
    isDark
      ? ["fa-sun", "nav__theme-icon--light-mode"]
      : ["fa-moon", "nav__theme-icon--dark-mode"],
    isDark
      ? ["fa-moon", "nav__theme-icon--dark-mode"]
      : ["fa-sun", "nav__theme-icon--light-mode"]
  );
}

//Cambia el theme de la interfaz entre claro y oscuro.
function handlerToggleTheme() {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);

  initTheme({
    html,
    imgLogo,
    navThemeToggle,
    onThemeChange: updateNavThemeIcon,
  });
  closeNavigationMenu();
}

// Inicializa el theme visual al cargar la página
initTheme({ html, imgLogo, navThemeToggle, onThemeChange: updateNavThemeIcon });

// Maneja el clic en los enlaces de navegación con desplazamiento suave y bloqueo temporal
function handlerNavbarLink(e, targetId, section) {
  e.preventDefault();

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

  closeNavigationMenu();
}

// Mapa de selectores de la barra de navegación y sus manejadores de eventos
const navbarHandlers = new Map([
  [".nav__theme-toggle", handlerToggleTheme],
  [".nav__toggle", handlerNavigationMenu],
  [".nav__link", (item, e) => {
    const targetId = item.dataset.target;
    const section = document.getElementById(targetId);
    if (section) handlerNavbarLink(e, targetId, section);
  }],
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
      return
    };

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
    if (item) {
      handler(item, e);
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
