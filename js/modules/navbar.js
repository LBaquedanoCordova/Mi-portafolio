const nav = document.querySelector(".nav");
const navOptions = nav.querySelector(".nav__options");
const navToggleButton = nav.querySelector(".nav__toggle");
const navThemeToggle = navOptions.querySelector(".nav__theme-toggle");
const navToggleIcon = navToggleButton.querySelector(".nav__toggle-icon");
const navThemeIcon = navThemeToggle.querySelector(".nav__theme-icon--light-mode");
const navLinks = navOptions.querySelectorAll("li .nav__link");

const sections = [];
const tempBlockedSections = new Set();

const observerOptions = {
  root: null,
  rootMargin: "0px",
  threshold: [0.25, 0.5, 0.75],
};

// Función auxiliar para actualizar clases
function updateIcon(element, oldClasses, newClasses) {
  element?.classList.remove(...oldClasses);
  element?.classList.add(...newClasses);
}

// Función para cerrar el menú en pantallas grandes o después de un clic en un enlace
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

// Controlador único para el evento resize
function handleResize() {
  if (window.innerWidth > 767) {
    closeNavigationMenu();
  }
}

// Función para alternar el menú de navegación
function toggleNavigationMenu() {
  const isActive = nav.classList.toggle("nav--open");
  navOptions.classList.toggle("nav__options--active", isActive);

  updateIcon(
    navToggleIcon,
    isActive ? ["fa-bars", "nav__toggle-icon"] : ["fa-xmark", "nav__toggle-icon--close"],
    isActive ? ["fa-xmark", "nav__toggle-icon--close"] : ["fa-bars", "nav__toggle-icon"]
  );
}

// Función para alternar el tema
function toggleItemTheme(e) {
  e.preventDefault();

  const isLightMode = navThemeIcon?.classList.contains("nav__theme-icon--light-mode");
  updateIcon(
    navThemeIcon,
    isLightMode ? ["fa-sun", "nav__theme-icon--light-mode"] : ["fa-moon", "nav__theme-icon--dark-mode"],
    isLightMode ? ["fa-moon", "nav__theme-icon--dark-mode"] : ["fa-sun", "nav__theme-icon--light-mode"]
  );
}

// Maneja el clic en los enlaces de navegación con desplazamiento suave y bloqueo temporal
function handleClickNavbarLink(e, targetId, section) {
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

    if (visibleSections.size === 0) return;

    // Obtener el ID con mayor altura visible
    let mostVisibleId = null;
    let maxHeight = 0;
    for (const [id, height] of visibleSections.entries()) {
      if (height > maxHeight) {
        mostVisibleId = id;
        maxHeight = height;
      }
    }

    // Activar el link correspondiente
    navLinks.forEach((link) => {
      link.classList.toggle("nav__link--active", link.dataset.target === mostVisibleId);
    });
  }, observerOptions);

  // Empezamos a observar cada sección
  sections.forEach(({ section }) => observer.observe(section));
}


function initNavbarLinks() {
  navLinks.forEach((link) => {
    const targetId = link.dataset.target;
    const section = document.getElementById(targetId);

    if (section) {
      sections.push({ id: targetId, section, link });

      link.addEventListener("click", (e) =>
        handleClickNavbarLink(e, targetId, section)
      );
      setupSectionObserver(sections);
    }
  });
}

export const initNavbar = () => {
  window.addEventListener("resize", handleResize);

  navToggleButton.addEventListener("click", toggleNavigationMenu);
 navThemeToggle.addEventListener("click", toggleItemTheme);

  initNavbarLinks();
};
