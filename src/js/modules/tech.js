import { createElementWithClass } from "./intro.js";
import { observeElements } from "./observerManager.js";

const technologies = [
  { name: "HTML", img: "/assets/icons/html.svg", category: "languages" },
  { name: "CSS", img: "/assets/icons/css.svg", category: "languages" },
  { name: "JavaScript", img: "/assets/icons/js.svg", category: "languages" },
  { name: "TypeScript", img: "/assets/icons/ts.svg", category: "languages" },
  { name: "Bootstrap", img: "/assets/icons/bootstrap.svg", category: "styles" },
  { name: "Sass", img: "/assets/icons/sass.svg", category: "styles" },
  { name: "Tailwind CSS", img: "/assets/icons/tailwindcss.svg", category: "styles" },
  { name: "GIT", img: "/assets/icons/git.svg", category: "version-control" },
  {
    name: "GitHub",
    img: "/assets/icons/github.svg",
    category: "version-control",
  },
  { name: "Vitest", img: "/assets/icons/vitest.svg", category: "testing" },
  { name: "VS Code", img: "/assets/icons/vscode.svg", category: "tools" },
  { name: "Windows", img: "/assets/icons/windows.svg", category: "tools" },
  { name: "React", img: "/assets/icons/react.svg", category: "frameworks" },
  { name: "Angular", img: "/assets/icons/angular.svg", category: "frameworks" },
];

const techList = document.querySelector(".technologies__list");
const techNav = document.querySelector(".technologies__nav");
const techMenuButtons = document.querySelectorAll(".technologies__menu-btn");

let currentTechnologies = [];

// Renderiza la lista de tecnologías dentro del contenedor correspondiente.
function initTech() {
  techList.innerHTML = "";
  const staggerDelayIncrement = 100;

  const newItems = []; // Array para guardar los nuevos elementos

  currentTechnologies.forEach((tech, index) => {
    const li = createElementWithClass("li", [
      "technologies__item",
      "animate-on-scroll",
      "stagger-item",
    ]);

    const delay = index * staggerDelayIncrement;
    li.style.setProperty("--stagger-delay", `${delay}ms`);

    const img = createElementWithClass("img", "technologies__icon");
    img.src = tech.img;
    img.alt = `Logo de ${tech.name}`;

    const p = createElementWithClass("p", "technologies__label", tech.name);

    li.append(img, p);
    techList.append(li);
    newItems.push(li);
  });

  // Pedir al gestor que observe todos los nuevos ítems creados
  if (newItems.length > 0) {
    observeElements(newItems);
  }
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
