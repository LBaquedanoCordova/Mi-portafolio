import { createElementWithClass } from "./intro.js";

const technologies = [
  { name: "HTML", img: "/assets/icons/html.svg", category: "languages" },
  { name: "CSS", img: "/assets/icons/css.svg", category: "languages" },
  { name: "JavaScript", img: "/assets/icons/js.svg", category: "languages" },
  { name: "Bootstrap", img: "/assets/icons/bootstrap.svg", category: "styles" },
  { name: "Sass", img: "/assets/icons/sass.svg", category: "styles" },
  { name: "GIT", img: "/assets/icons/git.svg", category: "version-control" },
  {
    name: "GitHub",
    img: "/assets/icons/github.svg",
    category: "version-control",
  },
  { name: "VS Code", img: "/assets/icons/vscode.svg", category: "tools" },
  { name: "Windows", img: "/assets/icons/windows.svg", category: "tools" },
  { name: "React", img: "/assets/icons/react.svg", category: "frameworks" },
];

const techList = document.querySelector(".technologies__list");
const techNav = document.querySelector(".technologies__nav");
const techMenuButtons = document.querySelectorAll(".technologies__menu-btn");

let currentTechnologies = [];

// Renderiza la lista de tecnologías dentro del contenedor correspondiente.
function initTech() {
  techList.innerHTML = "";
  currentTechnologies.forEach((tech) => {
    const li = createElementWithClass("li", "technologies__item");

    const img = createElementWithClass("img", "technologies__icon");
    img.src = tech.img;
    img.alt = `Logo de ${tech.name}`;

    const p = createElementWithClass("p", "technologies__label", tech.name);

    li.append(img, p);
    techList.append(li);
  });
}

// Filtra los ítems tech en la sección Technologies.
function filterByCategory(category) {
  currentTechnologies = technologies.filter((t) => t.category === category);
  initTech();
}

techNav.addEventListener("click", (e) => {
  const btn = e.target.closest(".technologies__menu-btn");
  if (!btn) return;

  const category = btn.dataset.category;
  if (!category) return;

  filterByCategory(category);

  techMenuButtons.forEach((b) => b.classList.remove("is-active"));

  btn.classList.add("is-active");
});

function initDefaultCategory() {
  const firstBtn = techNav.querySelector(".technologies__menu-btn");
  if (!firstBtn) return;

  const defaultCategory = firstBtn.dataset.category;
  if (!defaultCategory) return;

  firstBtn.classList.add("is-active");

  filterByCategory(defaultCategory);
}

export { initDefaultCategory };
