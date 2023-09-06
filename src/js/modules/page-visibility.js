// https://developer.mozilla.org/en-US/docs/Web/API/Page_Visibility_API

let hidden, visibilityChange;
if (typeof document.hidden !== 'undefined') {
  // Opera 12.1, Firefox 18
  hidden = 'hidden';
  visibilityChange = 'visibilitychange';
} else if (typeof document.msHidden !== 'undefined') {
  hidden = 'msHidden';
  visibilityChange = 'msvisibilitychange';
} else if (typeof document.webkitHidden !== 'undefined') {
  hidden = 'webkitHidden';
  visibilityChange = 'webkitvisibilitychange';
}

// let videoElement = document.getElementById('Promo');

function handleVisibilityChange(videoElement) {
  if (document[hidden]) {
    videoElement.pause();
  } else {
    videoElement.play();
  }
}

export function setPageVisibility(videoElement) {
  if (
    typeof document.addEventListener === 'undefined' ||
    hidden === undefined
  ) {
    console.log(
      'Требуется браузер, который поддерживает API видимости страницы, например Brave или Firefox.'
    );
  } else {
    document.addEventListener(
      visibilityChange,
      handleVisibilityChange(videoElement),
      false
    );

    videoElement.addEventListener(
      'pause',
      function () {
        document.title = 'Приостановлено';
      },
      false
    );

    videoElement.addEventListener(
      'play',
      function () {
        document.title = 'Воспроизведение';
      },
      false
    );
  }
}
