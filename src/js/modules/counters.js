import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { selectAll } from '../utils';

gsap.registerPlugin(ScrollTrigger);

// https://css-tricks.com/animating-number-counters/
function animateValue(obj, start, end, duration) {
  let startTimestamp = null;
  const step = (timestamp) => {
    if (!startTimestamp) startTimestamp = timestamp;
    const progress = Math.min((timestamp - startTimestamp) / duration, 1);
    obj.innerText = Math.floor(progress * (end - start) + start);
    if (progress < 1) {
      window.requestAnimationFrame(step);
    }
  };
  window.requestAnimationFrame(step);
}

const counters = selectAll('.counter');

// eslint-disable-next-line no-unused-vars
const st = ScrollTrigger.create({
  trigger: '.counters',
  start: 'top, bottom',
  once: true,
  onEnter: () => {
    counters.forEach(counter => {
      let value = counter.dataset.count;
      animateValue(counter, 0, value, 1000);
    });
  }
});
