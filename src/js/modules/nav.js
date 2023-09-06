import { selectAll } from '../utils';

const parsedUrl = new URL(window.location.href);

const discloseItem = (item, speed, index, vars = {}) => {
  let anim = item.animate(
    {
      transform: ['translateY(20px)', 'translateY(0)'],
      opacity: [0, 1],
    }, {
      delay: speed * (index + 1),
      fill: 'forwards',
      duration: speed * 5,
    }
  );
  // https://drafts.csswg.org/web-animations-1/#dom-animationeffect-updatetiming
  if (vars.reverse) anim.effect.updateTiming({ direction: 'reverse' });
}

export default class DisclosureForNav {
  constructor(el) {
    this.config = {
      isExpanded: false,
    }

    this._initializeDOM(el);
    this._initializeEvents();
    this._handleAriaCurrent();
  }

  _initializeDOM(el) {
    this.DOM = { el: el };
    this.DOM.el.navId = el.getAttribute('aria-controls');
    this.DOM.el.nav = document.getElementById(this.DOM.el.navId);
    this.DOM.el.navItems = selectAll('.nav__item', this.DOM.el.nav);
    this.DOM.el.navLinks = selectAll(
      '.nav__link:not([href="/"], [href*="#"])',
      this.DOM.el.nav
    );
  }

  _initializeEvents() {
    this._onClickEv = (e) => this._onClick(e);

    this.DOM.el.addEventListener('click', this._onClickEv, false);
  }

  _onClick(e) {
    this._handleAriaExpanded(e);
    this._openNav();
    this._discloseItems();
  }

  _openNav() {
    // https://drafts.csswg.org/web-animations/
    const openNav = this.DOM.el.nav.animate(
      [
        { transform: 'translateX(-100%)' },
        { transform: 'translateX(-100%) skewX(-15deg)' },
        { transform: 'translateX(0)' },
      ], {
        fill: 'both',
        duration: 300,
        // ease-out-cubic
        easing: 'cubic-bezier(.215, .61, .355, 1)',
      }
    );
    openNav.playbackRate = 0;
    openNav.pause();

    // https://drafts.csswg.org/web-animations/#speed-control
    let speed = this.config.isExpanded ? -1 : 1;

    // https://drafts.csswg.org/web-animations/#dom-animation-playbackrate
    openNav.updatePlaybackRate(speed);
    openNav.play();
  }

  _discloseItems() {
    let speed = this.config.isExpanded ? 10 : 100;

    this.DOM.el.navItems.forEach((item, i) => {
      if (!this.config.isExpanded) {
        discloseItem(item, speed, i);
      } else {
        discloseItem(item, speed, i, { reverse: true } );
      }
    });
  }

  _handleAriaExpanded(e) {
    this.config.isExpanded = e.currentTarget
      .getAttribute('aria-expanded') === 'true';

    ['aria-expanded', 'aria-pressed'].map((state) => {
      e.currentTarget.setAttribute(state, !this.config.isExpanded);
    });

    this.DOM.el.nav.dataset.open = !this.config.isExpanded;
  }

  _handleAriaCurrent() {
    this.DOM.el.navLinks.forEach((link) => {
      // b/c vercel config is set to cleanUrls
      // parsedUrl → 'https://hochutort.com/menu'
      // parsedUrl.pathname → '/menu'
      // link.pathname → '/menu.html'
      let anchor = link.pathname.slice(0, -5);
      let isCurrent = parsedUrl.pathname.includes(anchor);
      if (isCurrent) link.setAttribute('aria-current', 'page');
      // if (parsedUrl.hash) { return; }
    });
  }
}
