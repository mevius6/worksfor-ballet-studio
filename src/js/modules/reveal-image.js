import { selectAll } from '../utils';

const lazyImages = selectAll('[loading=lazy]');

// https://css-tricks.com/an-approach-to-lazy-loading-custom-elements/

lazyImages.forEach(async img => {
  let picture = img.parentNode;
  let wrapper = picture.parentNode;
  // wrapper.style.overflow = 'hidden';

  // https://caniuse.com/loading-lazy-attr
  if ('loading' in HTMLImageElement.prototype) {
    // TODO: LQIP
    // wrapper.style.backgroundImage = `url('${base64}')`;
    img.onload = () => {
      wrapper.animate({ opacity: [0, 1] }, {
        fill: 'forwards',
        duration: 700,
        easing: 'ease-out',
      });
    }
  } else {
    img.onload = async () => await revealImage(picture, img);
  }
});

async function revealImage(wrapper, image) {
  const { gsap } = await import('gsap');

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
