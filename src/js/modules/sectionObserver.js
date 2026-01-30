/**
 * Activa el enlace de navegación correspondiente al id de la sección visible.
 * @param {NodeList} navLinks - Lista de enlaces de navegación.
 * @param {string} id - ID de la sección visible.
 */
function activateLinkById(navLinks, id) {
  navLinks.forEach((link) => {
    link.classList.toggle("nav__link--active", link.dataset.target === id);
  });
}

/**
 * Elimina la clase activa de todos los enlaces de navegación.
 * @param {NodeList} navLinks - Lista de enlaces de navegación.
 */
function clearActiveLinks(navLinks) {
  navLinks.forEach((link) => link.classList.remove("nav__link--active"));
}

/**
 * Observa qué sección es más visible en el viewport y activa su enlace en la barra de navegación.
 * @param {Array} sections - Array de objetos { id, section, link }.
 * @param {NodeList} navLinks - Lista de enlaces de navegación.
 * @param {Object} observerOptions - Opciones para IntersectionObserver.
 */
export function setupSectionObserver(sections, navLinks, observerOptions) {
  let visibleSections = new Map();

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      const id = entry.target.id;

      if (entry.isIntersecting) {
        const visibleHeight = entry.intersectionRect.height;
        visibleSections.set(id, visibleHeight);
      } else {
        visibleSections.delete(id);
      }
    });

    if (visibleSections.size === 0) {
      clearActiveLinks(navLinks);
      return;
    }

    let mostVisibleId = null;
    let maxHeight = 0;
    for (const [id, height] of visibleSections.entries()) {
      if (height > maxHeight) {
        mostVisibleId = id;
        maxHeight = height;
      }
    }

    activateLinkById(navLinks, mostVisibleId);
  }, observerOptions);

  sections.forEach(({ section }) => observer.observe(section));
}
