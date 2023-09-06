import L from './leaflet';
import {
  selectAll,
  createNode,
  createNodeWithClass,
  appendNode
} from '../utils';

// TODO: Использовать Mapbox Directions API и Geolocation API,
// для построения маршрута (альтернатива Google Maps).
// https://leafletjs.com/examples/mobile/
// https://leafletjs.com/reference-1.7.1.html#map-locate
// https://docs.mapbox.com/help/tutorials/getting-started-directions-api/

const root = document.documentElement;

const ICON_GRADIENT = `<linearGradient id="Grad" gradientUnits="userSpaceOnUse" x1="0%" y1="0%" x2="100%" y2="0%" gradientTransform="rotate(45)">
  <stop offset="0%" stop-color="#cba576" />
  <stop offset="100%" stop-color="#cba576" />
</linearGradient>`;

const ICON = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 128" class="svg-inline">
  <path fill="#CA8865" d="M22.44 6.22S25.26 2 37.95 4.25C50.07 6.4 52.38 9.79 51.43 12.1c-.94 2.29-14.29 7.28-14.29 7.28l-9.67 1.88s-.41 1.07-.65 2.66c-.24 1.58-.54 6.11-.54 6.11l-5.44-9.49l1.6-14.32z"/>
  <path fill="#E4BF8F" d="M51.91 60.74s2.95-.63 4.83-2.86c1.84-2.19 3.61-5.55 3.67-7.16c.09-2.24-.54-3.22-.98-3.58c-1.05-.84-6.8 5.55-6.8 5.55l-.72 8.05z"/>
  <path fill="#CA8865" d="m83.16 16.52l-11.28 8.42s-1.97 2.69 5.01 3.94c6.98 1.25 13.16 1.34 13.16 1.34s12.8-5.64 12.62-6.54s-1.16-6.27-1.61-6.18c-.44.09-17.9-.98-17.9-.98z"/>
  <path fill="#EFC2A2" d="M74.47 87.87c-.27 1.07-1.07 2.69-2.06 3.94c-.79 1-2.38 1.34-2.33 2.24c.09 1.52 3.49 4.12 4.57 4.12s2.78-1.7 2.6-4.03c-.18-2.33-.18-6.54-.18-6.54l-2.6.27z"/>
  <path fill="#CA8865" d="m48.69 41.32l1.34-4.12l2.15-3.04l3.49 2.33l3.4 9.22l-.07 4.73s-1.27 2.87-4.23 7.08s-3.88 6.01-5.73 9.58c-1.34 2.6-2.96 6.73-3.67 12.18c-1.07 8.24 0 14.86-.18 22.74s-1.15 15.72-3.74 18.49c-2.34 2.5-5.57 3.98-12.37 4.07s-7.31-1.63-7.31-1.63l-3.43-39.64l20.32-42.44l10.03.45z"/>
  <path fill="#865C52" d="M47.22 42.52s-2.42-.38-5.68 2.42c-2.64 2.27-4.47 7.34-7.64 15.59c-3.03 7.86-5.75 14.15-8.02 18.16s-3.94 7.04-4.99 9.16c-.91 1.82-4.31 1.14-4.31.83s-3.63-4.09-3.63-4.09l-.3-4.62s5.22-7.49 5.22-7.72s5.98-13.09 5.98-13.09s4.77-18.54 4.92-19.07s6.58-9.16 6.58-9.16l12.26-1.89s.98 6.81.98 7.11s-.15 6.21-.15 6.21l-1.22.16z"/>
  <path fill="#DCA282" d="M48.7 28.53s1.58.39 3.64 1.94c2.46 1.86 4.11 4.07 5.37 6.33c1.13 2.03 1.86 4.99 2.1 7.75s-.42 5.34-.84 5.88s-1.68-6.96-3.12-10.07c-1.41-3.05-2.7-4.02-4.5-3.84c-1.87.19-1.74.72-1.74.72l-.91-8.71zM28.01 85.62l3.06-.22s2.5 9.02 3.34 17.63s.83 13.23.74 15.27s-.65 3.79-2.96 5c-2.31 1.2-6.66 1.02-8.79.65c-2.13-.37-3.84-2.7-5.5-5.57s-4.04-8.26-5.6-15.07c-2.41-10.46-1.57-18.32-1.57-18.32l8.61 4.53l8.67-3.9z"/>
  <path fill="#F8E2D5" d="M25.93 43.16s-1.55 10.51-2.84 14.58c-1.3 4.07-2.66 8.09-6.45 13.64c-2.5 3.67-5.18 5.92-6.11 8.42c-.93 2.5-.83 4.9.09 6.85s1.9 2.44 1.9 2.44s-.72 1.2-1.77 2.14c-.95.84-2.2 1.3-2.2 1.85s.8 1.83 2.25 2.9c.98.72 2.45 1.45 2.85 1.45c.4 0 2.85-4.51 2.85-4.36c0 .15 2.31 5.32 2.76 5.37c2.25.25 5.5-3.35 5.5-4.22c0-.55-3.69-3.71-3.69-3.71s4.79.3 9.25-4s10.52-14.29 14.93-26.15s6.32-22.23 5.19-27.68s-2.6-5.8-2.6-5.8l-1.64 2.25s1.82 4.67.78 11.25s-4.84 19.73-9 28.03c-3.59 7.17-8.65 15.05-14.88 17.91c-6.23 2.85-11.16-3.05-8.65-7.09c1.56-2.51 4.41-5.45 7.09-10.99c3.06-6.32 5.1-14.97 5.71-18s1.3-6.14 1.3-6.14l-2.62-.94z"/>
  <path fill="#CA8865" d="M18.81 40.79s-3.64 9.64-3.5 10.66s2.03 5.08 3.42 7.03c2.38 3.34 4.23 5.58 4.67 5.58s2.92-9.48 2.92-9.48s-1.9-2.7-3.19-5.05c-2.33-4.23-1.33-7.35-1.47-7.57c-.15-.22-2.85-1.17-2.85-1.17z"/>
  <path fill="#FDE1CC" d="M14.97 101.56c-1.08.36-.6 2.01.42 5.2s3.94 10.37 7.59 12.83c2.46 1.66 6.56 1.82 6.32-1.13c-.15-1.9-3.03-1.95-5.29-4.16c-3.06-2.98-4.81-5.56-6.24-8.23c-.82-1.52-1.66-4.89-2.8-4.51z"/>
  <path fill="#E7AC84" d="M35.48 14.24c-12.52-1.9-12.77-7.46-12.81-7.72c-.11-.77-.35-.18-.45.15c-.1.33-1.75 8.46-2.15 10.34c-.41 1.88-2.64 10.14-2.61 10.61c.03.47.35 2.13.92 3.23c.57 1.09 1.96 3.85 1.96 3.85s-1.77 1.21-3.17 2.3s-2.75 3.09-2.75 3.09s-.34.64-.26 4.04c.08 3.4 1.17 7.36 1.17 7.36s.93-2.31 3.79-4.99c2.87-2.68 5.53-4.11 5.53-4.11s3.32 5.17 6.53 9.32S40.8 61.9 40.8 61.9s1.28-3.28 1.7-4.53s1.41-4.54 1.41-4.54s-2.2-2.28-6.12-6.2s-5.79-8-5.79-8s4.6-1.88 8.97-4.41c5.6-3.23 8.44-5.43 8.44-5.43s.72-2.98 1.23-7.41c.58-5 1.02-10.16 1.02-10.16s-2.97 5.02-16.18 3.02zm.91 12.35c-3.17 1.41-8.51 3.62-8.51 3.62L23.7 19.64s2.32 1.7 7.12 3c4.81 1.3 12.21.96 12.21.96s-3.48 1.57-6.64 2.99zM74.92 9.64l-3.04 15.29s6.35-2 14.56-2.77s14.95-.47 14.95.65s-8.45 1.95-16.54 5.55s-14.06 8.45-14.06 8.45s-.18 4.78.18 8.8s.95 7.03.95 7.03s4.43 3.01 7.8 4.73c3.37 1.71 5.32 2.48 5.32 2.48l3.25-8.8s-4.31-2.01-6.2-3.25s-3.72-1.95-3.84-3.43c-.12-1.48 5.08-4.96 11.76-7.97s10.81-3.66 10.81-3.66s4.37-2.95 4.31-3.19c-.06-.24-1.06-4.67-1-10.16c.06-5.49.12-9.51.12-9.51s-3.43-3.19-14.71-2.72c-11.31.48-14.62 2.48-14.62 2.48z"/>
  <path fill="#DDA281" d="m108.09 32.52l.99 11.68l-8.2 43.47l7.45 31.5s-2.19 5.6-11.67 5.76c-5.84.1-7.93-2.43-8.82-3.11c-.89-.68-6.09-10.68-8.14-16.34c-4.55-12.55-5.23-17.62-5.23-17.62l3.93-9.27l8.82-25.96l8.32-14.41l8.07-7.45l4.48 1.75z"/>
  <path fill="#CA8865" d="m109.08 29.79l-4.47 1.86s3.07 1.37 3.11 6.09c.07 9.91-4.98 17.96-9.31 25.87c-2.78 5.08-5.17 7.09-7.58 7.79c-1.67.49-3.44.02-3.28 1.23c.21 1.61 4 2.46 4 2.46s-1.87 2.8-4.2 4.4c-2.33 1.6-5.46 2.46-4.93 3.53c.53 1.07 6.73-.2 6.73-.2s-1.4 2.66-2.73 3.8s-2.66 1.6-2 2.6c.67 1 3.6-.07 4.4-.4c.8-.33 2-1 2-1s-1.02 9 0 16.06c.87 6 3.14 13.56 7.58 16.5c2.41 1.6 7.08 1.46 9.01.01c1.45-1.09 2.93-5.09 3.13-7.29c.2-2.2-11.12-23.55-11.12-23.55l7.53-24.85l10.93-11.66s1.73-2.4 1.8-7.53s-3.53-10.86-5.73-12.92c-2.22-2.07-4.87-2.8-4.87-2.8z"/>
  <path fill="#F8E2D5" d="m112.26 55.51l-1.87-5.67s2.13-8.19.73-12.79s-3.6-5.36-5.73-5.46c-1.25-.06-11.03 8.41-16.88 22.97c-5.85 14.55-8.47 26.48-10.86 29.94c-2.39 3.46-3.9 4.11-4.53 3.1c-1.19-1.91.84-4.06 2.15-6.44c1.31-2.39 7.47-21.87 10.5-28.87c3.46-7.99 9.99-17.6 15.48-21.77c3.31-2.52 5.76-2.44 5.76-2.44s5.06 1.49 7.92 5.31s2.57 9.37 1.62 15.81s-4.29 6.31-4.29 6.31zM79.34 87.85c-1.65.48-1.19 3.37.85 10.14c2.5 8.28 6.42 16.3 7.11 17.57c.69 1.27 1.33 2.44 2.28 1.96c.96-.48-.42-2.81-1.17-4.67c-.87-2.17-2.79-7.58-5.1-15.56c-1.26-4.4-1.95-10.02-3.97-9.44z"/>
  <path fill="#F8E2D5" d="M101.8 36.94c-.81-.19-3.77 1.96-5.95 8.39c-2.18 6.42-1.92 11.85-.11 11.89c2.12.05 1.7-6.69 3.34-11.31c1.9-5.28 3.84-8.71 2.72-8.97z"/>
  <path fill="#E4BF8C" d="M116.21 48.09c-4.62-2.27-15.18 7.7-20.73 31.77s-.01 41.7 10.84 38.35c11.62-3.58-2.51-30.95.4-41.79c1.15-4.3 1.9-6.33 2.81-8.59c1.19-2.95 2.93-5.87 3.37-6.56c1.66-2.59 8.95-10.41 3.31-13.18z"/>
  <path fill="#DDA281" d="m97.9 70.96l11.69-3.12s-2.24 5.54-2.84 8.4c-.5 2.39-.34 4.14-.34 4.14L94.5 83.89s.91-4.31 1.65-7.04s1.75-5.89 1.75-5.89z"/>
