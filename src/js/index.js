import {
  // checkBrowser,
  // checkSystem,
  checkWebpFeature,
  isMobileDevice,
} from './utils';

const doc = document, { documentElement: root, body } = doc;

// const os = checkSystem();
// const browser = checkBrowser();

let device = '';
isMobileDevice()
  .then(() => {
    device = 'mobile';
    root.dataset.device = device;
  })
  .catch(() => {
    device = 'desktop';
    root.dataset.device = device;
  });

let imageFormat = '';
checkWebpFeature('lossy')
  .then(() => {
    imageFormat = 'webp';
    root.classList.add(imageFormat);
  })
  .catch(() => {
    imageFormat = 'no-webp';
    root.classList.add(imageFormat);
  });

window.addEventListener('load', () => {
  root.classList.replace('no-js', 'js');
  body.classList.replace('page--loading', 'page--loaded');
  // root.dataset.browser = browser;
  // root.dataset.os = os;
});
