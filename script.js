/**
 * Apple-Style Portfolio — Interactions
 * V2.0 — DOMContentLoaded, defensive checks, performant scroll
 */
document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    /* ==========================================================
       DARK MODE
       ========================================================== */
    const btn = document.getElementById('themeBtn');
    if (!btn) return;

    const root = document.documentElement;
    const stored = localStorage.getItem('theme');
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    function apply(theme) {
        root.setAttribute('data-theme', theme);
        localStorage.setItem('theme', theme);
    }

    apply(stored || (systemDark ? 'dark' : 'light'));

    btn.addEventListener('click', function () {
        apply(root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark');
    });

    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function (e) {
        if (!localStorage.getItem('theme')) {
            apply(e.matches ? 'dark' : 'light');
        }
    });

    /* ==========================================================
       SCROLL REVEAL
       ========================================================== */
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const fadeSection = function (section) {
        section.classList.add('visible');
        section.style.willChange = 'auto';
    };

    const sections = document.querySelectorAll('.section-fade');
    if (reduceMotion) {
        sections.forEach(fadeSection);
    } else {
        const obs = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (entry.isIntersecting) {
                    fadeSection(entry.target);
                    obs.unobserve(entry.target);
                }
            });
        }, { rootMargin: '0px 0px -40px 0px', threshold: 0.08 });

        sections.forEach(function (el) {
            el.style.willChange = 'opacity, transform';
            obs.observe(el);
        });

        // Hero is visible from the start
        var hero = document.querySelector('.hero.section-fade');
        if (hero) {
            hero.classList.add('visible');
            hero.style.willChange = 'auto';
            obs.unobserve(hero);
        }
    }

    /* ==========================================================
       NAV SCROLL STATE
       ========================================================== */
    var nav = document.getElementById('nav');
    if (!nav) return;

    var ticking = false;
    function updateNav() {
        if (window.scrollY > 8) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        ticking = false;
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            requestAnimationFrame(updateNav);
            ticking = true;
        }
    }, { passive: true });

    updateNav();

    /* ==========================================================
       SMOOTH SCROLL LINKS
       ========================================================== */
    document.querySelectorAll('.nav-links a[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (e) {
            var href = this.getAttribute('href');
            if (!href || href === '#') return;
            var target = document.getElementById(href.substring(1));
            if (!target) return;
            e.preventDefault();
            window.scrollTo({
                top: target.getBoundingClientRect().top + window.scrollY - 50,
                behavior: 'smooth'
            });
        });
    });
});