</svg>`;

const ICON_ZOOM_IN = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline"><defs>${ICON_GRADIENT}</defs>
  <path fill="url(#Grad)" d="M319.8 204v8c0 6.6-5.4 12-12 12h-84v84c0 6.6-5.4 12-12 12h-8c-6.6 0-12-5.4-12-12v-84h-84c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h84v-84c0-6.6 5.4-12 12-12h8c6.6 0 12 5.4 12 12v84h84c6.6 0 12 5.4 12 12zm188.5 293L497 508.3c-4.7 4.7-12.3 4.7-17 0l-129-129c-2.3-2.3-3.5-5.3-3.5-8.5v-8.5C310.6 395.7 261.7 416 208 416 93.8 416 1.5 324.9 0 210.7-1.5 93.7 93.7-1.5 210.7 0 324.9 1.5 416 93.8 416 208c0 53.7-20.3 102.6-53.7 139.5h8.5c3.2 0 6.2 1.3 8.5 3.5l129 129c4.7 4.7 4.7 12.3 0 17zM384 208c0-97.3-78.7-176-176-176S32 110.7 32 208s78.7 176 176 176 176-78.7 176-176z"></path>
</svg>`;

const ICON_ZOOM_OUT = `<svg aria-hidden="true" focusable="false" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" class="svg-inline"><defs>${ICON_GRADIENT}</defs>
  <path fill="url(#Grad)" d="M307.8 223.8h-200c-6.6 0-12-5.4-12-12v-8c0-6.6 5.4-12 12-12h200c6.6 0 12 5.4 12 12v8c0 6.6-5.4 12-12 12zM508.3 497L497 508.3c-4.7 4.7-12.3 4.7-17 0l-129-129c-2.3-2.3-3.5-5.3-3.5-8.5v-8.5C310.6 395.7 261.7 416 208 416 93.8 416 1.5 324.9 0 210.7-1.5 93.7 93.7-1.5 210.7 0 324.9 1.5 416 93.8 416 208c0 53.7-20.3 102.6-53.7 139.5h8.5c3.2 0 6.2 1.3 8.5 3.5l129 129c4.7 4.7 4.7 12.3 0 17zM384 208c0-97.3-78.7-176-176-176S32 110.7 32 208s78.7 176 176 176 176-78.7 176-176z"></path>
</svg>`;

