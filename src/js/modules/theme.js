// Actualiza el valor de un atributo en un elemento
function updateAttributeElem({ elem, attr, value }) {
  elem.setAttribute(attr, value);
}


// Devuelve el tema actual según la preferencia del usuario o la configuración del sistema.
function getTheme({ localStorageTheme, systemSettingDark }) {
  if (localStorageTheme !== null) return localStorageTheme;

  if (systemSettingDark.matches) return "dark";

  return "light";
}

// Inicializa el them según la preferencia del usuario o del sistema.
export function initTheme({ html, imgLogo, navThemeToggle, onThemeChange }) {
  const localStorageTheme = localStorage.getItem("theme");
  const systemSettingDark = window.matchMedia("(prefers-color-scheme: dark)");
  const theme = getTheme({ localStorageTheme, systemSettingDark });

  if (typeof onThemeChange === "function") onThemeChange(theme);

  updateAttributeElem({ elem: html, attr: "data-theme", value: theme });

  const logoSrc =
    theme === "dark"
      ? "/assets/images/personal-logo-dark.png"
      : "/assets/images/personal-logo.png";
  updateAttributeElem({ elem: imgLogo, attr: "src", value: logoSrc });

  const ariaLabel =
    theme === "dark" ? "Activate light theme" : "Activate dark theme";
  updateAttributeElem({
    elem: navThemeToggle,
    attr: "aria-label",
    value: ariaLabel,
  });
}
