// eslint-disable-next-line no-unused-vars
import { scrollend } from 'scrollyfills';
import { selectAll, select } from '../utils.js';

/**
 * [ARIA]: https://www.w3.org/WAI/ARIA/apg/patterns/carousel/
 * [argyleink]: https://github.com/argyleink
 * [repo]: https://github.com/argyleink/gui-challenges/
 * [path]: https://github.com/argyleink/gui-challenges/blob/main/carousel/
 * [code]: https://github.com/argyleink/gui-challenges/blob/main/carousel/carousel.js
 * [demo]: https://gui-challenges.web.app/carousel/dist/
 *
 * @default
 * @class Carousel
 *
 * @see {@link [APG Carousel Pattern][ARIA]}
 * @see {@link [GUI Challenges][repo]}
 * @see {@linkcode [Carousel][code]} _by_ {@link [Adam Argyle][argyleink]}
 */
export default class Carousel {
  constructor(element) {
    // state and selectors
    this.elements = {
      root: element,
      scroller: select('.carousel__container', element),
      snaps: selectAll('.carousel__slide', element),
      prev: select('[class*=prev]', element) || null, // i.e. previous
      next: select('[class*=next]', element) || null,
      pagination: select('.carousel__pagination', element) || null,
      // counter: select('[class*=curr]', element) || null,
    };

    this.current = undefined; // set in #initializeState
    this.hasIntersected = new Set(); // intersection results used on scrollend

    this.#createObservers();
    this.#initializeState();
    this.#listen();
    this.#synchronize();
  }

  #createObservers() {
    this.carousel_observer = new IntersectionObserver(
      (observations) => {
        for (let observation of observations) {
          this.hasIntersected.add(observation);

          // toggle --in-view class if intersecting or not
          observation.target.classList.toggle(
            '--in-view',
            observation.isIntersecting
          );
        }
      },
      {
        root: this.elements.scroller,
        threshold: 0.6,
      }
    );
  }

  #initializeState() {
    const startIndex = 0;

    this.current = this.elements.snaps[startIndex];

    this.elements.snaps.forEach((snap, index) => {
      this.hasIntersected.add({
        isIntersecting: index === 0,
        target: snap,
      });
    });
  }

  #listen() {
    // observe children intersection
    for (let item of this.elements.snaps) {
      this.carousel_observer.observe(item);
    }

    // scrollend listener for sync
    // https://github.com/argyleink/scrollyfills
    this.elements.scroller.addEventListener(
      'scrollend',
      this.#synchronize.bind(this)
    );
    this.elements.next.addEventListener('click', this.goNext.bind(this));
    this.elements.prev.addEventListener('click', this.goPrevious.bind(this));
    this.elements.pagination.addEventListener(
      'click',
      this.#handlePaginate.bind(this)
    );
    this.elements.root.addEventListener(
      'keydown',
      this.#handleKeydown.bind(this)
    );
  }

  #synchronize() {
    for (let observation of this.hasIntersected) {
      // toggle inert when it's not intersecting
      // https://html.spec.whatwg.org/#the-inert-attribute
      observation.target.toggleAttribute('inert', !observation.isIntersecting);

      // toggle aria-selected on pagination dots
      const dot =
        this.elements.pagination.children[
          this.#getElementIndex(observation.target)
        ];

      dot.setAttribute('aria-selected', observation.isIntersecting);
      dot.setAttribute('tabindex', !observation.isIntersecting ? '-1' : '0');

      // stash the intersecting snap element
      if (observation.isIntersecting) {
        this.current = observation.target;
        this.goToElement({
          scrollport: this.elements.pagination,
          element: dot,
        });
      }
    }

    this.#updateControls();
    this.hasIntersected.clear();
  }

  #updateControls() {
    const { lastElementChild: last, firstElementChild: first } =
      this.elements.scroller;

    const isAtEnd = this.current === last;
    const isAtStart = this.current === first;

    // before we possibly disable a button
    // shift the focus to the complimentary button
    if (document.activeElement === this.elements.next && isAtEnd)
      this.elements.prev.focus();
    else if (document.activeElement === this.elements.prev && isAtStart)
      this.elements.next.focus();

    this.elements.next.toggleAttribute('disabled', isAtEnd);
    this.elements.prev.toggleAttribute('disabled', isAtStart);
  }

  goNext() {
    const next = this.current.nextElementSibling;

    if (this.current === next) return;

    if (next) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: next,
      });
      this.current = next;
    } else {
      console.log('at the end');
    }
  }

  goPrevious() {
    const previous = this.current.previousElementSibling;

    if (this.current === previous) return;

    if (previous) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: previous,
      });
      this.current = previous;
    } else {
      console.log('at the beginning');
    }
  }

  goToElement({ scrollport, element }) {
    const dir = this.#documentDirection();

    const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft);
    const scrollerPadding = parseInt(
      getComputedStyle(scrollport)['padding-left']
    );

    const pos =
      scrollport.clientWidth / 2 > delta
        ? delta - scrollerPadding
        : delta + scrollerPadding;

    // https://drafts.csswg.org/cssom-view/#dom-element-scrollleft
    let scrollLeft = dir === 'ltr' ? pos : pos * -1;

    scrollport.scrollTo(scrollLeft, 0);
  }

  #handlePaginate(e) {
    if (e.target.classList.contains('gui-carousel--pagination')) return;

    e.target.setAttribute('aria-selected', true);
    const item = this.elements.snaps[this.#getElementIndex(e.target)];

    this.goToElement({
      scrollport: this.elements.scroller,
      element: item,
    });
  }

  #handleKeydown(e) {
    const dir = this.#documentDirection();
    const idx = this.#getElementIndex(e.target);

    switch (e.key) {
      case 'ArrowRight':
        e.preventDefault();

        const next_offset = dir === 'ltr' ? 1 : -1;
        const next_control = dir === 'ltr'
          ? this.elements.next
          : this.elements.prev;

        if (e.target.closest('.gui-carousel--pagination'))
          this.elements.pagination.children[idx + next_offset]?.focus();
        else {
          // if (document.activeElement === next_control)
          //   this.#keypressAnimation(next_control);
          next_control.focus();
        }

        dir === 'ltr' ? this.goNext() : this.goPrevious();
        break;
      case 'ArrowLeft':
        e.preventDefault();

        const previous_offset = dir === 'ltr' ? -1 : 1;
        const previous_control = dir === 'ltr'
          ? this.elements.prev
          : this.elements.next;

        if (e.target.closest('.gui-carousel--pagination'))
          this.elements.pagination.children[idx + previous_offset]?.focus();
        else {
          // if (document.activeElement === previous_control)
          //   this.#keypressAnimation(previous_control);
          previous_control.focus();
        }

        dir === 'ltr' ? this.goPrevious() : this.goNext();
        break;
    }
  }

  #getElementIndex(node) {
    let index = 0;
    while ((node = node.previousElementSibling)) index++;
    return index;
  }

  #documentDirection() {
    return document.firstElementChild.getAttribute('dir') || 'ltr';
  }
}

selectAll('.carousel').forEach((node) => {
  new Carousel(node);
});
