import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);
export { gsap, ScrollTrigger };

export const $ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => r.querySelector(s) as T;
export const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = document) => [...r.querySelectorAll(s)] as T[];
export const rand = (a: number, b: number) => a + Math.random() * (b - a);

// ?still turns motion off, for reduced-motion users and for checking layouts
export const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches || location.search.includes('still');

/* ---------- smooth scroll ---------- */
export let lenis: Lenis | null = null;
if (!reduce) {
  lenis = new Lenis({ duration: 1.1 });
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((t) => lenis!.raf(t * 1000));
  gsap.ticker.lagSmoothing(0);
}
$$<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]').forEach((a) => a.addEventListener('click', (e) => {
  const id = a.getAttribute('href')!.replace(/^\//, '');
  const el = id === '#top' ? document.body : document.querySelector(id);
  if (!el) return;
  e.preventDefault();
  if (lenis) lenis.scrollTo(id === '#top' ? 0 : (el as HTMLElement), { duration: 1.6 });
  else el.scrollIntoView({ behavior: 'smooth' });
}));

/* ---------- nav hides while scrolling down ---------- */
const nav = $('.nav');
let lastY = 0;
const onScroll = (y: number) => {
  nav.classList.toggle('is-hidden', y > lastY && y > 300);
  lastY = y;
};
if (lenis) lenis.on('scroll', ({ scroll }: { scroll: number }) => onScroll(scroll));
else addEventListener('scroll', () => onScroll(scrollY), { passive: true });

/* ---------- videos play only while visible ---------- */
// Phones only autoplay a video that is muted, inline and allowed to autoplay,
// so set all of that in code; if a phone still blocks it (iOS Low Power Mode),
// the first touch or scroll starts every visible video.
const visible = new Set<HTMLVideoElement>();
const prep = (v: HTMLVideoElement) => {
  v.muted = true;
  v.defaultMuted = true;
  v.playsInline = true;
  v.autoplay = true;
  v.setAttribute('muted', '');
  v.setAttribute('playsinline', '');
  v.setAttribute('webkit-playsinline', '');
};
const tryPlay = (v: HTMLVideoElement) => {
  prep(v);
  if (!v.getAttribute('src') && v.dataset.src) { v.src = v.dataset.src; v.load(); }
  const p = v.play();
  if (p) p.catch(() => {});
};
const io = new IntersectionObserver((entries) => entries.forEach((en) => {
  const v = en.target as HTMLVideoElement;
  if (en.isIntersecting) { visible.add(v); tryPlay(v); } else { visible.delete(v); v.pause(); }
}), { rootMargin: '300px 300px' });
$$<HTMLVideoElement>('video[data-src]').forEach((v) => { prep(v); io.observe(v); });
const unlock = () => visible.forEach((v) => { if (v.paused) tryPlay(v); });
['touchstart', 'pointerdown', 'scroll'].forEach((ev) => addEventListener(ev, unlock, { passive: true }));

/* ---------- lightbox ---------- */
const lb = $('.lightbox');
export function openLightbox(src: string, kind: 'img' | 'video') {
  if (!lb) return;
  const img = $<HTMLImageElement>('img', lb), vid = $<HTMLVideoElement>('video', lb);
  img.hidden = kind !== 'img';
  vid.hidden = kind !== 'video';
  if (kind === 'img') img.src = src;
  else { vid.src = src; vid.play().catch(() => {}); }
  lb.classList.add('is-open');
  lenis?.stop();
}
const closeLb = () => {
  if (!lb) return;
  lb.classList.remove('is-open');
  $<HTMLVideoElement>('video', lb).pause();
  lenis?.start();
};
if (lb) {
  $('.lightbox__close', lb).addEventListener('click', closeLb);
  lb.addEventListener('click', (e) => { if (e.target === lb) closeLb(); });
  addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLb(); });
}

