// Crea un elemento con clase y contenido opcional
function createElementWithClass(tag, classes, content = "") {
  const element = document.createElement(tag);
  Array.isArray(classes)
    ? element.classList.add(...classes)
    : element.classList.add(classes);
  if (content) element.textContent = content;
  return element;
}

const textElement = document.querySelector(".intro__hero-text");
let cursor;

// Permite preparar el DOM (vaciando el texto) antes de animar
const prepareTypingText = () => {
  if (textElement) {
    textElement.innerHTML = ""; // Limpia el texto original
    // Creamos un nodo de texto vacío explícito para poder editarlo después
    textElement.appendChild(document.createTextNode(""));
    cursor = createElementWithClass("span", "intro__hero-cursor", "|");
    textElement.appendChild(cursor);
  }
};

const typingConfig = {
  text: "¡Hola! mi nombre es ...",
  speeds: {
    typing: 150,
    deleting: 100,
    baseDelay: 1000,
  },
  get longDelay() {
    return this.speeds.baseDelay * 5;
  },
  get repeatDelay() {
    return this.speeds.baseDelay * 1.5;
  },
};

const typingState = {
  index: 0,
  mode: "typing", // 'typing' | 'erasing' | 'waiting'
  delay: 0,
  lastTime: 0,
};

// Actualiza el contenido de texto del elemento con el texto parcial
const updateText = (content) => {
  if (textElement && textElement.firstChild) {
    textElement.firstChild.nodeValue = content;
  }
};

// Controla la animación de escritura, borrado y espera del texto animado
function animate(time) {
  if (!typingState.lastTime) typingState.lastTime = time;

  const elapsed = time - typingState.lastTime;
  typingState.lastTime = time;
  typingState.delay += elapsed;

  const { text, speeds, longDelay, repeatDelay } = typingConfig;
  const { mode, index } = typingState;

  if (mode === "typing") {
    if (typingState.delay >= speeds.typing) {
      typingState.delay = 0;
      if (index < text.length) {
        typingState.index++;
        updateText(text.slice(0, typingState.index));
      } else {
        typingState.mode = "waiting";
      }
    }
  } else if (mode === "erasing") {
    if (typingState.delay >= speeds.deleting) {
      typingState.delay = 0;
      if (index > 0) {
        typingState.index--;
        updateText(text.slice(0, typingState.index));
      } else {
        typingState.mode = "waiting";
      }
    }
  } else if (mode === "waiting") {
    const currentDelay = index === text.length ? longDelay : repeatDelay;
    cursor.classList.toggle("intro__hero-cursor--hidden", index === 0);

    if (typingState.delay >= currentDelay) {
      typingState.delay = 0;
      typingState.mode = index === text.length ? "erasing" : "typing";
      cursor.classList.remove("intro__hero-cursor--hidden");
    }
  }

  requestAnimationFrame(animate);
}

// Inicia la animación del texto tipeado en el hero
const initTypingText = () => {
  requestAnimationFrame(animate);
};

export { createElementWithClass, prepareTypingText, initTypingText };
