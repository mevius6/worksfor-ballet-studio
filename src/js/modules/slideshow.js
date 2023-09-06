import { gsap } from 'gsap';
import { select, selectAll } from '../utils';

export default class Slideshow {
  constructor(el) {
    this.slideshow = select(el);
    this.container = select('.carousel__container', this.slideshow);
    this.counter = select('.carousel__counter-current', this.slideshow);
    this.slides = selectAll('.carousel__slide', this.slideshow);
    this.slideText = selectAll('.carousel__text', this.slideshow);
    this.slideWidth = select('.carousel__slide', this.slideshow).clientWidth;
    this.nextSlide = select('.next', this.slideshow);
    this.prevSlide = select('.prev', this.slideshow);
    this.currentSlide = 0;

    this._createTimeline();

    this._initializeEvents();
  }

  _initializeEvents() {
    this.nextSlide.addEventListener('click', () => this._slideNext());
    this.prevSlide.addEventListener('click', () => this._slidePrev());

    document.addEventListener('keydown', (e) => {
      // e.preventDefault();
      switch (e.key) {
        case 'ArrowLeft':
          this._slidePrev();
          break;
        case 'ArrowRight':
          this._slideNext();
          break;

        default:
          break;
      }
    });

    this._onResizeEv = () => this._onResize();

    window.addEventListener('resize', this._onResizeEv, false);
  }

  // RWD
  _onResize() {
    this.slideWidth = select('.carousel__slide', this.slideshow)
        .clientWidth;
  }

  _createTimeline() {
    this.Tl = gsap.timeline({
      defaults: {
        duration: 0.8,
        ease: 'power4.inOut',
      },
    });

    return this.Tl;
  }

  _counterTl() {
    let tl = gsap.timeline({ defaults: {duration: 0.3} })
      .to(this.counter, { opacity: 0, y: 5 }, '-=1')
      .set(this.counter, { innerText: this.currentSlide + 1 }, '>')
      .to(this.counter, { opacity: 1, y: 0 }, '-=.5');

    return tl;
  }

  _slidePrev() {
    if (this.currentSlide === 0) {
      return;
    } else {
      this.currentSlide -= 1;
      // slideShowTl
      this.Tl
        .to(this.container, { x: -this.slideWidth * this.currentSlide })
        .to(this.slideText[this.currentSlide], { xPercent: 0 }, '-=1')
        .add(this._counterTl(), '-=1');
    }
  }

  _slideNext() {
    if (this.currentSlide === this.slides.length - 1) {
      return;
    } else {
      this.currentSlide += 1;
      // slideShowTl
      this.Tl
        .to(this.container, { x: -this.slideWidth * this.currentSlide })
        .to(this.slideText[this.currentSlide - 1], { xPercent: -65 }, '-=1')
        .add(this._counterTl(), '-=1');
    }
  }
}

const items = selectAll('.carousel');
items.forEach((item, i) => {
  const selector = `.carousel--${i+1}`;
  // eslint-disable-next-line no-unused-vars
  const slideShow = new Slideshow(selector);
});

// const slideShowTl = gsap.timeline({
//   defaults: {
//     duration: 0.8,
//     ease: 'power4.inOut',
//   },
// });
