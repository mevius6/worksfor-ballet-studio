import { scrollend } from './scrollyfills.modern.js';
import { selectAll } from '../utils.js';

/**
 * Ideas:
 * → https://codepen.io/collection/njGkGN
 *
 * Pagination examples:
 * → https://codepen.io/michellebarker/pen/eYKgrox
 * → https://codepen.io/hexagoncircle/pen/ZEERvoG
 * → https://codepen.io/smashingmag/pen/QYdMqO
 * → https://www.a11ymatters.com/pattern/pagination/
 */

// Refs
// Repo -> https://github.com/argyleink/gui-challenges/blob/main/carousel/
// Demo -> https://gui-challenges.web.app/carousel/dist/
export default class Carousel {
  constructor(element) {
    this.elements = {
      root: element,
      scroller: element.querySelector('.carousel__container'),
      snaps: element.querySelectorAll('.carousel__slide'),
      previous: element.querySelector('[class*=prev]') || null,
      next: element.querySelector('[class*=next]') || null,
      pagination: element.querySelector('.carousel__pagination') || null,
      // counter: element.querySelector('[class*=curr]') || null,
    }

    this.current = undefined        // set in #initializeState
    this.hasIntersected = new Set() // intersection results used on scrollend

    this.elements.root.setAttribute('tabindex', -1)
    this.elements.root.setAttribute('aria-roledescription', 'carousel')

    this.elements.scroller.setAttribute('role', 'group')
    this.elements.scroller.setAttribute('aria-label', 'Items Scroller')
    this.elements.scroller.setAttribute('aria-live', 'Polite')

    this.#createObservers()
    this.#initializeState()
    this.#listen()
    this.#synchronize()
  }

  #synchronize() {
    for (let observation of this.hasIntersected) {
      // toggle inert when it's not intersecting
      observation.target
        .toggleAttribute('inert', !observation.isIntersecting)

      // toggle aria-selected on pagination dots
      const dot = this.elements.pagination
        .children[this.#getElementIndex(observation.target)]

      dot.setAttribute('aria-selected', observation.isIntersecting)
      dot.setAttribute('tabindex', !observation.isIntersecting ? '-1' : '0')

      // stash the intersecting snap element
      if (observation.isIntersecting) {
        this.current = observation.target
        this.goToElement({
          scrollport: this.elements.pagination,
          element: dot,
        })
      }
    }

    this.#updateControls()
    this.hasIntersected.clear()
  }

