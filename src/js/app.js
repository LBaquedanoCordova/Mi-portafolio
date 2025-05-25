import '@fortawesome/fontawesome-free/css/all.min.css';
import '../sass/main.scss';
import { initNavbar } from "./modules/navbar.js";
import { initTypingText } from "./modules/intro.js";
import { initTech } from "./modules/tech.js";
import { initCopyEmail } from "./modules/copyEmail.js";

document.addEventListener('DOMContentLoaded', () => {
    initNavbar();
    initTypingText();
    initTech();
    initCopyEmail();
});
