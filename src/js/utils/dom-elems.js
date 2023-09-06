// const { innerWidth: ww, innerHeight: wh } = window;
const { innerWidth, innerHeight } = window;
const { documentElement: root, body } = document;

const calcWinSize = () => {
  return { ww: innerWidth, wh: innerHeight };
};

const getMousePos = (e) => {
  const { pageX, pageY, clientX, clientY } = e;

  let posx = 0;
  let posy = 0;

  if (!e) e = window.event;
  if (pageX || pageY) {
    posx = pageX;
    posy = pageY;
  } else if (clientX || clientY) {
    posx = clientX + body.scrollLeft + root.scrollLeft;
    posy = clientY + body.scrollTop + root.scrollTop;
  }

  return { x: posx, y: posy };
};

const getMouseRelativePos = (e, vars = {}) => {
  let posx = 0;
  let posy = 0;

  // calc mouse coordinates in relation to element x/y axes
  let offsetX = getCoords(e.target).x;
  let offsetY = getCoords(e.target).y;

  if (vars.math === 'px') {
    posx = Math.round(getMousePos(e).x - offsetX);
    posy = Math.round(getMousePos(e).y - offsetY);

    if (vars.setProps) {
      setCssProp('--x', `${posx}px`, e.target);
      setCssProp('--y', `${posy}px`, e.target);
    }
  }
  if (vars.math === 'pc') {
    posx = Math.round(
      ((getMousePos(e).x - offsetX) / innerWidth) * 100
    );
    posy = Math.round(
      ((getMousePos(e).y - offsetY) / innerHeight) * 100
    );

    if (vars.setProps) {
      setCssProp('--x', `${posx}%`, e.target);
      setCssProp('--y', `${posy}%`, e.target);
    }
  }

  return { x: posx, y: posy };
}

// https://youmightnotneedjquery.com/#position_relative_to_viewport

const getRelPos = (domEl) => domEl.getBoundingClientRect();

const getCoords = (domEl) => {
  let box = getRelPos(domEl),
      coords = {
        x: box.left + scrollX,
        y: box.top + scrollY,
      };

  return coords;
}

const getWidth = (elem) =>
  parseFloat(getComputedStyle(elem, null).width.replace('px', ''));

const getHeight = (elem) =>
  parseFloat(getComputedStyle(elem, null).height.replace('px', ''));

const select = (expr, con = null) => (con || document).querySelector(expr);

const selectAll = (expr, con) => {
  return Array.prototype.slice.call((con || document).querySelectorAll(expr));
};

const findByData = (expr, con) => selectAll(`[data-${con}]`).find(
  (elem) => elem.dataset[con] === expr
);

const createNode = (expr) => document.createElement(expr);

const appendNode = (expr, con) => expr.appendChild(con);

const createNodeWithClass = (expr, con) => {
  const elem = createNode(expr);
  // elem.classList.add(con);
  elem.className += con;
  return elem;
};

const setCssProp = (prop, val, elem) => {
  elem.style.setProperty(prop, val);

  // domEl.style[prop] = value;
}

function setTranslate(xPos, yPos, el) {
  el.style.transform = `translate3d(${xPos}px, ${yPos}px, 0)`;
}

const siblings = (elem) => selectAll(elem.parentNode.children).filter(
  (child) => child !== elem
);

const isEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);

// const isEqual = (a, b) => a.length === b.length &&
//   a.every((v, i) => v === b[i]);

const toObject = (arr, key) => arr.reduce((a, b) => (
  { ...a, [b[key]]: b }), {}
);

// const toObject = (arr, key) => Object.fromEntries(
//   arr.map((it) => [it[key], it])
// );

const isObject = (obj) => {
  return Object.prototype.toString.call(obj) === '[object Object]';
};

const objectEntries = (obj) => Object.entries(obj);
// const objectKeys = (obj) => Object.keys(obj);

const isArrEmpty = (arr) => !Array.isArray(arr) || arr.length === 0;
const isObjEmpty = (obj) => !isObject(obj) || objectEntries(obj).length === 0;

