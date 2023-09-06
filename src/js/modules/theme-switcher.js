// https://github.com/GoogleChromeLabs/dark-mode-toggle/
// https://inclusive-components.design/a-theme-switcher/
// https://web.dev/building-a-theme-switch-component/
// https://github.com/argyleink/gui-challenges/tree/main/theme-switch

const doc = document;
const store = localStorage;

const NAME = 'theme-switch';
const DARK = 'dark';
const LIGHT = 'light';
const PREFERS_COLOR_SCHEME = 'prefers-color-scheme';
const MQ_DARK = `(${PREFERS_COLOR_SCHEME}:${DARK})`;
const MQ_LIGHT = `(${PREFERS_COLOR_SCHEME}:${LIGHT})`;
const COLOR_SCHEME_CHANGE = 'colorschemechange';
const PERMANENT_COLOR_SCHEME = 'permanentcolorscheme';
const HEX = ['A8857A', 'A8857A']; // DECABD
const ICON_GRADIENT = `%3E%3Cdefs%3E%3ClinearGradient id='Grad' gradientUnits='userSpaceOnUse' x1='0%25' y1='0%25' x2='100%25' y2='0%25' gradientTransform='rotate(45)'%3E%3Cstop offset='0%25' stop-color='%23${HEX[0]}' /%3E%3Cstop offset='100%25' stop-color='%23${HEX[1]}' /%3E%3C/linearGradient%3E%3C/defs%3E`;
// 1F770 🝰 ALCHEMICAL SYMBOL FOR DAY-NIGHT
const PATH_DATA = 'M8.789 20.498c-1.274 0-2.428-.307-3.46-.922a7.389 7.389 0 01-2.44-2.505A6.695 6.695 0 012 13.677c0-1.297.308-2.45.923-3.46a7.006 7.006 0 012.504-2.44 6.51 6.51 0 013.395-.922c.637 0 1.241.077 1.812.23a6.088 6.088 0 011.648.693L20.06 0l1.68 1.68-7.645 7.68c.505.659.89 1.35 1.153 2.076a6.7 6.7 0 01.396 2.306 6.284 6.284 0 01-.956 3.362 7.386 7.386 0 01-2.472 2.472c-1.032.615-2.175.922-3.427.922zm.033-2.372c.79 0 1.516-.21 2.175-.627a4.732 4.732 0 001.615-1.614 4.149 4.149 0 00.626-2.208 4.04 4.04 0 00-.626-2.208 4.379 4.379 0 00-1.615-1.615 4.041 4.041 0 00-2.208-.626c-.813 0-1.56.208-2.241.626a4.732 4.732 0 00-1.615 1.615 4.209 4.209 0 00-.593 2.208c0 .813.209 1.56.626 2.24.417.682.967 1.22 1.648 1.615a4.322 4.322 0 002.208.594zM12.414 32l-1.68-1.68 7.645-7.68a7.284 7.284 0 01-1.154-2.043 6.699 6.699 0 01-.395-2.307c0-1.23.308-2.35.923-3.361a7.287 7.287 0 012.505-2.472 6.508 6.508 0 013.427-.956c1.252 0 2.384.308 3.394.923a7.01 7.01 0 012.472 2.472c.615 1.01.923 2.142.923 3.394a6.745 6.745 0 01-.923 3.46 7.01 7.01 0 01-2.472 2.473c-1.01.615-2.153.922-3.427.922a7.324 7.324 0 01-1.846-.23 6.183 6.183 0 01-1.614-.692L12.414 32zm11.27-9.228c.792 0 1.517-.197 2.176-.593a4.461 4.461 0 001.615-1.582 4.207 4.207 0 00.626-2.24c0-.835-.209-1.593-.626-2.275a4.38 4.38 0 00-1.615-1.614 4.208 4.208 0 00-2.208-.594c-.77 0-1.494.198-2.175.594a4.64 4.64 0 00-1.648 1.614c-.417.66-.626 1.406-.626 2.241 0 .791.198 1.527.593 2.208a4.64 4.64 0 001.615 1.648c.681.396 1.439.593 2.274.593z';
const ICON = `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 32 32'%3E${ICON_GRADIENT}%3Cpath fill='url(%23Grad)' d='${PATH_DATA}'/%3E%3C/svg%3E")`;
const ICON_OUTLINED = ICON, ICON_FILLED = ICON;

