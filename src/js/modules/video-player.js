import { appendNode, createNode } from '../utils';
// import { setPageVisibility } from '../modules/page-visibility';

/**
 * REFS
 * https://cloudinary.com/documentation/cloudinary_video_player
 * https://cloudinary.com/documentation/video_optimization
 * https://imagekit.io/blog/video-streaming-api/
 * https://docs.mux.com/guides/video/stream-video-files
 * https://docs.mux.com/guides/video/mux-player
 * https://github.com/paulirish/lite-youtube-embed
 * https://github.com/muxinc/custom-video-element
 * https://github.com/filamentgroup/html-video-responsive
 * https://developer.mozilla.org/en-US/docs/Web/Media/Autoplay_guide
 * https://developer.mozilla.org/en-US/docs/Web/API/Media_Source_Extensions_API
 * https://web.dev/lazy-loading-video/
 * https://web.dev/fast-playback-with-preload/
 * https://web.dev/patterns/media/
 * https://codepen.io/smashingmag/pen/ZEmRXPy
 */

const doc = document;
const NAME = 'video-player';
const MIN_VW = '36em'; // 576px
const PORTRAIT = 'portrait';
const LANDSCAPE = 'landscape';
const MQ_WIDTH = `(min-width: ${MIN_VW})`;
const MQ_PORTRAIT = `(orientation:${PORTRAIT})`;
const MQ_LANDSCAPE = `(orientation:${LANDSCAPE})`;

const { DATOCMS_API_TOKEN, DATOCMS_API_HOST } = process.env;
const MUX_IMAGES_HOST = 'https://image.mux.com';
const MUX_STREAM_HOST = 'https://stream.mux.com';

const muxVideo = `
  video {
    streamingUrl
    mp4High: mp4Url(res: high)
    mp4Med: mp4Url(res: medium)
    mp4Low: mp4Url(res: low)
    duration
    framerate
    thumbJpg: thumbnailUrl(format: jpg)
    thumbPng: thumbnailUrl(format: png)
    thumbGif: thumbnailUrl(format: gif)
    muxAssetId
    muxPlaybackId
  }
`;

/* query MyQuery {
  allUploads(filter: {type: {eq: video}}) {
    id
    video {
      ...UploadVideoFieldFragment
    }
    mimeType
    width
    height
  }
}

fragment UploadVideoFieldFragment on UploadVideoField {
  duration
  framerate
  mp4Url(res: high)
  muxAssetId
  muxPlaybackId
  streamingUrl
  thumbnailUrl(format: jpg)
}*/

const uploadVideoField = `
  video {
    duration
    framerate
    mp4Url(res: high)
    muxAssetId
    muxPlaybackId
    streamingUrl
    thumbnailUrl(format: jpg)
  }
`;

