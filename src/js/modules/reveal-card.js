import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

export const revealCard = (cards) => {
  const selector = `.${cards[0].className.split(' ')[0]}`;

  gsap.set(selector, { y: 100, opacity: 0 });

  // https://greensock.com/docs/v3/Plugins/ScrollTrigger/static.batch()
  ScrollTrigger.batch(selector, {
    interval: 0.1,
    batchMax: 3,
    start: 'top +=50%',
    onEnter: (batch) =>
      gsap.to(batch, {
        opacity: 1,
        y: 0,
        stagger: { each: 0.15, grid: [1, 3] },
        overwrite: true,
      }),
    // onLeave: (batch) =>
    //   gsap.set(batch, { opacity: 0, y: -100, overwrite: true }),
    // onEnterBack: (batch) =>
    //   gsap.to(batch, { opacity: 1, y: 0, stagger: 0.15, overwrite: true }),
    // onLeaveBack: (batch) =>
    //   gsap.set(batch, { opacity: 0, y: 100, overwrite: true }),
    once: true,
    defaults: { ease: 'power3' }
  });

  ScrollTrigger.addEventListener('refreshInit', () =>
    gsap.set(selector, { y: 0 })
  );
};
