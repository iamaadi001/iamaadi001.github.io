import { gsap, ScrollTrigger, $, $$, rand, reduce, lenis, openLightbox, makeThread, smoothPath } from './common';

const vw = () => innerWidth, vh = () => innerHeight;

/* ---------- threads: one line that follows the eye down the page ---------- */
const threads = new Map<Element, ReturnType<typeof makeThread>>();
$$<SVGSVGElement>('svg.thread').forEach((s) => threads.set(s.parentElement!, makeThread(s)));
const heroThread = threads.get($('.hero'))!;
const trackAll = () => threads.forEach((t, sec) => { if (sec !== $('.hero')) t.track(vh() * 0.62); });

/* ---------- lightbox triggers ---------- */
$$('.sheet').forEach((s) => s.addEventListener('click', () => openLightbox(s.dataset.full!, 'img')));
$$<HTMLVideoElement>('.wall__col video').forEach((v) => v.addEventListener('click', () => openLightbox(`/media/reels/${v.dataset.reel}.mp4`, 'video')));

/* ---------- folders open on tap ---------- */
$$('.folder').forEach((f) => {
  f.addEventListener('click', () => f.classList.toggle('is-open'));
  f.addEventListener('keydown', (e) => { if ((e as KeyboardEvent).key === 'Enter') f.classList.toggle('is-open'); });
});

/* ---------- crossing tapes: drift, faster with scroll speed ---------- */
const tapes = $$('.tape__track').map((el) => ({ el, x: 0, dir: Number(el.dataset.dir) }));
if (!reduce) {
  gsap.ticker.add(() => {
    const v = lenis ? Math.min(40, Math.abs(lenis.velocity)) : 0;
    tapes.forEach((t) => {
      const half = t.el.scrollWidth / 2;
      t.x += t.dir * (0.6 + v * 0.35);
      if (t.x < -half) t.x += half;
      if (t.x > 0) t.x -= half;
      t.el.style.transform = `translate3d(${t.x}px,0,0)`;
    });
  });
}

/* ---------- toolkit: tiles fall into a pile ---------- */
const pit = $('.pit');
const tiles = $$('.tile');
type Spot = { x: number; y: number; r: number; row: number };
let spots: Spot[] = [];
let landed = false;
const layoutTiles = () => {
  const W = pit.clientWidth, size = tiles[0].offsetWidth, step = size * 1.08;
  const perRow = Math.max(3, Math.min(11, Math.floor(W / step)));
  const rows: number[] = [];
  let left = tiles.length, n = perRow;
  while (left > 0) { const c = Math.min(n, left); rows.push(c); left -= c; n = Math.max(2, n - 1); }
  const H = rows.length * size * 0.95 + 60;
  pit.style.height = `${H}px`;
  spots = [];
  rows.forEach((count, r) => {
    const x0 = (W - count * step) / 2 + (r % 2 ? step * 0.3 : 0);
    for (let j = 0; j < count; j++) spots.push({ x: x0 + j * step + rand(-10, 10), y: H - 40 - size * (r + 1) * 0.92 + rand(-6, 6), r: rand(-24, 24), row: r });
  });
};
const placeTiles = (fallen: boolean) => tiles.forEach((t, i) => {
  const s = spots[i];
  gsap.set(t, { x: s.x, y: fallen ? s.y : -pit.offsetTop - 300 - s.row * 140, rotation: fallen ? s.r : rand(-70, 70) });
});
const dropTiles = () => {
  if (landed) return;
  landed = true;
  tiles.forEach((t, i) => gsap.to(t, { y: spots[i].y, rotation: spots[i].r, duration: rand(0.9, 1.3), ease: 'bounce.out', delay: spots[i].row * 0.16 + rand(0, 0.3) }));
};
pit.addEventListener('pointermove', (e) => {
  if (!landed) return;
  const b = pit.getBoundingClientRect(), px = e.clientX - b.left, py = e.clientY - b.top;
  tiles.forEach((t, i) => {
    const s = spots[i], half = t.offsetWidth / 2, dx = s.x + half - px, dy = s.y + half - py, d = Math.hypot(dx, dy);
    const push = d < 170 ? (170 - d) / 170 : 0;
    gsap.to(t, { x: s.x + dx * push * 0.4, y: s.y + Math.min(0, dy * push * 0.4), rotation: s.r + push * (dx > 0 ? 16 : -16), duration: 0.45, ease: 'power3.out' });
  });
});
pit.addEventListener('pointerleave', () => {
  if (landed) tiles.forEach((t, i) => gsap.to(t, { x: spots[i].x, y: spots[i].y, rotation: spots[i].r, duration: 0.9, ease: 'elastic.out(1, 0.55)' }));
});