  goNext() {
    const next = this.current.nextElementSibling

    if (this.current === next) return;

    if (next) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: next,
      })
      this.current = next
    }
    else {
      console.log('at the end')
    }
  }

  goPrevious() {
    const previous = this.current.previousElementSibling

    if (this.current === previous) return;

    if (previous) {
      this.goToElement({
        scrollport: this.elements.scroller,
        element: previous,
      })
      this.current = previous
    }
    else {
      console.log('at the beginning')
    }
  }

  goToElement({ scrollport, element }) {
    const dir = this.#documentDirection()

    const delta = Math.abs(scrollport.offsetLeft - element.offsetLeft)
    const scrollerPadding = parseInt(getComputedStyle(scrollport)['padding-left'])

    const pos = scrollport.clientWidth / 2 > delta
      ? delta - scrollerPadding
      : delta + scrollerPadding

    scrollport.scrollTo(dir === 'ltr' ? pos : pos * -1, 0)
  }

  #updateControls() {
    const {
      lastElementChild: last,
      firstElementChild: first
    } = this.elements.scroller

    const isAtEnd = this.current === last
    const isAtStart = this.current === first

    // before we possibly disable a button
    // shift the focus to the complimentary button
    if (document.activeElement === this.elements.next && isAtEnd)
      this.elements.previous.focus()
    else if (document.activeElement === this.elements.previous && isAtStart)
      this.elements.next.focus()

    this.elements.next.toggleAttribute('disabled', isAtEnd)
    this.elements.previous.toggleAttribute('disabled', isAtStart)
  }

  #listen() {
    // observe children intersection
    for (let item of this.elements.snaps)
      this.carousel_observer.observe(item)

    // ? https://css-tricks.com/an-approach-to-lazy-loading-custom-elements/
    // watch document for removal of this carousel node
    this.mutation_observer.observe(document, {
      childList: true,
      subtree: true,
    })

    // scrollend listener for sync
    this.elements.scroller.addEventListener('scrollend', this.#synchronize.bind(this))
    this.elements.next.addEventListener('click', this.goNext.bind(this))
    this.elements.previous.addEventListener('click', this.goPrevious.bind(this))
    this.elements.pagination.addEventListener('click', this.#handlePaginate.bind(this))
  }

  #unlisten() {
    for (let item of this.elements.snaps)
      this.carousel_observer.unobserve(item)

    this.mutation_observer.disconnect()

    this.elements.scroller.removeEventListener('scrollend', this.#synchronize)
    this.elements.next.removeEventListener('click', this.goNext)
    this.elements.previous.removeEventListener('click', this.goPrevious)
    this.elements.pagination.removeEventListener('click', this.#handlePaginate)
    // this.elements.root.removeEventListener('keydown', this.#handleKeydown)
  }

  #createObservers() {
    this.carousel_observer = new IntersectionObserver(observations => {
      for (let observation of observations) {
        this.hasIntersected.add(observation)

        // toggle --in-view class if intersecting or not
        observation.target.classList
          .toggle('--in-view', observation.isIntersecting)
      }
    }, {
      root: this.elements.scroller,
      threshold: .6,
    })

    this.mutation_observer = new MutationObserver((mutationList, observer) => {
      mutationList
        .filter(x => x.removedNodes.length > 0)
        .forEach(mutation => {
          [...mutation.removedNodes]
            .filter(x => x.querySelector('.carousel') === this.elements.root)
            .forEach(removedEl => {
              this.#unlisten()
            })
        })
    })
  }

  #initializeState() {
    const startIndex = this.elements.root.hasAttribute('carousel-start')
      ? this.elements.root.getAttribute('carousel-start') - 1
      : 0

    this.current = this.elements.snaps[startIndex]
    this.#handleScrollStart()

    // each snap target needs a marker for pagination
    // each snap needs some a11y love
    this.elements.snaps.forEach((snapChild, index) => {
      this.hasIntersected.add({
        isIntersecting: index === 0,
        target: snapChild,
      })

      // snapChild.setAttribute(
      //   'aria-label',
      //   `${index + 1} of ${this.elements.snaps.length}`
      // )
      // snapChild.setAttribute('aria-roledescription', 'item')
    })
  }

  #handleScrollStart() {
    if (this.elements.root.hasAttribute('carousel-start')) {
      const itemIndex = this.elements.root.getAttribute('carousel-start')
      const startElement = this.elements.snaps[itemIndex - 1]

      this.elements.snaps.forEach(snap =>
        snap.style.scrollSnapAlign = 'unset')

      startElement.style.scrollSnapAlign = null
      startElement.style.animation = 'carousel-scrollstart 1ms'

      startElement.addEventListener('animationend', e => {
        startElement.style.animation = null
        this.elements.snaps.forEach(snap =>
          snap.style.scrollSnapAlign = null)
      }, { once: true })
    }
  }

  #handlePaginate(e) {
    if (e.target.classList.contains('carousel__pagination'))
      return

    e.target.setAttribute('aria-selected', true)
    const item = this.elements.snaps[this.#getElementIndex(e.target)]

    this.goToElement({
      scrollport: this.elements.scroller,
      element: item,
    })
  }

  #getElementIndex(element) {
    let index = 0
    // eslint-disable-next-line no-cond-assign
    while (element = element.previousElementSibling)
      index++
    return index
  }

  #documentDirection() {
    return document.firstElementChild.getAttribute('dir') || 'ltr'
  }
}

selectAll('.carousel').forEach(element => {
  new Carousel(element)
})