/* ---------- the red thread ---------- */
type Pt = [number, number];
// Catmull-Rom through the points, written out as cubic Béziers
export function smoothPath(P: Pt[]) {
  let d = `M${P[0][0].toFixed(1)},${P[0][1].toFixed(1)}`;
  for (let i = 0; i < P.length - 1; i++) {
    const p0 = P[i - 1] || P[i], p1 = P[i], p2 = P[i + 1], p3 = P[i + 2] || p2;
    const c1: Pt = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2: Pt = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)},${c1[1].toFixed(1)} ${c2[0].toFixed(1)},${c2[1].toFixed(1)} ${p2[0].toFixed(1)},${p2[1].toFixed(1)}`;
  }
  return d;
}

// Waypoints are [x%, y%] of the section, or ['selector', ax, ay] anchored to an element
// (ax/ay are fractions of that element's box). Elements marked [data-thread-front] get the
// thread drawn on top of them; everywhere else it runs behind the content.
type Way = [number, number] | [string, number, number];
function threadPoints(sec: HTMLElement, raw: Way[], w: number, h: number): Pt[] {
  const box = sec.getBoundingClientRect();
  return raw.map((p) => {
    if (typeof p[0] === 'string') {
      const el = sec.querySelector(p[0]);
      if (el) {
        const r = el.getBoundingClientRect();
        return [r.left - box.left + r.width * (p[1] as number), r.top - box.top + r.height * (p[2] as number)] as Pt;
      }
      return [w * 0.3, h * 0.5] as Pt;
    }
    return [((p[0] as number) / 100) * w, ((p[1] as number) / 100) * h] as Pt;
  });
}

const SVGNS = 'http://www.w3.org/2000/svg';
export type Thread = { set: (p: number) => void; track: (lineY: number) => void; build: () => void };
let clipId = 0;
export function makeThread(svg: SVGSVGElement): Thread {
  const sec = svg.parentElement!;
  const back = document.createElementNS(SVGNS, 'path');
  svg.append(back);
  // front copy, clipped to the marked elements, plus the moving tip
  const front = document.createElementNS(SVGNS, 'svg');
  front.setAttribute('class', 'thread thread--front');
  front.setAttribute('aria-hidden', 'true');
  const defs = document.createElementNS(SVGNS, 'defs');
  const clip = document.createElementNS(SVGNS, 'clipPath');
  const id = `tclip${clipId++}`;
  clip.setAttribute('id', id);
  defs.append(clip);
  const fpath = document.createElementNS(SVGNS, 'path');
  fpath.setAttribute('clip-path', `url(#${id})`);
  const tip = document.createElementNS(SVGNS, 'circle');
  tip.setAttribute('r', '6');
  front.append(defs, fpath, tip);
  sec.append(front);

  let len = 0, progress = 0;
  let samples: { l: number; y: number }[] = [];
  const t: Thread = {
    build() {
      const w = sec.clientWidth, h = sec.clientHeight;
      for (const s of [svg, front]) s.setAttribute('viewBox', `0 0 ${w} ${h}`);
      const d = smoothPath(threadPoints(sec, JSON.parse(svg.dataset.points!), w, h));
      back.setAttribute('d', d);
      fpath.setAttribute('d', d);
      len = back.getTotalLength();
      for (const p of [back, fpath]) p.style.strokeDasharray = `${len}`;
      // lookup: how far along the path the line has reached each depth
      samples = [];
      let maxY = -Infinity;
      for (let i = 0; i <= 400; i++) {
        const l = (len * i) / 400;
        maxY = Math.max(maxY, back.getPointAtLength(l).y);
        samples.push({ l, y: maxY });
      }
      const box = sec.getBoundingClientRect();
      clip.replaceChildren(...[...sec.querySelectorAll('[data-thread-front]')].map((el) => {
        const r = el.getBoundingClientRect();
        const rect = document.createElementNS(SVGNS, 'rect');
        rect.setAttribute('x', `${r.left - box.left}`);
        rect.setAttribute('y', `${r.top - box.top}`);
        rect.setAttribute('width', `${r.width}`);
        rect.setAttribute('height', `${r.height}`);
        return rect;
      }));
      t.set(progress);
    },
    set(p: number) {
      progress = p;
      const off = `${len * (1 - p)}`;
      back.style.strokeDashoffset = off;
      fpath.style.strokeDashoffset = off;
      const pt = back.getPointAtLength(len * p);
      tip.setAttribute('cx', `${pt.x}`);
      tip.setAttribute('cy', `${pt.y}`);
      tip.style.opacity = p > 0.002 && p < 0.998 ? '1' : '0';
    },
    // draw the thread down to a line in the viewport, so the tip leads the eye
    track(lineY: number) {
      if (!len) return;
      const target = lineY - sec.getBoundingClientRect().top;
      if (target <= 0) return t.set(0);
      const hit = samples.find((s) => s.y >= target);
      t.set(hit ? hit.l / len : 1);
    },
  };
  t.build();
  ScrollTrigger.addEventListener('refresh', t.build);
  return t;
}
