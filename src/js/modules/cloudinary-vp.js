// TODO: import {Cloudinary} from "@cloudinary/url-gen";
import { appendNode, createNode } from '../utils';

const doc = document;
const NAME = 'video-player';
// const MIN_VW = '36em'; // 576px
// const PORTRAIT = 'portrait';
// const LANDSCAPE = 'landscape';
// const MQ_WIDTH = `(min-width: ${MIN_VW})`;
// const MQ_PORTRAIT = `(orientation:${PORTRAIT})`;
// const MQ_LANDSCAPE = `(orientation:${LANDSCAPE})`;

// const { CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET } = process.env;

/**
 * **Cloudinary Docs**
 * @see
 * [Video API](https://cloudinary.com/solutions/video-api)
 * @see
 * [Video optimization](https://cloudinary.com/documentation/video_optimization)
 * @see
 * [Video manipulation and delivery](https://cloudinary.com/documentation/video_manipulation_and_delivery)
 * @see
 * [Glossary: Transformation](https://cloudinary.com/documentation/cloudinary_glossary#transformation)
 * @see
 * [Transformation reference](https://cloudinary.com/documentation/transformation_reference)
 * @see
 * [Transformation demo](https://demo.cloudinary.com/video/)
 * @see
 * [Predefined streaming profiles](https://cloudinary.com/documentation/adaptive_bitrate_streaming#predefined_streaming_profiles)
 * @see
 * [Postman collections](https://cloudinary.com/documentation/using_cloudinary_postman_collections)
 * @see
 * [Cloudinary Programmable Media API Collections](https://www.postman.com/cloudinaryteam/workspace/programmable-media/overview)
 * @see
 * [SDK Config Params](https://cloudinary.com/documentation/cloudinary_sdks#configuration_parameters)
 */

const API_HOST = 'https://res.cloudinary.com';
const CLOUD_NAME = 'worksfor';
const ASSET_TYPE = 'video';
const VERSION = 'v1692292158';
const FOLDER_NAME = 'ballet-studio/';
const PUBLIC_ID = 'footage-10s-prod';
const FULL_PATH = FOLDER_NAME + PUBLIC_ID;

// https://github.com/vercel/next.js/blob/canary/examples/with-cloudinary/utils/cloudinary.ts
// https://github.com/vercel/next.js/blob/canary/examples/with-cloudinary/utils/cachedImages.ts

/**
 * - [JavaScript SDK video transformations](https://cloudinary.com/documentation/javascript_video_transformations)
 * [JavaScript SDK examples](https://github.com/cloudinary-devs/cld-js-sdk-docs-examples)
 *
 * *—or—*
 *
 * - [Node.js video transformations](https://cloudinary.com/documentation/node_video_manipulation)
 */
let sdkOverview;
// const cloudinary = require('cloudinary');
// const cl = new cloudinary.Cloudinary({
//   cloud_name: CLOUD_NAME, secure: true
// });
// cloudinary.config({
//   cloud_name: CLOUD_NAME,
//   api_key: CLOUDINARY_API_KEY,
//   api_secret: CLOUDINARY_API_SECRET,
//   secure: true,
// });


/**
 * **Further Reading**
 *
 * - [HTML5 Video Player](https://cloudinary.com/blog/html5_video_player)
 * - [On the fly compression during delivery](https://cloudinary.com/blog/how_to_automate_compression_of_video_files_with_one_line_of_code#on_the_fly_compression_during_delivery)
 * - [Optimizing video with cloudinary and the HTML5 video player](https://cloudinary.com/blog/optimizing_video_with_cloudinary_and_the_html5_video_player_part_1)
 * - [Define video transformations][doc-vp-transforms]
 *
 * * * *
 *
 * [doc-vp-transforms]: https://cloudinary.com/documentation/video_player_customization#define_video_transformations
 *
 * **Demos & Docs**
 *
 * @see
 * [Video Player](https://cloudinary.com/documentation/cloudinary_video_player)
 * @see
 * [Video Player API](https://cloudinary.com/documentation/video_player_api_reference)
 * @see
 * [Video Player Code](https://github.com/Cloudinary/cloudinary-video-player)
 * @see
 * [Video Player Examples](https://cloudinary.github.io/cloudinary-video-player/)
 * @see
 * [Video Player Studio](https://studio.cloudinary.com/)
 * @see
 * [VideoJS Player](https://docs.videojs.com/player.html)
 */
let playerOverview;
// const player = cld.videoPlayer('player', {
//   "fluid": true,
//   "controls": true,
//   "muted": true,
//   "autoplay": true,
//   "loop": true
// });

// player.source("page-hero", {});

/**
 * **URL API Reference**
 * ```html
 * https://res.cloudinary.com/<cloud_name>/<asset_type>/<delivery_type>/<transformations>/<version>/<public_id_full_path>.<extension>
 * ```
 * [js-url-gen]: https://cloudinary.com/documentation/javascript_video_transformations
 * [syntax]: https://cloudinary.com/documentation/javascript_image_transformations#syntax_overview
 *
 * **Refs**
 * @see
 * [JS video transforms]{@link [syntax]}
 * @see
 * [Syntax overview]{@link [syntax]}
 */