/* ---------- knot: traced from Aaditya's sketch; pulling it opens an email ---------- */
// points in the sketch's own pixels (about 1220 x 1270), top end first, dot last
const KNOT: [number, number][] = [
  [790, -90], [790, 0], [835, 100], [800, 190], [650, 255], [520, 250], [390, 200], [240, 205], [165, 330], [190, 460],
  [330, 520], [480, 510], [590, 500], [800, 485], [1010, 500], [1115, 590], [1050, 680], [880, 712], [690, 680], [610, 600],
  [585, 480], [610, 380], [650, 260], [680, 140], [610, 85], [470, 120], [360, 210], [320, 330], [390, 405], [520, 410],
  [700, 395], [880, 420], [940, 520], [880, 620], [740, 650], [560, 640], [310, 610], [165, 650], [135, 740], [230, 830],
  [420, 850], [600, 830], [760, 815], [860, 850], [860, 950], [760, 1000], [620, 1000], [520, 950], [485, 840], [520, 760],
  [600, 728], [700, 760], [715, 840], [660, 900], [540, 950], [420, 985], [360, 1040],
];
const knot = $('.knot');
const knotPath = $<SVGPathElement>('path', knot);
const knotDot = $<SVGCircleElement>('circle', knot);
const handle = $('.knot__handle', knot);
const knotSvg = $<SVGSVGElement>('svg', knot);
let tangled: [number, number][] = [], straight: [number, number][] = [], untangle = 0, knotLen = 0, opened = false;
const buildKnot = () => {
  const w = knot.clientWidth, h = knot.clientHeight;
  knotSvg.setAttribute('viewBox', `0 0 ${w} ${h}`);
  const s = Math.min(w / 1050, h / 1060) * 0.95, ox = (w - 1000 * s) / 2 - 120 * s, oy = (h - 1040 * s) / 2;
  tangled = KNOT.map(([x, y]) => [ox + x * s, oy + y * s]);
  const top = tangled[0], bottom = h + 20;
  straight = tangled.map((_, i) => [top[0], top[1] + ((bottom - top[1]) * i) / (tangled.length - 1)]);
  renderKnot();
  knotLen = knotPath.getTotalLength();
};
const renderKnot = () => {
  const P = tangled.map((p, i) => [p[0] + (straight[i][0] - p[0]) * untangle, p[1] + (straight[i][1] - p[1]) * untangle] as [number, number]);
  knotPath.setAttribute('d', smoothPath(P));
  const end = P[P.length - 1];
  knotDot.setAttribute('cx', `${end[0]}`);
  knotDot.setAttribute('cy', `${end[1]}`);
  handle.style.left = `${end[0]}px`;
  handle.style.top = `${end[1]}px`;
};
const finishPull = () => {
  if (opened) return;
  opened = true;
  gsap.to({ v: untangle }, {
    v: 1, duration: 0.7, ease: 'power3.out',
    onUpdate() { untangle = this.targets()[0].v; renderKnot(); },
    onComplete: () => {
      $('.cta__talk').classList.add('is-pulled');
      location.href = 'mailto:adityagambhir38@gmail.com';
      // let it hang loose again after a moment
      gsap.to({ v: 1 }, { v: 0, delay: 1.6, duration: 1.4, ease: 'elastic.out(1, 0.6)', onUpdate() { untangle = this.targets()[0].v; renderKnot(); }, onComplete: () => { opened = false; } });
    },
  });
};
handle.addEventListener('pointerdown', (e) => {
  const sx = e.clientX, sy = e.clientY, start = untangle;
  let moved = false;
  handle.setPointerCapture(e.pointerId);
  const move = (ev: PointerEvent) => {
    const d = Math.hypot(ev.clientX - sx, ev.clientY - sy);
    if (d > 6) moved = true;
    untangle = Math.max(0, Math.min(1, start + d / 220));
    renderKnot();
  };
  const up = () => {
    handle.removeEventListener('pointermove', move);
    if (!moved || untangle > 0.45) finishPull();
    else gsap.to({ v: untangle }, { v: 0, duration: 0.9, ease: 'elastic.out(1, 0.6)', onUpdate() { untangle = this.targets()[0].v; renderKnot(); } });
  };
  handle.addEventListener('pointermove', move);
  handle.addEventListener('pointerup', up, { once: true });
});
handle.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); finishPull(); } });
buildKnot();
addEventListener('resize', buildKnot);

