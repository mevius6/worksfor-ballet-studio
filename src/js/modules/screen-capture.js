import { select } from '../utils.js';

/**
 * Class for screen capture.
 * <!-- Snapshot 📸 -->
 *
 * ## References
 *
 * [API-Screenshot]: https://eladalon1983.github.io/mediacapture-screenshot/
 * 'Screenshot API Specification'
 *
 * [API-SreenShare]: https://w3c.github.io/mediacapture-screen-share/
 * 'Screen Capture API Specification'
 *
 * [API-CapFromDOM]: https://w3c.github.io/mediacapture-fromelement/
 * 'Media Capture from DOM Elements Specification'
 *
 * [API-WebRTC]: https://developer.mozilla.org/en-US/docs/Web/API/WebRTC_API
 * 'WebRTC API Specification'
 *
 * [MDN-ScreenCapture]: https://developer.mozilla.org/en-US/docs/Web/API/Screen_Capture_API/Using_Screen_Capture
 * 'Using the Screen Capture API — Web Apis | MDN'
 *
 * [MDN]: https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getDisplayMedia
 * 'MediaDevices.getDisplayMedia() — Web Apis | MDN'
 *
 * [example_ru]: https://developer.mozilla.org/ru/docs/Web/API/Media_Streams_API/Taking_still_photos
 *
 * [example_repo]: https://github.com/mdn/samples-server/blob/master/s/webrtc-capturestill/capture.js
 *
 * [html-spec-ref1]: https://html.spec.whatwg.org/multipage/canvas.html#dom-imagedata
 * [html-spec-ref2]: https://html.spec.whatwg.org/multipage/canvas.html#pixel-manipulation
 *
 * [Sketcher]: https://github.com/liamegan/Sketcher
 * [DFN]: https://github.com/liamegan/Sketcher/blob/main/src/index.ts#L160
 *
 * @see
 * [Screenshot API Spec][api-screenshot]
 * @see
 * [Screen Capture API Spec][api-sreenshare]
 * @see
 * [Media Capture from DOM Elements API Spec][api-capfromdom]
 * @see
 * [WebRTC API Spec][api-webrtc]
 * @see
 * [MediaDevices.getDisplayMedia\(\)][mdn]
 * @see
 * SVG download method [defined][dfn] in the [Sketcher] code by Liam Egan
 *
 * ## Usage
 *
 * @example
 * // Initialize the imported class
 * const takeScreenshot = () => new ScreenCapture('canvas');
 *
 * // Create the download button
 * const dl = document.createElement('button');
 *
 * dl.textContent = 'download';
 * dl.addEventListener('click', (ev) => {
 *   takeScreenshot;
 *   ev.preventDefault();
 * }, false);
 *
 * document.body.appendChild(dl);
 */
export default class ScreenCapture {
  constructor(el, vars = {}) {
    // Initialize DOM
    // this.DOM.el = select(el);
    this.node = select(el);

    // this.frame = this.node.toDataURL("image/png");
    // window.location.href = this.frame;

    // Get the stream
    // this.stream = this.node.captureStream(25); // 25 FPS
    // this.stream.requestFrame();

    // Do things to the stream
    // E.g. Send it to another computer using an RTCPeerConnection
    //      pc is an RTCPeerConnection created elsewhere
    // this.stream.getTracks().forEach(track => pc.addTrack(track, stream));

    // Initialize Events
    this._takeScreenshot(2048, 2048);
  }

  // Ref -> https://github.com/rndme/download/blob/master/download.js
  dataUrlToBlob(strUrl) {
    var parts= strUrl.split(/[:;,]/),
        type= parts[1],
        decoder= parts[2] == "base64" ? atob : decodeURIComponent,
        binData= decoder( parts.pop() ),
        mx= binData.length,
        i= 0,
        uiArr= new Uint8Array(mx);

    for(i;i<mx;++i) uiArr[i]= binData.charCodeAt(i);

    return new myBlob([uiArr], {type: type});
  }

  _toBlob(dataURI) {
    // ? https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/createImageData
    const binStr = window.atob(dataURI.split(',')[1]),
        { length: amount } = binStr;
    const arr = new Uint8Array(amount);
    for (let i = 0; i < len; i++) {
      arr[i] = binStr.charCodeAt(i);
    }
    return new window.Blob([arr]);
  }

  _saveDataURI(name, dataURI) {
    const blob = this._toBlob(dataURI);

    // force download
    const link = document.createElement('a');
    link.download = name;
    link.href = window.URL.createObjectURL(blob);
    link.onclick = () => {
      window.setTimeout(() => {
        window.URL.revokeObjectURL(blob);
        link.removeAttribute('href');
      }, 500);
    };
    link.click();
  }

  _defaultFileName(ext = 'png') {
    const str = `${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}${ext}`;
    return str.replace(/\//g, '-').replace(/:/g, '.');
  }

  _takeScreenshot(width, height) {
    // ThreeJS settings
    // set camera and renderer to desired screenshot dimension
    // camera.aspect = width / height;
    // camera.updateProjectionMatrix();
    // renderer.setSize(width, height);
    // renderer.render(scene, camera, null, false);
    // const DataURI = renderer.domElement.toDataURL('image/png');

    if (width && height) {
      // this.node.width = width;
      // this.node.height = height;
    }

    const DataURI = this.node.toDataURL('image/png');

    // save
    this._saveDataURI(this._defaultFileName('.png'), DataURI);

    // reset to old dimensions by invoking the on window resize function
    // onResize();
  }
}

// new Promise(function(resolve, reject) {
//   setTimeout(function() { resolve(10); }, 3000);
// })
// .then(() => { takeScreenshot(2048, 2048) });
