/**
 * Navega a una sección específica de la página con un desplazamiento suave.
 * @param {string} sectionId - El ID de la sección a la que se desea desplazar.
 */
export function navigateToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) return;

  const newUrl = `#${sectionId}`;
  if (window.location.hash !== newUrl) {
    history.pushState(null, '', newUrl);
  }

  const navbarHeight = document.querySelector(".nav")?.offsetHeight || 0;

  window.scrollTo({
    top: section.offsetTop - navbarHeight,
    behavior: "smooth",
  });
}

/**
 * Maneja la carga inicial de la página. Si la URL ya contiene un ancla,
 * se desplaza a la sección correspondiente de forma instantánea.
 */
function handleInitialLoad() {
  const hash = window.location.hash.substring(1);
  if (!hash) return;

  const section = document.getElementById(hash);
  if (!section) return;

  requestAnimationFrame(() => {
    const navbarHeight = document.querySelector(".nav")?.offsetHeight || 0;

    window.scrollTo({
      top: section.offsetTop - navbarHeight,
      behavior: "smooth",
    });
  });
}

export function initRouter() {
  handleInitialLoad();
}