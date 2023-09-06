// import gsap from 'gsap';
// import throttle from 'lodash.throttle';
import { getMouseRelativePos, select, selectAll, setCssProp } from '../utils';

/*
const elem = select('...');

const onMouseMove = (e) => {
  let x = getMouseRelativePos(e, {math: 'pc'}).x;
  let y = getMouseRelativePos(e, {math: 'pc'}).y;

  gsap.to(elem, {
    '--x': `${x}%`,
    '--y': `${y}%`,
    duration: 0.3,
    ease: 'sine.out',
  });
}

const tl = gsap.timeline({ paused: true });
tl
  .to(elem, {
    '--x': '50%',
    '--y': '50%',
  })
  .to(elem, {
    // ...
    duration: 0.5,
    ease: 'back.out(2)',
  })
  .to(elem, {
    // ...
    duration: 0.5,
    delay: 0.25,
    ease: 'back.out(2)',
  }, '<');

elem.addEventListener('mouseenter', () => { tl.play(); }, { once: true });
elem.addEventListener('mousemove', throttle(onMouseMove, 30)); */

if (window.matchMedia && window.matchMedia("(pointer:coarse)").matches) {
  // if the pointer is coarse, listen to touch events
  // target.addEventListener("touchstart", ...);
  // ...
} else {
  // otherwise, listen to mouse and keyboard events

  // move the background gradient by mouse coords
  // ? '[data-js-anim=bg-gradient]:not([disabled])'
  selectAll('[data-js-anim=bg-gradient]').forEach(elem => {
    elem.addEventListener('mousemove', (e) => {
      let x = getMouseRelativePos(e, {math: 'px'}).x;
      let y = getMouseRelativePos(e, {math: 'px'}).y;

      // set and update CSS variables (not work in Chrome)
      setCssProp('--x', `${x}px`, elem);
      setCssProp('--y', `${y}px`, elem);
    });
  });
}
