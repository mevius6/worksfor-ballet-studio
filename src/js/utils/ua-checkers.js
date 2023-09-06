const UA = navigator.userAgent;

// ? https://github.com/faisalman/ua-parser-js

/**
 * [src]: https://github.com/ykob/tplh.net-2019/blob/master/src/utils/checkWebpFeature.js
 *
 * @param {string} feature Enums: `lossy`, `lossless`, `alpha`, `animation`
 * @example
 * checkWebpFeature('alpha').then(() => {...}).catch(() => {...});
 *
 * @see [checkWebpFeature.js][src]
 */
const checkWebpFeature = (feature) => {
  return new Promise((resolve, reject) => {
    let testImages = {
      lossy: 'UklGRiIAAABXRUJQVlA4IBYAAAAwAQCdASoBAAEADsD+JaQAA3AAAAAA',
      lossless: 'UklGRhoAAABXRUJQVlA4TA0AAAAvAAAAEAcQERGIiP4HAA==',
      alpha:
        'UklGRkoAAABXRUJQVlA4WAoAAAAQAAAAAAAAAAAAQUxQSAwAAAARBxAR/Q9ERP8DAABWUDggGAAAABQBAJ0BKgEAAQAAAP4AAA3AAP7mtQAAAA==',
      animation:
        'UklGRlIAAABXRUJQVlA4WAoAAAASAAAAAAAAAAAAQU5JTQYAAAD/////AABBTk1GJgAAAAAAAAAAAAAAAAAAAGQAAABWUDhMDQAAAC8AAAAQBxAREYiI/gcA',
    };
    let img = new Image();
    img.onload = () => {
      if (img.width > 0 && img.height > 0) {
        resolve(feature);
      } else {
        reject(feature);
      }
    };
    img.onerror = () => {
      reject(feature);
    };
    img.src = 'data:image/webp;base64,' + testImages[feature];
  });
};

const isMobileDevice = () => {
  let hasTouchScreen = false;
  if ('maxTouchPoints' in navigator) {
    hasTouchScreen = navigator.maxTouchPoints > 0;
  } else if ('msMaxTouchPoints' in navigator) {
    hasTouchScreen = navigator.msMaxTouchPoints > 0;
  } else {
    let mql = window.matchMedia && matchMedia('(pointer:coarse)');
    if (mql && mql.media === '(pointer:coarse)') {
      hasTouchScreen = !!mql.matches;
    } else if ('orientation' in window) {
      hasTouchScreen = true;
    } else {
      hasTouchScreen = (
        /\b(BlackBerry|webOS|iPhone|IEMobile)\b/i.test(UA) ||
        /\b(Android|Windows Phone|iPad|iPod)\b/i.test(UA)
      );
    }
  }

  return new Promise((resolve, reject) => {
    hasTouchScreen ? resolve() : reject();
  });
}

function checkBrowser() {
  let UA = navigator.userAgent;
  let browser;

  // es5: UA.indexOf('...') > -1;
  let chromeAgent = UA.includes('Chrome');
  let IExplorerAgent = UA.includes('MSIE') || UA.includes('rv:');
  let firefoxAgent = UA.includes('Firefox');
  let safariAgent = UA.includes('Safari');
  if (chromeAgent && safariAgent) safariAgent = false;
  let operaAgent = UA.includes('OP');
  if (chromeAgent && operaAgent) chromeAgent = false;

  if (safariAgent) browser = 'Safari';
  if (chromeAgent) browser = 'Chrome';
  if (IExplorerAgent) browser = 'IE';
  if (operaAgent) browser = 'Opera';
  if (firefoxAgent) browser = 'Firefox';

  return browser;
}

function checkSystem() {
  let AV = navigator.appVersion;
  let os;

  // es5: AV.indexOf('...') != -1)
  if (AV.includes('Win')) os = 'Windows';
  if (AV.includes('Mac')) os = 'macOS';
  if (AV.includes('X11')) os = 'UNIX';
  if (AV.includes('Linux')) os = 'Linux';

  return os;
}

export {
  checkBrowser,
  checkSystem,
  checkWebpFeature,
  isMobileDevice
}