const ATTR = 'Данные карты &copy; <a href="https://www.openstreetmap.org/" target="_blank" rel="noopener noreferrer">Участники OpenStreetMap</a>, <a href="https://creativecommons.org/licenses/by-sa/2.0/" target="_blank" rel="noopener noreferrer">CC-BY-SA</a>, Векторные данные &copy; <a href="https://www.mapbox.com/" target="_blank" rel="noopener noreferrer">Mapbox</a>';

const NAMES = [
  'Студия в центре города',
  'Загородная студия',
  'Cтудия в школе танцев',
];

// https://schema.org/OpeningHoursSpecification
const addOpens = (days='Mo-Su', time) => `
  <span>
    <b>Открыто:</b>
    <time datetime="${days} ${time}">
      ${time}
    </time>
  </span>
`;
// https://schema.org/ContactPoint
const addContact = (telephone) => `
  <span>
    <b>Контакты:</b>
    <span>
      <a href="tel:+7${telephone.replace(/[^\d+]/g, '')}">${telephone}</a>
    </span>
  </span>
`;

const metroIcon = `<svg width="16" height="16" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M1 11.8L4.5 2 8 7.5 11.5 2l3.5 9.8h1V13h-5v-1.2h.5l-1-2.27L8 13 5.5 9.53l-1 2.27H5V13H0v-1.2h1z" fill="#FF4D4D"></path></svg>`

