const visibleClass = "is-visible";
let animationObserver;

/**
 * El callback se ejecuta cada vez que la visibilidad de un elemento observado cambia.
 * @param {IntersectionObserverEntry[]} entries - Array de elementos observados.
 * @param {IntersectionObserver} observer - La instancia del observador.
 */
const observerCallback = (entries, observer) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add(visibleClass);
      // Deja de observar el elemento para optimizar el rendimiento.
      observer.unobserve(entry.target);
    }
  });
};

/**
 * Inicializa y configura la instancia única del IntersectionObserver.
 */
function initializeObserver() {
  if (animationObserver) return;

  const observerOptions = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  animationObserver = new IntersectionObserver(
    observerCallback,
    observerOptions,
  );
}

/**
 * Permite que otros módulos registren nuevos elementos para ser observados.
 * Acepta un elemento individual, un NodeList o un Array de elementos.
 * @param {Element | NodeListOf<Element> | Element[]} elements - El/los elemento(s) a observar.
 */
function observeElements(elements) {
  if (!animationObserver) return;

  // Comprobación unificada para cualquier objeto iterable (NodeList, Array)
  if (elements && typeof elements[Symbol.iterator] === "function") {
    elements.forEach((element) => {
      if (element instanceof Element) {
        animationObserver.observe(element);
      }
    });
  } else if (elements instanceof Element) {
    // Manejo para un solo elemento
    animationObserver.observe(elements);
  }
}

export { initializeObserver, observeElements };
