import { gsap } from 'gsap';
import { selectAll } from '../utils';

const lazyImages = selectAll('[loading=lazy]');

lazyImages.forEach(async img => {
  let picture = img.parentNode;
  let wrapper = picture.parentNode;
  // wrapper.style.overflow = 'hidden';

  // https://caniuse.com/loading-lazy-attr
  if ('loading' in HTMLImageElement.prototype) {
    img.onload = () => revealImage(picture, img);
  } else {
    // ? LQIP
    // wrapper.style.backgroundImage = `url('${base64}')`;
    img.onload = () => {
      wrapper.animate({ opacity: [0, 1] }, {
        fill: 'forwards',
        duration: 700,
        easing: 'ease-out',
      });
    }
  }
});

function revealImage(wrapper, image) {
  let tl = gsap.timeline({ defaults: {ease: 'power2.out'} });
  tl
    .from(wrapper, {
      xPercent: -100,
      autoAlpha: 0,
    })
    .from(image, {
      xPercent: 100,
      scale: 1.3,
    }, '<');

  return tl;
}