// Add icon for metro/underground stations.

// https://learn.javascript.ru/template-element
// https://gomakethings.com/html-templates-with-vanilla-javascript/
const loopItems = (arr) => {
  let item = '';
  for (let i of arr) {
    item += `<li class="item"><span data-icon></span>${i}</li>`;
  }
  // let list = `<ul>${item}</ul`;
  return item;
}

const addData = (name, desc, adds, metro=[], opens, telephone, direction) => `
  <article class="flow">
    <div class="flow">
      <!-- h4 class="headline">
        <span itemprop="name">${name}</span>
      </h4-->
      <!--span itemprop="description">${desc}</span-->
      <span>${adds}, Москва</span>
    </div>
    <!-- Как добраться -->
    <div class="flow">
      <strong>Ближайшие станции<br /></strong>
      <ul>${loopItems(metro)}</ul>
    </div>
    <a class="direction" href="${direction}" target="_blank" rel="noopener noreferrer"><span>Проложить маршрут</span></a>
  </article>
`;

// city centre studio
const centralStudio = {
  data: () => addData(
    NAMES[0],
    '',
    'Скаковая улица, 3с1',
    ['Динамо', 'Белорусская'],
    '10&colon;00–22&colon;00',
    '',
    'https://yandex.ru/maps/-/CDQBuX9H'
  ),
  lat: 55.783240,
  lng: 37.566952,
};

// suburb/village/rural studio
const villageStudio = {
  data: () => addData(
    NAMES[1],
    '',
    'деревня Николо-Хованское, 146А',
    ['Прокшино'],
    '10&colon;00–22&colon;00',
    '',
    'https://yandex.ru/maps/-/CDQBqS0t'
  ),
  lat: 55.593273,
  lng: 37.441637,
};

