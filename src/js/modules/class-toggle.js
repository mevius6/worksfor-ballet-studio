// import { gsap } from 'gsap';
// import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { findByData } from '../utils';

const section2 = findByData('agenda', 'id');
const elements = [section2];

const options = {
  root: document,
  rootMargin: '0px',
  // threshold: [0, 0.25, 0.5, 0.75, 1],
  threshold: [0.95, 1],
  // trackVisibility: true,
  // delay: 100,
}

// https://w3c.github.io/IntersectionObserver
const observer = new IntersectionObserver(entries => {
  for (const entry of entries) {
    let { isIntersecting, intersectionRatio, target } = entry;
    let force = isIntersecting && (intersectionRatio >= 0.95);

    target.classList.toggle('scroller', force);
  }
}, {...options});

for (const element of elements) { observer.observe(element); }

// gsap.registerPlugin(ScrollTrigger);
// gsap.from(element, {
//   scrollTrigger: {
//     start: 'top top',
//     end: 'bottom center',
//     trigger: element,
//     toggleClass: 'scroller',
//     // markers: true,
//     // id: 'section',
//   }
// });
