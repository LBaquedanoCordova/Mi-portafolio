import { gsap } from "./gsapInstance.js";

/**
 * Crea la animación para los títulos de sección.
 * @param {HTMLElement} title - El contenedor del título.
 * @param {HTMLElement} icon - El ícono dentro del título.
 */
const animateSectionTitle = (title, icon) => {
  gsap.set(title, { opacity: 0, y: 20 });

  if (icon) {
    gsap.set(icon, { opacity: 0, scale: 0.5, rotation: -90 });
  }

  const titleTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: title,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  titleTimeline.to(title, {
    opacity: 1,
    y: 0,
    duration: 0.5,
    ease: "power2.out",
  });

  if (icon) {
    titleTimeline.to(
      icon,
      {
        opacity: 1,
        scale: 1,
        rotation: 0,
        duration: 0.6,
        ease: "back.out(2.5)",
      },
      "-=0.2"
    );
  }
};

/**
 * Crea la animación progresiva para cada elemento de la línea de tiempo.
 * @param {HTMLElement} wrapper - El contenedor global del ítem de la línea de tiempo.
 */
const animateTimelineItem = (wrapper) => {
  const marker = wrapper.querySelector(".timeline__marker");
  const connector = wrapper.querySelector(".timeline__connector");
  const entryCard = wrapper.querySelector(".timeline__entry");

  if (connector) {
    connector.style.setProperty("--connector-progress", "0");
  }

  gsap.set(marker, { scale: 0, opacity: 0 });
  gsap.set(entryCard, { opacity: 0, x: -20, scale: 0.95 });

  const timeline = gsap.timeline({
    scrollTrigger: {
      trigger: wrapper,
      start: "top 85%",
      toggleActions: "play none none none",
    },
  });

  timeline.to(marker, {
    scale: 1,
    opacity: 1,
    duration: 0.3,
    ease: "back.out(2)",
  });

  if (connector) {
    timeline.to(
      connector,
      {
        "--connector-progress": 1,
        duration: 0.4,
        ease: "power2.inOut",
      },
      "-=0.1"
    );
  }

  timeline.to(
    entryCard,
    {
      opacity: 1,
      x: 0,
      scale: 1,
      duration: 0.5,
      ease: "back.out(1.5)",
    },
    "-=0.3"
  );
};

/**
 * Inicializa las animaciones de los títulos de cada columna.
 */
const initSectionTitlesAnimations = () => {
  const sectionTitles = document.querySelectorAll(".timeline__section-title");

  sectionTitles.forEach((title) => {
    const icon = title.querySelector("i");
    animateSectionTitle(title, icon);
  });
};

/**
 * Inicializa las animaciones de las tarjetas y conectores de la línea de tiempo.
 */
const initTimelineItemsAnimations = () => {
  const timelineWrappers = document.querySelectorAll(".timeline__entry__wrapper");

  timelineWrappers.forEach((wrapper) => {
    animateTimelineItem(wrapper);
  });
};

/**
 * Inicializa las animaciones de GSAP ScrollTrigger para la sección de experiencia.
 */
export function initExperienceTimeline() {
  initSectionTitlesAnimations();
  initTimelineItemsAnimations();
}