// https://developer.mozilla.org/en-US/docs/Web/CSS/::part
// https://github.com/mdn/web-components-examples/blob/master/shadow-part/index.html
// ? https://github.com/MicrosoftEdge/MSEdgeExplainers/blob/main/CSSModules/v1Explainer.md
const template = doc.createElement('template');
template.innerHTML = `
  <style>
    *,::after,::before{box-sizing:border-box}:host{contain:content;display:block}form{margin:0;padding:0;background:transparent;color:inherit}fieldset{border:0;margin:0;padding:0}legend{font:var(--${NAME}-legend-font,inherit);padding:0;margin-block-end:0.5rem}input,label{cursor:pointer}

    input {
      -webkit-appearance: none;
      -moz-appearance: none;
      appearance: none;
      position: absolute;
      pointer-events: none;
      margin: 0;
      border: 0;
      padding: 0;
      width: 1px;
      height: 1px;
      overflow: hidden;
      clip: rect(0 0 0 0);
      clip-path: inset(100%);
      white-space: nowrap;
    }

    input:focus:not(:focus-visible) + label { outline: 0; }

    input:focus-visible + label {
      --${NAME}-border-color: var(--accent);
    }

    label {
      display: inline-block;
      position: relative;
      border-width: 1px;
      border-style: solid;
      border-color: var(--${NAME}-border-color, transparent);
      border-radius: 50%;
      padding: 1ch;
      font-size: var(--${NAME}-font-size, 14px);
      line-height: 1;
      /*
      vertical-align: top;
      transition-delay: 0s;
      transition-duration: 300ms;
      transition-property: border-color, filter;
      transition-timing-function: ease-in-out; */
    }

    /*
    label::after {
      content: '';
      display: inline-block;
      background-size: var(--${NAME}-icon-size, 1rem);
      background-repeat: no-repeat;
      width: var(--${NAME}-icon-size, 1rem);
      height: var(--${NAME}-icon-size, 1rem);
      filter: var(--${NAME}-icon-filter, none);
      vertical-align: middle;
      transition: filter 200ms ease-in-out;
    }

    [part="darkLabel"]::after {
      background-image: var(--${NAME}-${DARK}-icon, ${ICON_OUTLINED});
    }

    [part="lightLabel"]::after {
      background-image: var(--${NAME}-${LIGHT}-icon, ${ICON_FILLED});
    }

    [part="toggleLabel"]::after {
      background-image: var(--${NAME}-icon, ${ICON});
    } */

    @media (hover: hover) {
      label:hover::after { filter: brightness(120%); }
    }

    [part="toggleLabel"] > svg {
      inline-size: 100%;
      block-size: 100%;
      stroke-linecap: round;
    }

    .sun-and-moon > :is(.moon, .sun, .sun-beams) {
      transform-origin: center center;
    }
    .sun-and-moon > :is(.moon, .sun) {
      fill: var(--${NAME}-icon-fill);
    }
    [part="toggleLabel"]:is(:hover, :focus-visible) .sun {
      fill: var(--${NAME}-icon-fill-hover);
    }
    [part="toggleLabel"] .sun-beams {
      stroke: var(--${NAME}-icon-fill);
      stroke-width: 2px;
    }
    [part="toggleLabel"]:is(:hover, :focus-visible) .sun-beams {
      stroke: var(--${NAME}-icon-fill-hover);
    }

    @media (prefers-reduced-motion: no-preference) {
      .sun-and-moon > .sun {
        transition:
          transform
            var(--sun-duration, .5s)
            var(--sun-easing, cubic-bezier(.5, 1.25, .75, 1.25));
        transform: scale(var(--sun-sx, 1));
      }
      .sun-and-moon > .sun-beams {
        opacity: var(--beams-a, 1);
        transform: rotateZ(var(--beams-r, 0));
        transition:
          transform
            var(--beams-duration, .5s)
            cubic-bezier(.5, 1.5, .75, 1.25),
          opacity
            var(--beams-duration, .5s)
            cubic-bezier(.25, 0, .3, 1);
      }
      .sun-and-moon > .moon > circle {
        transform: translateX(var(--moon-tx, 0));
        transition: transform var(--moon-duration, .25s) cubic-bezier(0,0,0,1);
        transition-delay: var(--moon-delay, 0s);

        /* @supports (cx: 1) {
          transform: translateX(0);
          cx: 17;
        } */
      }
    }
  </style>
  <form part="form">
    <fieldset part="fieldset">
      <!--<legend part="legend">Поменять оформление</legend>-->
      <!--<input part="${LIGHT}Radio" id="r1" type="radio" name="mode" value="${LIGHT}">-->
      <!--<label part="${LIGHT}Label" for="r1" title="Светлое оформление"></label>-->
      <!--<input part="${DARK}Radio" id="r2" type="radio" name="mode" value="${DARK}">-->
      <!--<label part="${DARK}Label" for="r2" title="Тёмное оформление"></label>-->

      <input part="toggleCheckbox" id="cb" type="checkbox">
      <label part="toggleLabel" for="cb" title="Поменять оформление">
        <svg class="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
          <mask class="moon" id="moon-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white" />
            <circle cx="24" cy="10" r="6" fill="black" />
          </mask>
          <circle class="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
          <g class="sun-beams" stroke="currentColor">
            <line x1="12" y1="1" x2="12" y2="3" />
            <line x1="12" y1="21" x2="12" y2="23" />
            <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
            <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
            <line x1="1" y1="12" x2="3" y2="12" />
            <line x1="21" y1="12" x2="23" y2="12" />
            <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
            <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
          </g>
        </svg>
      </label>
    </fieldset>
  </form>
`;

