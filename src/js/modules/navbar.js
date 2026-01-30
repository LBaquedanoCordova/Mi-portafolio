import { initTheme } from "./theme.js";
import { setupSectionObserver } from "./sectionObserver.js";
import { setNavThemeIcon, updatePathSVG } from "./themeNavbar.js";

const html = document.documentElement;
const nav = document.querySelector(".nav");
const navOptions = nav.querySelector(".nav__options");
const navThemeToggle = navOptions.querySelector(".nav__theme-toggle");
const pathMenuIcon = nav.querySelector("#navMenuIcon");
const navLinks = navOptions.querySelectorAll("li .nav__link");

const sections = [];
const tempBlockedSections = new Set();

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: [0.25, 0.5, 0.75],
};

// Alterna el menú de navegación abierto/cerrado y actualiza el icono correspondiente
function toggleNavigationMenu(force) {
  const isOpen = nav.classList.contains("nav--open");
  const shouldOpen = force !== undefined ? force : !isOpen;
  const pathMorphMenu = {
    pathOriginal: "M5 7 25 7M5 15 25 15M5 23 25 23",
    pathFinal: "M6.35 6 23.35 24M23.35 6 6.35 24",
  };

  if (isOpen === shouldOpen) return;

  nav.classList.toggle("nav--open", shouldOpen);

  requestAnimationFrame(() => {
    navOptions.classList.toggle("nav__options--visible", shouldOpen);
  });

  updatePathSVG({
    iconElemPath: pathMenuIcon,
    useFinalPath: shouldOpen,
    ...pathMorphMenu,
  });
}

// Cierra el menú de navegación si el ancho de la ventana es mayor a 767px
function handleResize() {
  if (window.innerWidth > 767) {
    toggleNavigationMenu(false);
  }
}

// Cambia el theme de la interfaz entre claro y oscuro.
function handlerToggleTheme() {
  const currentTheme = html.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  localStorage.setItem("theme", newTheme);

  initTheme({
    html,
    navThemeToggle,
    onThemeChange: setNavThemeIcon,
  });
  toggleNavigationMenu(false);
}

// Inicializa el theme visual al cargar la página, sin animaciones
initTheme({ html, navThemeToggle, onThemeChange: setNavThemeIcon });

// Limpia estilos residuales tras la animación para restaurar el desenfoque en Chrome
function handleNavTransitionEnd() {
  nav.addEventListener(
    "animationend",
    () => {
      nav.classList.remove("nav--animating-in");
    },
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
  [".nav__link", handlerNavbarLink],
]);

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
        handler();
        break;
      }
    }
  });
  setupSectionObserver(sections, navLinks, observerOptions);
}

// Inicializa los eventos y funcionalidades principales de la barra de navegación
export const initNavbar = () => {
  window.addEventListener("resize", handleResize);
  initNavbarHandler();
};
