import { gsap } from "./gsapInstance.js";

/**
 * Anima la transición de una ruta SVG entre dos formas usando GSAP y morphSVG.
 */
export function updatePathSVG({ iconElemPath, useFinalPath, pathOriginal, pathFinal }) {
  try {
    gsap.to(iconElemPath, {
      duration: 0.3,
      morphSVG: {
        type: "rotational",
        map: "position",
        shape: useFinalPath ? pathFinal : pathOriginal,
      },
      ease: "power4.inOut",
    });
  } catch (error) {
    if (useFinalPath) {
      iconElemPath.setAttribute("d", pathFinal);
    } else {
      iconElemPath.setAttribute("d", pathOriginal);
    }
  }
}

/**
 * Cambia el icono del tema actual claro/oscuro y aplica animación si es necesario.
 */
export function setNavThemeIcon(pathThemeIcon, theme) {
  const pathMorphTheme = {
    pathOriginal:
      "M12 3V4M12 20V21M4 12H3M6.31412 6.31412L5.5 5.5M17.6859 6.31412L18.5 5.5M6.31412 17.69L5.5 18.5001M17.6859 17.69L18.5 18.5001M21 12H20M16 12C16 14.2091 14.2091 16 12 16C9.79086 16 8 14.2091 8 12C8 9.79086 9.79086 8 12 8C14.2091 8 16 9.79086 16 12Z",
    pathFinal:
      "M12 22C17.5228 22 22 17.5228 22 12C22 11.5373 21.3065 11.4608 21.0672 11.8568C19.9289 13.7406 17.8615 15 15.5 15C11.9101 15 9 12.0899 9 8.5C9 6.13845 10.2594 4.07105 12.1432 2.93276C12.5392 2.69347 12.4627 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z",
  };

  if (!pathThemeIcon) return;

  const isDark = theme === "dark";

  if (!pathThemeIcon.dataset.initiated) {
    pathThemeIcon.setAttribute(
      "d",
      isDark ? pathMorphTheme.pathFinal : pathMorphTheme.pathOriginal
    );
    pathThemeIcon.dataset.initiated = "true";
  } else {
    updatePathSVG({
      iconElemPath: pathThemeIcon,
      useFinalPath: isDark,
      ...pathMorphTheme,
    });
  }

  pathThemeIcon.classList.toggle("theme-icon--sun", !isDark);
  pathThemeIcon.classList.toggle("theme-icon--moon", isDark);
}
