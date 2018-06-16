module.exports = {
  stripPrefix: 'build/',
  staticFileGlobs: [
    'build/*.html',
    'build/manifest.json',
    'build/static/**/!(*map*)'
  ],
  runtimeCaching: [{
    cacheName: 'resource-cache',
    urlPattern: /\.(?:html|js|css)$/,
    handler: 'cacheFirst'
  }, {
    // Use a custom cache name.
    cacheName: 'images',

    // Match any request ends with .png, .jpg, .jpeg or .svg.
    urlPattern: /\.(?:png|jpg|jpeg|svg)/,

    // Apply a cache-first strategy.
    handler: 'cacheFirst',

    options: {
      // Only cache 10 images.
      expiration: {
        maxEntries: 20,
      },
    },
  }],
  dontCacheBustUrlsMatching: /\.\w{8}\./,
  swFilePath: 'build/service-worker.js'
};
