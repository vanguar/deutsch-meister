/* Проявляем каждое изображение, когда браузер готов его отрисовать. */
window.ImageReveal = (() => {
  function showImage(img) {
    img.classList.add('dm-image-hidden');

    function reveal() {
      if (img.naturalWidth) img.classList.add('dm-image-reveal');
      if (img.naturalWidth || img.alt) img.classList.remove('dm-image-hidden');
    }

    function done() {
      img.removeEventListener('load', done);
      img.removeEventListener('error', done);
      if (img.naturalWidth && typeof img.decode === 'function') {
        img.decode().then(reveal, reveal);
      } else reveal();
    }

    if (img.complete) done();
    else {
      img.addEventListener('load', done);
      img.addEventListener('error', done);
    }
  }

  function show(container) {
    container.querySelectorAll('img').forEach(showImage);
  }

  return { show };
})();