// dance school studio
const balanceStudio = {
  data: () => addData(
    NAMES[2],
    'Школа танцев Balance Club',
    'проспект Вернадского, 95к4, Balance Club',
    ['Юго-Западная'],
    '10&colon;00–22&colon;00',
    '',
    'https://yandex.ru/maps/-/CDQB5UOJ'
  ),
  lat: 55.665325,
  lng: 37.497877,
};

const locations = [
  [centralStudio.data, centralStudio.lat, centralStudio.lng],
  [villageStudio.data, villageStudio.lat, villageStudio.lng],
  [balanceStudio.data, balanceStudio.lat, balanceStudio.lng],
];

// https://docs.mapbox.com/api/maps/#static-tiles
// const mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}';

let mapboxUrl;
if (root.dataset.device === 'mobile') {
  mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}?access_token={accessToken}';
} else {
  mapboxUrl = 'https://api.mapbox.com/styles/v1/{username}/{style_id}/tiles/{z}/{x}/{y}@2x?access_token={accessToken}';
}

// https://docs.mapbox.com/help/glossary/zoom-level/#tile-size
const vectorLayerOptions = {
  minZoom: 10,
  maxZoom: 18,
  username: 'mevius6',
  tileSize: 512,
  zoomOffset: -1,
  accessToken: process.env.MAPBOX_ACCESS_TOKEN,
}

const DARK_STYLE_ID = 'cllsgvh80009g01r4781i6b1h';
const LIGHT_STYLE_ID = 'cllsgvsqf009t01qy3nn06tf0';

const night = L.tileLayer(mapboxUrl, {
  ...vectorLayerOptions,
  style_id: DARK_STYLE_ID
});

const light = L.tileLayer(mapboxUrl, {
  ...vectorLayerOptions,
  style_id: LIGHT_STYLE_ID
});

const style = root.dataset.themeStyle;
const toggle = document.querySelector('theme-switch');

toggle.addEventListener('colorschemechange', () => {
  if (toggle.mode === 'dark') {
    night.addTo(map) && light.removeFrom(map);
  } else {
    light.addTo(map) && night.removeFrom(map);
  }
});

// https://studio.mapbox.com/styles/mevius6/cllnq93hk001k01r71y6w9u8j/edit/#13/55.753960/37.620393
const CITY_COORDS = L.latLng(55.753960, 37.620393);

const coords1 = L.latLng(centralStudio.lat, centralStudio.lng),
      coords2 = L.latLng(villageStudio.lat, villageStudio.lng),
      bounds = L.latLngBounds(coords1, coords2);

const mapOptions = {
  attributionControl: false,
  zoomControl: false,
  // zoomSnap: 0.5,
  layers: [], // [night, light]
  scrollWheelZoom: false,
}

const map = L.map('map', mapOptions).fitBounds(bounds, {padding: [100, 100]});

(async () => {
  if (style === 'dark') {
    night.addTo(map);
  } else if (style === 'light') {
    light.addTo(map);
  } else {
    // w/o any style
    light.addTo(map);
  }
})();

// https://leafletjs.com/reference-1.7.1.html#icon
const markerIcon = L.divIcon({
  html: ICON,
  iconSize: [40, 45],
  popupAnchor: [0, -22.5],
  className: 'marker-icon',
});

const popupOptions = {
  maxWidth: 300,
  // keepInView: true,
  closeButton: true,
  className: 'microdata-popup',
};

const markers = [];
locations.map((location, i) => {
  let coords = [location[1], location[2]];
  let marker = L.marker(coords, {icon: markerIcon, title: NAMES[i]});

  marker
    .bindPopup(location[0], popupOptions)
    .on('click', () => map.setView(coords));

  markers.push(marker);
});

// https://leafletjs.com/reference-1.7.1.html#layergroup-togeojson
L.layerGroup(markers).addTo(map);

markers[0].openPopup();

L.control.zoom({
  position: 'topright',
  zoomInText: ICON_ZOOM_IN,
  zoomInTitle: 'Приблизить',
  zoomOutText: ICON_ZOOM_OUT,
  zoomOutTitle: 'Отдалить',
}).addTo(map);

L.control
  .attribution({position: 'bottomright'})
  .addAttribution(ATTR)
  .addTo(map);

selectAll('.extra-controls__item').forEach((control, i) => {
  let coords = [locations[i][1], locations[i][2]];

  control.addEventListener('change', () => {
    markers[i].openPopup();
    map.setView(coords);
  }, false);
});