/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */
/*                                  Utilities                                 */
/* -=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-= */

// Aliases
import * as API from './utils/wa-apis.js';
import * as DOM from './utils/dom-elems.js';
import * as UA from './utils/ua-checkers.js';
import { math } from './utils/math-funcs.js';

// Local binding(s) for export(s)
const {
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
  isEqual,
  isObjEmpty,
  scrollToHashElement,
  selectAll,
  select,
  setCssProp,
  // setTranslate,
  siblings,
  handleAriaExpanded,
  trapFocus
} = DOM; // DOM Elements Manipulation

const {
  checkBrowser,
  checkSystem,
  checkWebpFeature,
  isMobileDevice
} = UA; // User-Agent Checkers

const {
  animationObserver,
  cookiesObj,
  clearCookies,
  inViewport
} = API; // Web APIs

// Exports
export {
  // UA Checkers
  checkBrowser,
  checkSystem,
  checkWebpFeature,
  isMobileDevice,
  // DOM Manipulation
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
  isEqual,
  isObjEmpty,
  scrollToHashElement,
  selectAll,
  select,
  setCssProp,
  siblings,
  // A11Y & WAI-ARIA Practices
  handleAriaExpanded,
  trapFocus,
  // Mathematical Functions
  math,
  // Web APIs
  animationObserver,
  cookiesObj,
  clearCookies,
  inViewport,
}
