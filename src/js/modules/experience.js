import { gsap } from "./gsapInstance.js";

/**
 * Inicializar las animaciones de GSAP ScrollTrigger para la sección de experiencia.
 */
export function initExperienceTimeline() {
  const timelineColumns = document.querySelectorAll(".timeline__column");

  timelineColumns.forEach((column) => {
    const timelineBox = column.querySelector(".timeline__box");
    if (!timelineBox) return;

    timelineBox.style.setProperty("--line-progress", "0");

    const entries = column.querySelectorAll(".timeline__entry__wrapper");
    const lineDuration = 1.2 + entries.length * 0.3;
    const columnTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: column,
        start: "top 80%",
        toggleActions: "play none none none",
      },
    });

    columnTimeline.to(timelineBox, {
      "--line-progress": 1,
      ease: "power2.inOut",
      duration: lineDuration,
    }, 0);

    entries.forEach((entryWrapper, index) => {
      const appearanceTime = ((index + 1) / (entries.length + 0.5)) * lineDuration;

      const entryCard = entryWrapper.querySelector(".timeline__entry");

      gsap.set(entryCard, { opacity: 0, x: -20, scale: 0.95 });

      columnTimeline.to(
        entryCard,
        {
          opacity: 1,
          x: 0,
          scale: 1,
          duration: 0.5,
          ease: "back.out(1.5)",
        },
        appearanceTime - 0.4
      );
    });
  });
}
