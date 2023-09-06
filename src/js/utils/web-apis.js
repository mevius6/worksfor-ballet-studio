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
  }, options).observe(document.querySelector(elem));
}

const { cookie } = document;

const clearCookies = () => cookie
  .split(';')
  .forEach((c) => (cookie = c
    .replace(/^ +/, '')
    .replace(/=.*/, `=;expires=${new Date().toUTCString()};path=/`)
  ));

const cookiesObj = cookie.split(';').map((item) => item
  .split('='))
  .reduce((acc, [k, v]) => (acc[k.trim().replace('"', '')] = v) && acc, {});

export {
  animationObserver,
  cookiesObj,
  clearCookies,
  inViewport
}
