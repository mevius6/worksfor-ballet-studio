import { select } from '../utils';

// direction enums
const TB = 2, BT = 1;

// show/hide on-scroll
(async () => {
  const root = document.documentElement;

  let prevScroll = window.scrollY || root.scrollTop;
  let currScroll;
  let direction = 0;
  let prevDirection = 0;

  const header = select('.page__header'),
      { classList } = header;

  const checkScroll = () => {
    currScroll = window.scrollY || root.scrollTop;

    if (currScroll > prevScroll) direction = TB;
    else if (currScroll < prevScroll) direction = BT;

    if (direction !== prevDirection) {
      toggleHeader(direction, currScroll);
    }

    prevScroll = currScroll;
  };

  // Is used if the header changes position when the page is scrolled
  // (e.g. absolute -> fixed)
  // https://css-tricks.com/styling-based-on-scroll-position/
  // or the main content has an top margin equal to the height of the header
  // let headerHeight = 60;
  const toggleHeader = (direction, currScroll) => {
    // if (direction === TB && currScroll > headerHeight) {
    if (direction === TB) {
      // classList.add('page__header--hidden');
      classList.toggle('page__header--hidden');
      prevDirection = direction;
    } else if (direction === BT) {
      // classList.remove('page__header--hidden');
      classList.toggle('page__header--hidden', false);
      prevDirection = direction;
    }
  };

  window.addEventListener('scroll', checkScroll, false);
})();
