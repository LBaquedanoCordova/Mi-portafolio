import '@fortawesome/fontawesome-free/css/all.min.css';
import '../sass/main.scss';
import { initNavbar } from "./modules/navbar.js";
import { initTypingText } from "./modules/intro.js";
import { initDefaultCategory } from "./modules/tech.js";
import { initAnimationObserver } from "./modules/animationObserver.js";
import { initCopyEmail } from "./modules/copyEmail.js";
import { initRouter } from './modules/router.js';
import { initializeObserver } from './modules/observerManager.js';
import { initExperienceTimeline } from './modules/experience.js';

document.addEventListener('DOMContentLoaded', () => {
    initializeObserver();
    initRouter();
    initNavbar();
    initTypingText();
    initDefaultCategory();
    initCopyEmail();
    initAnimationObserver();
    initExperienceTimeline();
});