const createUrl = (
  cloudName = CLOUD_NAME,
  assetType = ASSET_TYPE,
  deliveryType = 'upload',
  transformations = {},
  version = VERSION,
  publicId = '',
  fullPath = '',
  extension = 'mp4'
) => {
  let urlStruct = `${API_HOST}/`
    + `${cloudName}/`
    + `${assetType}/`
    + `${deliveryType}/`
    + `${transformations}/`
    + `${version}/`
    + `${publicId || fullPath}.` + extension;

  return urlStruct;
}

// Create and configure Cloudinary instance.
// const cld = new Cloudinary({
//   cloud: {
//     cloudName: CLOUD_NAME
//   }
// });

// Use the video with public ID…
// const vd = cld.video(PUBLIC_ID);

// Apply the transformation.
// vd.resize(scale().width(0.2));

// Get the URL of the video.
// const url = vd.toURL();

const VIDEO_SRC_ORIGINAL = `${API_HOST}/${CLOUD_NAME}/video/upload/${VERSION}/${FULL_PATH}.mp4`;

// https://cloudinary.com/documentation/transformation_reference
// https://cloudinary.com/documentation/media_optimizer_transformations
// https://cloudinary.com/documentation/video_optimization
// f_webm/q_auto:best <-- t_optim
const VIDEO_SRC_WEBM_TRANSFORM = `${API_HOST}/${CLOUD_NAME}/video/upload/s--ke_TprHx--/t_optim/${VERSION}/${FULL_PATH}.webm`;

const VIDEO_STAG = '<video autoplay muted loop playsinline crossorigin>';
const VIDEO_ETAG = '</video>';
const VIDEO_TEMPLATE =`
${VIDEO_STAG}
  <source src="${VIDEO_SRC_WEBM_TRANSFORM}" type="video/webm">
  <source src="${VIDEO_SRC_ORIGINAL}" type="video/mp4">
${VIDEO_ETAG}
`;

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    all: initial;
    position: relative;
    display: inline-block;
    inline-size: var(--${NAME}-width, 1080px);
    block-size: var(--${NAME}-height, 1920px);
    box-sizing: border-box;
  }
  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
${VIDEO_TEMPLATE}
`;

export default class VideoPlayer extends HTMLElement {
  constructor() {
    super(),
    this._initializeDOM();
  }

  _initializeDOM() {
    const shadowRoot = this.attachShadow({ mode: 'open' });
    shadowRoot.appendChild(template.content.cloneNode(true));

    const nativeEl = this.nativeEl = this.shadowRoot.querySelector('video');
    if (nativeEl.defaultMuted) nativeEl.muted = true;

    this.shadowRoot.appendChild(nativeEl);
  }

  connectedCallback() {
    this.videoName = encodeURIComponent(this.getAttribute('basename'));

    // VideoPlayer.addResourceHintLinks();

    // this._loadVideo({ basename: this.videoName })
    // .then(() => setPageVisibility(this.nativeEl));
    // .then(() => this.classList.add(`${NAME}--loaded`));
  }

  static addPrefetch(kind, url, as, cors) {
    const linkEl = createNode('link');
    linkEl.rel = kind;
    linkEl.href = url;
    if (as) linkEl.as = as;
    if (cors) linkEl.crossOrigin = cors;

    appendNode(doc.head, linkEl);
  }

  /* static addResourceHintLinks() {
    if (this.preconnected) return;

    const hosts = [
      DATOCMS_API_HOST,
      MUX_IMAGES_HOST,
      MUX_STREAM_HOST,
    ];
    hosts.forEach(host => this.addPrefetch('preconnect', host));

    this.preconnected = true;
  } */

  // https://www.postman.com/cloudinaryteam/workspace/programmable-media/request/16080251-ef4deab7-91b2-4f0c-8008-9cd46b4f32dc
  /* static async fetchAPI(query) {
    const res = await fetch(DATOCMS_API_HOST, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Authorization': `Bearer ${DATOCMS_API_TOKEN}`,
      },
      body: JSON.stringify({ query }),
      // mode: 'cors',
    });

    const json = await res.json();
    if (json.errors) {
      throw new Error('Не удалось получить API');
      // console.error(json.errors);
    }

    return json.data;
  } */

  /* static async runAsyncFetch(params={}) {
    const vars = {...params};
    const video = await this.getVideoBy(vars);

    return video;
  } */

  /* async _loadVideo(params={}) {
    VideoPlayer.runAsyncFetch(params).then((v) => {
      v.map(async (el) => {
        const {
          mimeType,
          width,
          height,
          url,
          video: {…}
        } = el;

        this._updAspectRatio(width, height);
        this._setPosterImage(…);
        this._addSource(mimeType, …);
      });
    }).catch(error => error.message);
  } */

  async _updAspectRatio(width, height) {
    this.nativeEl.width = width;
    this.nativeEl.height = height;
  }

  async _addSource(mimeType, url) {
    // Allow only MP4 format
    // if (mimeType === 'video/webm') return;

    const source = createNode('source');
    // source.src = url;
    source.type = mimeType;

    appendNode(this.nativeEl, source);

    // matchMedia(MQ_WIDTH).addListener(handleDeviceWidth);
    // Initial check
    // handleDeviceWidth(matchMedia(MQ_WIDTH));

    // function handleDeviceWidth(e) {
    //   source.src = e.matches ? mp4HighResUrl : mp4MediumResUrl;
    // }
  }

  _handleDeviceOrientation(e) {
    // ('landscape' | 'portrait' | 'square');
    this.orientation = e.matches ? 'landscape' : 'square';
  }
}

// const { matchMedia } = window;

customElements.define(NAME, VideoPlayer);
