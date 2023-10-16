import { select } from './dom-elems';

/* -------------------------------------------------------------------------- */
/*                            Web application APIs                            */
/* -------------------------------------------------------------------------- */

/**
 * [W3C-Spec]: https://w3c.github.io/IntersectionObserver/
 *
 * @param {*} entries target Element
 * @param {*} observer IO w/ default options
 * @instance
 *
 * @example
 * const options = {
 *   root: document.querySelector('[data-io-root]'),
 *   rootMargin: '0px',
 *   threshold: [1.0],
 *   trackVisibility: true,
 *   delay: 100
 * }
 *
 * for (const element of querySelectorAll('.js-anim')) {
 *   animationObserver.observe(element, options);
 * }
 *
 * @see
 * [Intersection Observer Spec][w3c-spec]
 */
// eslint-disable-next-line no-unused-vars
const animationObserver = new IntersectionObserver((entries, observer) => {
  for (const entry of entries) {
    entry.target.classList.toggle('js-anim--running', entry.isIntersecting)
  }
});

/**
 * [REF]: https://caniuse.com/#search=intersectionobserver
 *
 * @param {HTMLElement} elem
 * @param {Function} callback
 * @param {Object.<string, (string|number|boolean|HTMLElement)>} options
 * @returns {IntersectionObserver}
 *
 * @example
 * inViewport('.target', element => {
 *   doc.querySelector('.box').textContent = element.isIntersecting;
 * }, {
 *   root: doc.querySelector('.scroll')
 * });
 *
 * @see
 * [Can I use IntersectionObserver?][ref]
 */
function inViewport(elem, callback, options = {}) {
  return new IntersectionObserver(entries => {
    entries.forEach(entry => callback(entry));
  }, options).observe(select(elem));
}

// https://drafts.csswg.org/cssom-view/#dom-element-scrollintoview
let scrollIntoViewOptions = {
  behavior: 'smooth', // instant or auto
  block: 'start', // center, end, or nearest
  inline: 'nearest',
}

// eslint-disable-next-line no-unused-vars
const scrollTo = (elem, arg = {...scrollIntoViewOptions} ?? {}) => {
  let position = arg.block;
  if (arg.block !== 'start') position = 'end';
  let target = select(elem);
  target.scrollIntoView({ behavior: 'smooth', block: position });
}

/** 🍪 */
let { cookie } = document;

const clearCookies = () => cookie
  .split(';')
  .forEach((c) => (cookie = c
    .replace(/^ +/, '')
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  ));

const cookiesObj = cookie.split(';').map((item) => item
  .split('='))
  .reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});

/* eslint-disable no-unused-vars */

/**
 * [W3C CRD TR Spec]: https://www.w3.org/TR/performance-timeline/
 * [W3C ED Spec]: https://w3c.github.io/performance-timeline/
 * [LCP]: https://github.com/w3c/largest-contentful-paint/#api-shape
 *
 * @description
 * Performance Timeline
 *
 * @example
 * po.observe({type: 'largest-contentful-paint', buffered: true});
 *
 * @see
 * [W3C CRD TR Spec]
 * @see
 * [W3C ED Spec]
 */
const po = new PerformanceObserver(list => {
  const entries = list.getEntries();
  const entry = entries[entries.length - 1];
  // Process entry as the latest LCP candidate
  // LCP is accurate when the renderTime is available.
  // Try to avoid this being false by adding Timing-Allow-Origin headers!
  const accurateLCP = entry.renderTime ? true : false;
  // Use startTime as the LCP timestamp.
  // It will be renderTime if available, or loadTime otherwise.
  const largestPaintTime = entry.startTime;
  // Send the LCP information for processing.
});

/* eslint-enable no-unused-vars */

export {
  animationObserver,
  cookiesObj,
  clearCookies,
  inViewport,
  // scrollTo
}
