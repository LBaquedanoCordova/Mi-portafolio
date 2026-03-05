import { gsap } from "./gsapInstance.js";
import { splitText } from './textSplitter.js';
import { initTypingText, prepareTypingText } from './intro.js';

export function initIntroAnimation() {
    prepareTypingText();

    const tl = gsap.timeline({
        defaults: { ease: 'power3.out' }
    });

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    const splitMode = isDesktop ? 'chars' : 'words';

    splitText('.intro__hero-title', splitMode);

    gsap.set('.intro__hero-title .split-word, .intro__hero-title .split-char', { y: '150%', opacity: 0 });
    gsap.set('.intro__hero-text', { y: -20, opacity: 0 });
    gsap.set('.intro__hero-subtitle', { x: -60, opacity: 0 });
    gsap.set('.intro__contact-list', { x: 60, opacity: 0 });
    gsap.set('.intro__contact-availability-wrapper', { x: -60, opacity: 0 });
    gsap.set('.nav', { y: '-100%', opacity: 0 });

    gsap.set('.intro__scroll', { opacity: 0 });

    tl.to('.nav', {
        y: '0%',
        opacity: 1,
        duration: 0.8,
        ease: 'power3.out'
    })

        .to('.intro__hero-text', {
            y: 0,
            opacity: 1,
            duration: 0.6,
            onStart: () => initTypingText()
        }, "-=0.4")

        .to('.intro__hero-title .split-word, .intro__hero-title .split-char', {
            y: '0%',
            opacity: 1,
            duration: 0.8,
            stagger: isDesktop ? 0.05 : 0.1,
            ease: 'back.out(1.7)'
        }, "-=0.2")

        .to('.intro__hero-subtitle', {
            x: 0,
            opacity: 1,
            duration: 0.6
        }, "-=0.4")

        .to('.intro__contact-list', {
            x: 0,
            opacity: 1,
            duration: 0.6
        }, "-=0.4")
        .to('.intro__contact-availability-wrapper', {
            x: 0,
            opacity: 1,
            duration: 0.6
        }, "-=0.4")

        .to('.intro__scroll', {
            opacity: 1,
            duration: 1
        }, "-=0.2");

    return tl;
}
