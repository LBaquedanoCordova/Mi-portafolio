import { createElementWithClass } from "./intro.js";

const contactItems = document.querySelectorAll(
  ".intro__contact-item--email, .contact__list-item--email"
);
const allItems = document.querySelectorAll(
  ".intro__contact-item, .contact__list-item"
);
let tooltipExists = null;

function positionTooltip(contactLink, contactItem, tooltip) {
  const {
    top: linkTop,
    left: linkLeft,
    right: linkRight,
    bottom: linkBottom,
    height: linkHeight,
    width: linkWidth,
  } = contactLink.getBoundingClientRect();
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

function showTooltip(contactLink, contactItem) {
  if (tooltipExists) return;

  navigator.clipboard.writeText(contactLink.textContent.trim());

  const tooltip = createElementWithClass("span", "email-tooltip", "Copiado!");
  tooltip.dataset.tooltip = "active";

  contactItem.append(tooltip);
  tooltipExists = tooltip;

  const copyIcon = contactLink.querySelector(".fa-copy");
  if (copyIcon) copyIcon.classList.replace("fa-copy", "fa-check");

  setTimeout(() => {
    copyIcon?.classList.replace("fa-check", "fa-copy");
    tooltip.remove();
    tooltipExists = null;
  }, 1500);
  requestAnimationFrame(() =>
    positionTooltip(contactLink, contactItem, tooltip)
  );
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
  allItems.forEach((item) => {
    item.addEventListener("click", (e) => {
      const link = item.querySelector("a");

      if (link && link.target === "_blank") {
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
    const contactLink = contactItem.querySelector(".copy-email-link");

    if (!contactLink) return;
    contactLink.addEventListener("click", (e) => {
      e.preventDefault();
      showTooltip(e.currentTarget, contactItem);
    });
  });

  addClickAnimations();
};
