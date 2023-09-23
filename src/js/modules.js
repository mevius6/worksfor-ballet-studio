/**
 * @fileoverview This file contains the configuration for dynamically
 * loading modules.
 *
 * * * *
 *
 * [spec]: https://tc39.es/proposal-dynamic-import/
 * [repo]: https://github.com/tc39/proposal-dynamic-import
 *
 * @see `import()` [Specification][spec] and [Repository][repo]
 */

const parsedUrl = new URL(window.location.href);
const doc = document, { documentElement: root } = doc;

/* eslint-disable no-unused-vars */

(async () => {
  const toggle = await import('./modules/theme-switcher.js').then(() => {
    const themeSwitch = doc.querySelector('theme-switch');
    root.setAttribute('data-theme-style', themeSwitch.mode === 'dark'
      ? 'dark'
      : 'light'
    );
    themeSwitch.addEventListener('colorschemechange', () => {
      root.dataset.themeStyle = themeSwitch.mode;
    });
  });

  if (
    parsedUrl.pathname === '/' ||
    parsedUrl.pathname === '/index.html'
  ) {
    const player = await import('./modules/cloudinary-vp');
    const reveal = await import('./modules/reveal-effect');
    const lazyimg = await import('./modules/reveal-image');
    const carousel = await import('./modules/carousel');
    const disclosure = await import('./modules/disclosure');
    const cursor = await import('./modules/cursor');
    loadMap();
  }
  if (
    parsedUrl.pathname === '/gallery' ||
    parsedUrl.pathname === '/gallery.html'
  ) {
    const reveal = await import('./modules/reveal-effect');
  }
  if (
    parsedUrl.pathname === '/agenda' ||
    parsedUrl.pathname === '/agenda.html'
  ) {
    const reveal = await import('./modules/reveal-effect');
    const cursor = await import('./modules/cursor');
    loadMap();
  }

  loadNav();
})();

async function loadNav() {
  const { default: DisclosureForNav } = await import('./modules/nav');

  // eslint-disable-next-line no-unused-vars
  const disclosure = new DisclosureForNav(doc.querySelector('.nav-button'));
}

async function loadMap() {
  // eslint-disable-next-line no-undef
  const elem = map;
  const loadTrigger = createObserver(elem);

  loadTrigger.then(async () => await import('./modules/map'));
}

async function createObserver(el, ops={}) {
  let isIntersecting;

  if (Object.entries(ops).length === 0) {
    ops.root = el.parentNode;
    ops.rootMargin = '0px';
    ops.threshold = 0;
  }

  const observer = new IntersectionObserver((entries, observer) => {
    for (const entry of entries) {
      // console.log(entries);
      ({ isIntersecting } = entry);
      if (isIntersecting) observer.unobserve(entry.target);
    }
  });
  observer.observe(el, ops);

  return isIntersecting;
}

/* eslint-enable no-unused-vars */
