import { gsap, ScrollTrigger, $$, reduce } from './common';

if (!reduce) {
  const title = document.querySelector('.case-title');
  if (title) gsap.from(title, { yPercent: 40, filter: 'blur(16px)', opacity: 0, duration: 1.2, ease: 'power4.out', delay: 0.1 });
  gsap.from('.facts > div', { y: 30, opacity: 0, duration: 0.8, stagger: 0.08, ease: 'power3.out', delay: 0.5 });
  $$('.reveal').forEach((el) => gsap.from(el, {
    y: 70, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: el, start: 'top 90%' },
  }));
  gsap.from('.next .mega', { xPercent: 12, filter: 'blur(14px)', opacity: 0, ease: 'none', scrollTrigger: { trigger: '.next', start: 'top 90%', end: 'top 45%', scrub: true } });
  addEventListener('load', () => ScrollTrigger.refresh());
}