/* ---------- everything scroll-driven, built in page order ---------- */
function build(desk: boolean) {
  // HERO: pinned; the name parts and the photo leans in
  const hero = gsap.timeline({ scrollTrigger: { trigger: '.hero', start: 'top top', end: '+=70%', pin: true, scrub: 0.6 } });
  hero.to('.hero__name .l1', { xPercent: -14, ease: 'none' }, 0)
    .to('.hero__name .l2', { xPercent: 12, ease: 'none' }, 0)
    .to('.hero__me', { scale: 1.12, yPercent: -3, transformOrigin: '50% 100%', ease: 'none' }, 0)
    .to('.hero__tag', { y: -90, ease: 'none' }, 0)
    .to('.hero__foot', { opacity: 0, y: -40, ease: 'none' }, 0);

  // ABOUT
  $$('.about__lines .line').forEach((l, i) => gsap.fromTo(l,
    { filter: 'blur(14px)', opacity: 0.08, x: i % 2 ? 80 : -80 },
    { filter: 'blur(0px)', opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: l, start: 'top 92%', end: 'top 55%', scrub: true } }));
  gsap.from('.about__say', { y: 60, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about__body', start: 'top 80%' } });
  $$('.group').forEach((g, i) => {
    gsap.from($('.polaroid', g), { y: 140, rotation: i % 2 ? 14 : -14, opacity: 0, duration: 1.1, ease: 'back.out(1.3)', scrollTrigger: { trigger: g, start: 'top 85%' } });
    gsap.from($$('.degree', g), { x: i % 2 ? -120 : 120, rotation: i % 2 ? -10 : 10, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'back.out(1.5)', scrollTrigger: { trigger: g, start: 'top 80%' } });
  });

  // WHAT I DO: vertical scroll pans sideways
  const track = $('.do__track');
  const pan = gsap.to(track, {
    x: () => -(track.scrollWidth - vw()), ease: 'none',
    scrollTrigger: { trigger: '.do', start: 'top top', end: () => `+=${track.scrollWidth - vw()}`, pin: true, scrub: 1, invalidateOnRefresh: true },
  });
  $$('.panel').forEach((p) => {
    // depth: the outlined word drifts slowly, the media pieces move at their own speed
    const word = $('.panel__word', p);
    const span = { trigger: p, containerAnimation: pan, start: 'left right', end: 'right left', scrub: true };
    if (word) gsap.fromTo(word, { xPercent: 12 }, { xPercent: -38, ease: 'none', scrollTrigger: span });
    $$<HTMLElement>('.scatter .s', p).forEach((m) => {
      const d = Number(m.dataset.depth || 1);
      gsap.fromTo(m, { x: d * 160 }, { x: -d * 160, ease: 'none', scrollTrigger: span });
    });
    const scatter = $('.scatter', p);
    if (scatter) gsap.fromTo(scatter, { scale: 1.15, opacity: 0.2 }, { scale: 1, opacity: 1, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: pan, start: 'left right', end: 'left 25%', scrub: true } });
    const title = $('.panel__title', p), stat = $('.panel__stat', p);
    if (title) gsap.from(title, { xPercent: 40, opacity: 0, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: pan, start: 'left 80%', end: 'left 20%', scrub: true } });
    if (stat) gsap.from(stat, { y: 140, opacity: 0, scale: 0.8, ease: 'none', scrollTrigger: { trigger: p, containerAnimation: pan, start: 'left 70%', end: 'left 25%', scrub: true } });
  });
  // workflow: the line runs step by step, each step lights up as it is reached
  const steps = $$('.flow > *');
  const flowTl = gsap.timeline({ scrollTrigger: { trigger: '.flow', containerAnimation: pan, start: 'left 85%', end: 'left 5%', scrub: true } });
  steps.forEach((el, i) => {
    if (el.classList.contains('fline')) flowTl.fromTo(el, { scaleX: 0 }, { scaleX: 1, duration: 0.5, ease: 'none' }, i * 0.5);
    else {
      const nodes = el.classList.contains('fbranch') ? $$('.fnode', el) : [el];
      flowTl.fromTo(nodes, { y: 30, opacity: 0.15 }, { y: 0, opacity: 1, duration: 0.4, ease: 'none', onStart: () => nodes.forEach((n) => n.classList.add('is-on')), onReverseComplete: () => nodes.forEach((n) => n.classList.remove('is-on')) }, i * 0.5);
    }
  });

  // REEL WALL: tilted columns slide against each other
  const wall = gsap.timeline({ scrollTrigger: { trigger: '.wall', start: 'top top', end: '+=170%', pin: true, scrub: 0.8 } });
  $$('.wall__col').forEach((c, i) => wall.fromTo(c, { yPercent: i % 2 ? -28 : 6 }, { yPercent: i % 2 ? 6 : -30, ease: 'none' }, 0));
  wall.fromTo('.wall__title .mega', { scale: 0.85 }, { scale: 1.06, ease: 'none' }, 0);

  // 3D: full-screen clips change as you scroll
  const clips = $$('.three__clip');
  const label = $('.three__label'), count = $('.three__count');
  const three = gsap.timeline({
    scrollTrigger: {
      trigger: '.three', start: 'top top', end: `+=${clips.length * 70}%`, pin: true, scrub: 0.5,
      onUpdate: (st) => {
        const i = Math.min(clips.length - 1, Math.floor(st.progress * clips.length));
        label.textContent = clips[i].dataset.label!;
        count.textContent = `0${i + 1} / 0${clips.length}`;
      },
    },
  });
  three.to('.three__bar i', { scaleX: 1, ease: 'none', duration: clips.length }, 0);
  clips.forEach((c, i) => {
    if (!i) return;
    three.fromTo(c, { opacity: 0, scale: 1.12 }, { opacity: 1, scale: 1, duration: 0.35, ease: 'power2.out' }, i - 0.15);
  });
  three.from('.three__text .mega', { yPercent: 30, opacity: 0, duration: 0.5 }, 0);

  // DRAWINGS: sheets fly in from all sides and land around the title
  const sheets = $$('.sheet');
  const hand = gsap.timeline({ scrollTrigger: { trigger: '.hand-sec', start: 'top top', end: '+=170%', pin: true, scrub: 0.7, invalidateOnRefresh: true } });
  hand.from('.hand-sec__title .mega', { scale: 0.7, opacity: 0, duration: 1 }, 0);
  sheets.forEach((s, i) => {
    const a = rand(0, Math.PI * 2);
    hand.fromTo(s,
      { xPercent: -50, yPercent: -50, x: Math.cos(a) * vw() * 0.9, y: Math.sin(a) * vh() * 0.9, rotation: rand(-120, 120), scale: 1.5 },
      { x: () => (Number(s.dataset.x) / 100) * vw(), y: () => (Number(s.dataset.y) / 100) * vh() * (desk ? 1 : 0.8), rotation: Number(s.dataset.r), scale: 1, duration: 1, ease: 'power3.out' },
      0.3 + i * 0.22);
  });

  // FOLDERS pop up, then tools fall
  gsap.from('.folder', { y: 320, rotation: (i: number) => [-9, 6, -4, 8, -6][i], opacity: 0, duration: 1.1, stagger: 0.12, ease: 'back.out(1.5)', scrollTrigger: { trigger: '.folders', start: 'top 88%' } });
  layoutTiles();
  placeTiles(landed);
  ScrollTrigger.create({ trigger: pit, start: 'top 80%', once: true, onEnter: dropTiles });

  // SELECTED WORK
  gsap.from('.work-intro .mega', { yPercent: 40, filter: 'blur(14px)', opacity: 0, ease: 'none', scrollTrigger: { trigger: '.work-intro', start: 'top 85%', end: 'top 35%', scrub: true } });
  $$('.chapter').forEach((ch) => {
    $$<HTMLElement>('.float', ch).forEach((f) => gsap.fromTo(f, { yPercent: 0 }, { yPercent: Number(f.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: ch, start: 'top bottom', end: 'bottom top', scrub: true } }));
    gsap.fromTo($('.chapter__name .mega', ch), { xPercent: 18, filter: 'blur(16px)', opacity: 0.1 }, { xPercent: 0, filter: 'blur(0px)', opacity: 1, ease: 'none', scrollTrigger: { trigger: ch, start: 'top 70%', end: 'center 60%', scrub: true } });
    $$('.sticker', ch).forEach((s) => gsap.from(s, { scale: 0, rotation: -40, duration: 0.7, ease: 'back.out(2.2)', scrollTrigger: { trigger: s, start: 'top 85%' } }));
  });

  // COUNTRIES: flags slap on one by one, five each side
  const flags = $$('.flag');
  const fx = (f: HTMLElement) => (Number(f.dataset.x) / 100) * vw() * (desk ? 1 : 0.78);
  const fy = (f: HTMLElement) => (Number(f.dataset.y) / 100) * vh();
  const places = gsap.timeline({ scrollTrigger: { trigger: '.places', start: 'top top', end: '+=150%', pin: true, scrub: 0.6, invalidateOnRefresh: true } });
  places.from('.places__big', { scale: 0.75, opacity: 0, duration: 1 }, 0);
  flags.forEach((f, i) => places.fromTo(f,
    { xPercent: -50, yPercent: -50, x: () => fx(f), y: () => fy(f) + vh() * 0.5, rotation: rand(-60, 60), scale: 0.4, opacity: 0 },
    { y: () => fy(f), rotation: Number(f.dataset.r), scale: 1, opacity: 1, duration: 0.6, ease: 'back.out(1.8)' },
    0.4 + i * 0.22));
  places.to({}, { duration: 0.6 });

  // LIFE: collage columns drift a little
  gsap.from('.life__head .mega', { yPercent: 50, opacity: 0, filter: 'blur(14px)', ease: 'none', scrollTrigger: { trigger: '.life', start: 'top 85%', end: 'top 40%', scrub: true } });
  if (desk) $$('.life__col').forEach((c) => gsap.to(c, { yPercent: Number(c.dataset.speed) * 100, ease: 'none', scrollTrigger: { trigger: '.life', start: 'top bottom', end: 'bottom top', scrub: true } }));
  $$('.snap').forEach((s) => gsap.from(s, { y: 80, opacity: 0, rotation: rand(-10, 10), duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: s, start: 'top 95%' } }));

  // CTA
  $$('.cta .line').forEach((l, i) => gsap.fromTo(l, { filter: 'blur(14px)', opacity: 0.08, x: i % 2 ? 70 : -70 }, { filter: 'blur(0px)', opacity: 1, x: 0, ease: 'none', scrollTrigger: { trigger: l, start: 'top 95%', end: 'top 60%', scrub: true } }));
  gsap.fromTo(knotPath, { strokeDasharray: () => knotLen, strokeDashoffset: () => knotLen }, { strokeDashoffset: 0, ease: 'none', scrollTrigger: { trigger: '.cta', start: 'top 70%', end: 'top 10%', scrub: true } });
  gsap.from('.footer__mark', { yPercent: 60, opacity: 0, ease: 'none', scrollTrigger: { trigger: '.cta__foot', start: 'top 100%', end: 'bottom bottom', scrub: true } });

  // the thread follows a line 62% down the screen
  ScrollTrigger.create({ start: 0, end: 'max', onUpdate: trackAll, onRefresh: trackAll });
}