export class ThemeSwitch extends HTMLElement {
  constructor() {
    super();

    doc.addEventListener(COLOR_SCHEME_CHANGE, (event) => {
      this.mode = event.detail.colorScheme;
      // this._updateRadios();
      this._updateCheckbox();
    });

    doc.addEventListener(PERMANENT_COLOR_SCHEME, (event) => {
      this.permanent = event.detail.permanent;
    });

    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({mode: 'open'});
    shadowRoot.appendChild(template.content.cloneNode(true));

    // this._lightRadio = shadowRoot.querySelector('[part=lightRadio]');
    // this._lightLabel = shadowRoot.querySelector('[part=lightLabel]');
    // this._darkRadio = shadowRoot.querySelector('[part=darkRadio]');
    // this._darkLabel = shadowRoot.querySelector('[part=darkLabel]');

    this._toggleCheckbox = shadowRoot.querySelector('[part=toggleCheckbox]');
    this._toggleLabel = shadowRoot.querySelector('[part=toggleLabel]');

    const hasNativePrefersColorScheme = matchMedia(MQ_DARK).media !== 'not all';

    if (hasNativePrefersColorScheme) {
      matchMedia(MQ_DARK).addListener(({matches}) => {
        this.mode = matches ? DARK : LIGHT;
        this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
      });
    }

    const rememberedValue = store.getItem(NAME);

    if (rememberedValue && [DARK, LIGHT].includes(rememberedValue)) {
      this.mode = rememberedValue;
      this.permanent = true;
    }
    // Задать цветовую схему в зависимости от системных настроек
    else if (hasNativePrefersColorScheme) {
      this.mode = matchMedia(MQ_LIGHT).matches ? LIGHT : DARK;
    }
    if (!this.mode) {
      this.mode = DARK;
    }
    if (this.permanent && !rememberedValue) {
      store.setItem(NAME, this.mode);
    }

    // this._updateRadios();

    this._updateCheckbox();

    // [this._lightRadio, this._darkRadio].forEach((input) => {
    //   input.addEventListener('change', e => {
    //     if (e.target.checked) {
    //       this.mode = e.target.value;
    //       this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode})
    //     }
    //   }, false);
    // });

    this._toggleCheckbox.addEventListener('change', () => {
      this.mode = this._toggleCheckbox.checked ? LIGHT : DARK;
      this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});

      this.permanent = true;

      if (this.permanent) {
        store.setItem(NAME, this.mode);
      } else {
        store.removeItem(NAME);
      }
    });

    this._dispatchEvent(COLOR_SCHEME_CHANGE, {colorScheme: this.mode});
    this._dispatchEvent(PERMANENT_COLOR_SCHEME, {
      permanent: this.permanent,
    });
  }

  _dispatchEvent(type, value) {
    this.dispatchEvent(new CustomEvent(type, {
      bubbles: true,
      composed: true,
      detail: value,
    }));
  }

  // _updateRadios() {
  //   if (this.mode === LIGHT) {
  //     this._lightRadio.checked = true;
  //   } else {
  //     this._darkRadio.checked = true;
  //   }
  // }

  _updateCheckbox() {
    if (this.mode === DARK) {
      this._toggleLabel.style.setProperty('--moon-duration', '.5s');
      this._toggleLabel.style.setProperty('--moon-delay', '.25s');
      this._toggleLabel.style.setProperty('--beams-duration', '.15s');
      this._toggleLabel.style.setProperty(
        '--sun-easing',
        'cubic-bezier(.25, 0, .3, 1)'
      );
      this._toggleLabel.style.setProperty('--sun-duration', '.25s');
      this._toggleLabel.style.setProperty('--sun-sx', 1.75);
      this._toggleLabel.style.setProperty('--moon-tx', '-7px');
      this._toggleLabel.style.setProperty('--beams-a', 0);
      this._toggleLabel.style.setProperty('--beams-r', '-25deg');

      // this._toggleLabel.style.setProperty(
      //   `--${NAME}-icon`, `${ICON_OUTLINED || ICON}`
      // );
      this._toggleCheckbox.checked = false;
    } else {
      this._toggleLabel.style.setProperty('--moon-duration', '.25s');
      this._toggleLabel.style.setProperty('--moon-delay', '0s');
      this._toggleLabel.style.setProperty('--beams-duration', '.5s');
      this._toggleLabel.style.setProperty(
        '--sun-easing',
        'cubic-bezier(.5, 1.25, .75, 1.25)'
      );
      this._toggleLabel.style.setProperty('--sun-duration', '.5s');
      this._toggleLabel.style.setProperty('--sun-sx', 1);
      this._toggleLabel.style.setProperty('--moon-tx', 0);
      this._toggleLabel.style.setProperty('--beams-a', 1);
      this._toggleLabel.style.setProperty('--beams-r', '0deg');

      // this._toggleLabel.style.setProperty(
      //   `--${NAME}-icon`, `${ICON_FILLED || ICON}`
      // );
      this._toggleCheckbox.checked = true;
    }
  }
}

window.customElements.define(NAME, ThemeSwitch);
