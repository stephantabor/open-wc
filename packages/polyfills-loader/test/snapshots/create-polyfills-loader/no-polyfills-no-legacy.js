(function () {
  function loadScript(src, type) {
    return new Promise(function (resolve) {
      var script = document.createElement('script');

      function onLoaded() {
        document.head.removeChild(script);
        resolve();
      }

      script.src = src;
      script.onload = onLoaded;

      script.onerror = function () {
        console.error('[polyfills-loader] failed to load: ' + src + ' check the network tab for HTTP status.');
        onLoaded();
      };

      if (type) script.type = type;
      document.head.appendChild(script);
    });
  }

  loadScript('/app.js', 'module');
})();