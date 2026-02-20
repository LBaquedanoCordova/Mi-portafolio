import { observeElements } from "./observerManager.js";

/**
 * Busca todos los elementos estáticos que necesitan animación al cargar la página
 * y los registra en el gestor del observador.
 */
function initAnimationObserver() {
  const staticAnimatedElements =
    document.querySelectorAll(".animate-on-scroll");
  if (staticAnimatedElements.length > 0) {
    observeElements(staticAnimatedElements);
  }
}

export { initAnimationObserver };