/* ---------- static fallback ---------- */
function still() {
  $('.sig')?.remove();
  threads.forEach((t) => t.set(1));
  $$('.sheet').forEach((s) => gsap.set(s, { xPercent: -50, yPercent: -50, x: (Number(s.dataset.x) / 100) * vw(), y: (Number(s.dataset.y) / 100) * vh(), rotation: Number(s.dataset.r) }));
  $$('.flag').forEach((f) => gsap.set(f, { xPercent: -50, yPercent: -50, x: (Number(f.dataset.x) / 100) * vw(), y: (Number(f.dataset.y) / 100) * vh(), rotation: Number(f.dataset.r) }));
  layoutTiles();
  landed = true;
  placeTiles(true);
}

/* ---------- signature, then the hero, then scrolling ---------- */
const heroBits = ['.hero__name .ch', '.hero__me img', '.hero__tag', '.hero__foot > *'];
function heroIn() {
  const o = { p: 0 };
  gsap.set(heroBits, { opacity: 1 });
  gsap.timeline()
    .from('.hero__name .ch', { yPercent: 110, filter: 'blur(12px)', opacity: 0, duration: 1, stagger: 0.04, ease: 'power4.out' })
    .from('.hero__me img', { yPercent: 18, opacity: 0, duration: 1.3, ease: 'power3.out' }, 0.2)
    .to(o, { p: 1, duration: 2.2, ease: 'power2.inOut', onUpdate: () => heroThread.set(o.p) }, 0.3)
    .from('.hero__tag', { scale: 0, rotation: -30, duration: 0.7, ease: 'back.out(2)' }, 0.9)
    .from('.hero__foot > *', { y: 24, opacity: 0, duration: 0.7, stagger: 0.08, ease: 'power3.out' }, 1);
}

if (reduce) {
  still();
} else {
  // the hero waits behind the signature until it is signed
  gsap.set(heroBits, { opacity: 0 });
  heroThread.set(0);
  document.documentElement.classList.add('is-signing');
  lenis?.stop();

  const sig = $('.sig');
  const video = $<HTMLVideoElement>('video', sig);
  let done = false;
  const endIntro = () => {
    if (done) return;
    done = true;
    sig.classList.add('is-done');
    gsap.to(sig, { opacity: 0, duration: 0.8, delay: 0.35, ease: 'power2.inOut', onComplete: () => {
      sig.remove();
      document.documentElement.classList.remove('is-signing');
      lenis?.start();
      ScrollTrigger.refresh();
    } });
    gsap.delayedCall(0.55, heroIn);
  };
  video.addEventListener('ended', endIntro);
  video.play().catch(() => setTimeout(endIntro, 400));
  setTimeout(endIntro, 6000);

  const mm = gsap.matchMedia();
  mm.add({ desk: '(min-width: 768px)', mob: '(max-width: 767px)' }, (c) => build(Boolean(c.conditions!.desk)));
  addEventListener('load', () => ScrollTrigger.refresh());
}
