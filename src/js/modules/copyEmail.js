import { createElementWithClass } from "./intro.js";
import { gsap } from "./gsapInstance.js";

const contactItems = document.querySelectorAll(
  ".intro__contact-item--email, .contact__list-item--email"
);

const allLinks = document.querySelectorAll(
  ".intro__contact-link, .contact__link, .projects__link"
);

function positionTooltip(emailSpan, contactItem, tooltip) {
  const {
    top: linkTop,
    left: linkLeft,
    right: linkRight,
    bottom: linkBottom,
    height: linkHeight,
    width: linkWidth,
  } = emailSpan.getBoundingClientRect();
  const { top: itemTop, left: itemLeft } = contactItem.getBoundingClientRect();
  const { width: tooltipWidth, height: tooltipHeight } =
    tooltip.getBoundingClientRect();
  const spaceRight = window.innerWidth - (linkRight + 10);

  const isEnoughSpaceRight = spaceRight >= tooltipWidth + 10;

  tooltip.style.top = isEnoughSpaceRight
    ? `${linkTop - itemTop + linkHeight / 2 - tooltipHeight / 2}px`
    : `${linkBottom - itemTop + 10}px`;

  tooltip.style.left = isEnoughSpaceRight
    ? `${linkRight - itemLeft + 10}px`
    : `${linkLeft - itemLeft + linkWidth / 2 - tooltipWidth / 2}px`;

  tooltip.classList.toggle("email-tooltip--top", !isEnoughSpaceRight);
}

function createTooltip() {
  const tooltip = createElementWithClass("span", "email-tooltip");
  tooltip.dataset.tooltip = "active";

  const contentBorder = createElementWithClass("span", "email-tooltip__border");
  const content = createElementWithClass(
    "span",
    "email-tooltip__content",
    "Copiado!"
  );

  const arrowBorder = createElementWithClass(
    "span",
    "email-tooltip__arrow-border"
  );
  const arrow = createElementWithClass("span", "email-tooltip__arrow");

  arrowBorder.append(arrow);
  contentBorder.append(content, arrowBorder);
  tooltip.append(contentBorder);

  return tooltip;
}

// Mostrar tooltip y orquestar morph + tooltip con un solo timeline (GSAP + MorphSVGPlugin)
function showTooltip(emailSpan, contactItem) {
  if (!contactItem._tooltipState)
    contactItem._tooltipState = { tooltipExists: null, isOpen: false };

  const state = contactItem._tooltipState;

  if (state.isOpen) return;

  state.isOpen = true;

  // copia al portapapeles (no bloqueante)
  navigator.clipboard.writeText(emailSpan.textContent.trim());

  // crear e insertar tooltip (pero invisible al inicio)
  const tooltip = createTooltip();
  contactItem.append(tooltip);
  state.tooltipExists = tooltip;

  positionTooltip(emailSpan, contactItem, tooltip);

  // seleccionar los paths
  const copyIconFrontPath = emailSpan.querySelector("#copyIcon-front");
  const copyIconBackPath = emailSpan.querySelector("#copyIcon-back");

  const copyIconFrontShape =
    copyIconFrontPath.dataset.original ||
    "M15 2C10 2 10 2 10 7L10 17C10 22 10 22 15 22L21 22C26 22 26 22 26 17L26 7 21 2Z";
  const copyIconBackShape =
    copyIconBackPath.dataset.original ||
    "M10 8 9 8C4 8 4 8 4 13L4 23C4 28 4 28 9 28L15 28C20 28 20 28 20 23L20 22 15 22C10 22 10 22 10 17Z";

  const checFirstStroke = "M7 16 12 25";
  const checkSecondStroke = "M12 25 23 5";

  // configuración que puedes ajustar
  const morphDuration = 0.36; // duración de cada morph
  const tooltipInDelay = 0.32; // retraso desde el inicio del morph para mostrar tooltip
  const tooltipVisibleTime = 0.8; // tiempo total que quieres que el tooltip esté visible
  const tooltipInDuration = 0.18;
  const tooltipOutDuration = 0.14;

  const removeTooltip = () => {
    tooltip.remove();
    state.tooltipExists = null;
    state.isOpen = false;
  };

  try {
    gsap.set(tooltip, { opacity: 0, scale: 0.9 });

    const tl = gsap.timeline({
      defaults: { ease: "power4.inOut" },
      onComplete: removeTooltip,
    });

    // Morph a "check"
    tl.to(
      copyIconFrontPath,
      {
        duration: morphDuration,
        morphSVG: {
          type: "rotational",
          map: "position",
          shape: checFirstStroke,
        },
      },
      0
    );
    tl.to(
      copyIconBackPath,
      {
        duration: morphDuration,
        morphSVG: {
          type: "rotational",
          map: "position",
          shape: checkSecondStroke,
        },
      },
      0
    );

    // Mostrar tooltip
    tl.to(
      tooltip,
      {
        duration: tooltipInDuration,
        opacity: 1,
        scale: 1,
        ease: "power3.out",
      },
      tooltipInDelay
    );

    // Mantener tooltip visible
    tl.to(
      {},
      { duration: Math.max(0, tooltipVisibleTime - tooltipInDuration) }
    );

    // Morph de regreso a "copy"
    tl.to(
      copyIconFrontPath,
      {
        duration: morphDuration,
        morphSVG: {
          type: "rotational",
          map: "position",
          shape: copyIconFrontShape,
        },
      },
      ">"
    );
    tl.to(
      copyIconBackPath,
      {
        duration: morphDuration,
        morphSVG: {
          type: "rotational",
          map: "position",
          shape: copyIconBackShape,
        },
      },
      "<"
    );

    // Ocultar tooltip
    tl.to(
      tooltip,
      {
        duration: tooltipOutDuration,
        opacity: 0,
        scale: 0.92,
        ease: "power2.in",
      },
      `-=${tooltipOutDuration * 0.5}`
    );
  } catch (error) {
    tooltip.style.opacity = "1";
    tooltip.style.transform = "scale(1)";

    setTimeout(() => {
      removeTooltip();
    }, (tooltipVisibleTime + tooltipOutDuration) * 1000);
  }
}

function handleAnimation(item, callback) {
  item.classList.add("scale-animation");
  item.addEventListener(
    "animationend",
    () => {
      item.classList.remove("scale-animation");
      callback?.();
    },
    { once: true }
  );
}

function addClickAnimations() {
  allLinks.forEach((link) => {
    const item = link.closest(
      ".contact__list-item, .intro__contact-item, .projects__link"
    );

    link.addEventListener("click", (e) => {
      if (link.target === "_blank") {
        e.preventDefault();
        handleAnimation(item, () => {
          window.open(link.href, "_blank");
        });
      } else {
        handleAnimation(item);
      }
    });
  });
}

export const initCopyEmail = () => {
  contactItems.forEach((contactItem) => {
    const emailSpan = contactItem.querySelector(".copy-email-link");

    if (!emailSpan) return;
    emailSpan.addEventListener("click", () => {
      showTooltip(emailSpan, contactItem);
    });
  });

  addClickAnimations();
};
