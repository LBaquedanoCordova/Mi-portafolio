import { createElementWithClass } from "./intro.js";

const technologies = [
  { name: "HTML", img: "./assets/icons/html.svg" },
  { name: "CSS", img: "./assets/icons/css.svg" },
  { name: "JavaScript", img: "./assets/icons/js.svg" },
  { name: "Bootstrap", img: "./assets/icons/bootstrap.svg" },
  { name: "Sass", img: "./assets/icons/sass.svg" },
  { name: "GIT", img: "./assets/icons/git.svg" },
  { name: "GitHub", img: "./assets/icons/github.svg" },
  { name: "VS Code", img: "./assets/icons/vscode.svg" },
  { name: "Windows", img: "./assets/icons/windows.svg" },
];

// Renderiza la lista de tecnologías dentro del contenedor correspondiente.
function initTech() {
  const techList = document.querySelector(".technologies__list");
  techList.innerHTML = "";

  technologies.forEach((tech) => {
    const li = createElementWithClass("li", "technologies__item");

    const img = createElementWithClass("img", "technologies__icon");
    img.src = tech.img;
    img.alt = `Logo de ${tech.name}`;

    const p = createElementWithClass("p", "technologies__label", tech.name);

    li.append(img, p);
    techList.append(li);
  });
}

export { initTech };