const template = document.createElement('template');
template.innerHTML = `
<style>
  :host {
    all: initial;
    position: relative;
    display: inline-block;
    inline-size: var(--${NAME}-width, 300px);
    block-size: var(--${NAME}-height, 150px);
    box-sizing: border-box;
  }
  video {
    position: absolute;
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
</style>
<video autoplay muted loop playsinline crossorigin></video>
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
    this.orientationFilter = (this.getAttribute('filter') === 'orient');

    VideoPlayer.addResourceHintLinks();

    if (this.orientationFilter) {
      // matchMedia(MQ_LANDSCAPE).addListener(this._handleDeviceOrientation);
      // this._handleDeviceOrientation(matchMedia(MQ_LANDSCAPE));

      matchMedia(MQ_WIDTH).addListener(this._handleDeviceOrientation);
      // Initial check
      this._handleDeviceOrientation(matchMedia(MQ_WIDTH));

      this._loadVideo({
        basename: this.videoName,
        orient: this.orientation,
      });
    } else {
      this._loadVideo({ basename: this.videoName })
      // .then(() => setPageVisibility(this.nativeEl));
      // .then(() => this.classList.add(`${NAME}--loaded`));
    }
  }

  static addPrefetch(kind, url, as, cors) {
    const linkEl = createNode('link');
    linkEl.rel = kind;
    linkEl.href = url;
    if (as) linkEl.as = as;
    if (cors) linkEl.crossOrigin = cors;

    appendNode(doc.head, linkEl);
  }

  static addResourceHintLinks() {
    if (this.preconnected) return;

    const hosts = [
      DATOCMS_API_HOST,
      MUX_IMAGES_HOST,
      MUX_STREAM_HOST,
    ];
    hosts.forEach(host => this.addPrefetch('preconnect', host));

    this.preconnected = true;
  }

  static async fetchAPI(query) {
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
  }

  static async getVideoByFilter(vars={}) {
    const isNameMatches = vars.basename
      ? `basename: {matches: {pattern: "${vars.basename}"}}`
      : '';
    const isOrientation = vars.orient
      ? `orientation: {eq: ${vars.orient}}`
      : '';

    let filter;

    if (isNameMatches) filter = `${isNameMatches}`;
    if (isOrientation) filter += `, ${isOrientation}`;

    const data = await this.fetchAPI(`
    {
      allUploads(filter: {
        type: {eq: video},
        ${filter}
      }) {
        mimeType
        width
        height
        url
        ${muxVideo}
      }
    }
    `);
    // {
    //   allUploads(filter: {…}) {
    //     {…}
    //     ${uploadVideoField}
    //   }
    // }

    return data?.allUploads;
  }

  static async runAsyncFetch(params={}) {
    const vars = {...params};
    const video = await this.getVideoByFilter(vars);

    return video;
  }

  async _loadVideo(params={}) {
    VideoPlayer.runAsyncFetch(params).then((v) => {
      v.map(async (el) => {
        const {
          mimeType,
          width,
          height,
          // url,
          video: {
            // streamingUrl,
            mp4High,
            mp4Med,
            mp4Low,
            thumbJpg,
            thumbPng,
            thumbGif,
            // muxAssetId,
            muxPlaybackId
          }
        } = el;

        this._updAspectRatio(width, height);
        this._setPosterImage(thumbJpg, thumbPng, thumbGif, muxPlaybackId);
        this._addSource(mimeType, mp4High, mp4Med, mp4Low, muxPlaybackId);
      });
    }).catch(error => error.message);
  }

  async _setPosterImage(
    thumbJpg,
    thumbPng,
    thumbGif,
    muxPlaybackId
  ) {
    const params = new URLSearchParams(this.getAttribute('getimg') || []);
    // params.append('time', '1');
    const muxThumbnailQuery = `${MUX_IMAGES_HOST}/${muxPlaybackId}/thumbnail.jpg?${params.toString()}`;

    VideoPlayer.addPrefetch('preload', muxThumbnailQuery, 'image', 'anonymous');

    this.nativeEl.poster = muxThumbnailQuery;
    // this.nativeEl.style.backgroundImage = `url("${muxThumbnailQuery}")`;
  }

  async _updAspectRatio(width, height) {
    this.nativeEl.width = width;
    this.nativeEl.height = height;
  }

  async _getMuxUrls(muxPlaybackId) {
    const muxUrls = {
      hires: MUX_STREAM_HOST + muxPlaybackId + '/high.mp4',
      meres: MUX_STREAM_HOST + muxPlaybackId + '/medium.mp4',
      lores: MUX_STREAM_HOST + muxPlaybackId + '/low.mp4',
    };

    return muxUrls;
  }

  async _addSource(
    mimeType,
    mp4HighResUrl,
    mp4MediumResUrl,
    mp4LowResUrl,
    muxPlaybackId
  ) {
    // Allow only MP4 format
    if (mimeType === 'video/webm') return;

    const source = createNode('source');
    // source.src = (await this._getMuxUrls(muxPlaybackId)).lores;
    source.type = mimeType;

    appendNode(this.nativeEl, source);

    // https://codepen.io/rema/pen/xxVqarV
    matchMedia(MQ_WIDTH).addListener(handleDeviceWidth);
    // Initial check
    handleDeviceWidth(matchMedia(MQ_WIDTH));

    function handleDeviceWidth(e) {
      source.src = e.matches ? mp4HighResUrl : mp4MediumResUrl;
    }
  }

  _handleDeviceOrientation(e) {
    // ('landscape' | 'portrait' | 'square');
    this.orientation = e.matches ? 'landscape' : 'square';
  }
}

const { matchMedia } = window;

customElements.define(NAME, VideoPlayer);