const isEmpty = (expr) => {
  if (Array.isArray(expr)) return isArrEmpty(expr);
  if (isObject(expr)) return isObjEmpty(expr);

  // if (Array.isArray(expr)) return expr.length === 0;
  // if (isObject(expr)) return objectEntries(expr).length === 0;
}

/**
 * [1]: https://developers.google.com/web/fundamentals/primers/async-functions#async_return_values
 * [2]: https://davidwalsh.name/javascript-promise-tricks
 *
 * @async
 * @function delay
 * @param {number} ms время в миллисекундах
 * @usage `await delay(200);`
 *
 * @see [Article]{@link [1]} _by_ Jake Archibald
 * @see [Article]{@link [2]} _by_ David Walsh
 */
const delay = (ms) => new Promise(r => setTimeout(r, ms));

/**
 *
 * @param {*} url источник данных
 * @param {Object} options объект с параметрами запроса
 * @param {Object} query структура запроса
 * @returns декодированный ответ в формате JSON
 */
const asyncFetchJSON = async (url, options = {}, query = {}) => {
  const response = await fetch(url, options, query);
  const json = await response.json();

  if (!response.ok || json.errors) {
    // console.error(json.errors);
    const message = `Произошла ошибка: ${response.status}`;
    throw new Error(message);
  }

  return json;
};

/** @returns {HTMLElement|undefined} */
const getHashElement = () =>
  window.location.hash
    ? document.querySelector(window.location.hash) ?? undefined
    : undefined;

/** @param {number} offset */
const scrollToHashElement = offset => {
  const elementToScroll = getHashElement();
  return elementToScroll
    ? window.scrollTo({
      top: elementToScroll.offsetTop - offset,
      behavior: "smooth"
    })
    : undefined;
};

/** Utilities to handle paths and URLs */
export const url = {
  encode: (str = '') => encodeURIComponent(str),
  decode: (str = '') => encodeURIComponent(str),
  escape: (str = '') => CSS.escape(str),
  isRelative: (path) => !/^([a-z]+:)?[\\/]/i.test(path),
}

/**
 * Check if the current value is the `end-of-queue`.
 *
 * @param {number} current Value to be checked.
 * @param {number} maximum Value that will be the condition of.
 * @returns {Promise.<number>} Promise object represents the checked value.
 */
const isEndOfQueue = (current, maximum) => {
  let con = (current >= maximum - 1);

  return new Promise((resolve, reject) => {
    (con)
      ? resolve(current)
      : reject(current);

    // if (current >= maximum - 1) resolve(current);
    // else reject(current);
  });
};

/* ------------------------ A11Y • WAI-ARIA Practices ----------------------- */
// https://www.scottohara.me//blog/2022/09/12/details-summary.html
function handleAriaExpanded(target) {
  // let target = evt.target || evt.currentTarget;
  let isExpanded = target.getAttribute('aria-expanded') === 'true';

  ['aria-expanded', 'aria-pressed'].map((state) => {
    target.setAttribute(state, !isExpanded);
    target.setAttribute('aria-label', !isExpanded ? 'Show' : 'Hide');
  });
}

// https://www.smashingmagazine.com/2017/09/building-inclusive-toggle-buttons
// const toggle = document.querySelector('[aria-pressed]');
// toggle.addEventListener('click', (e) => {
//   let pressed = e.target.getAttribute('aria-pressed') === 'true';
//   e.target.setAttribute('aria-pressed', String(!pressed));
// });

export {
  appendNode,
  asyncFetchJSON,
  calcWinSize,
  createNodeWithClass,
  createNode,
  delay,
  findByData,
  getCoords,
  getHashElement,
  getHeight,
  getMousePos,
  getMouseRelativePos,
  getWidth,
  isArrEmpty,
  isEmpty,
  isEndOfQueue,
  isEqual,
  isObjEmpty,
  scrollToHashElement,
  selectAll,
  select,
  setCssProp,
  setTranslate,
  siblings,
  toObject,
  // A11Y
  handleAriaExpanded
}
