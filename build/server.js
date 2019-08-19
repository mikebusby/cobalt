//
// Localhost server task
//

module.exports = function(gulp, plugins, config) {
  return function() {
    const stream = 
      gulp.src(config.buildPath)
        .pipe(plugins.webserver({
          middleware: function (req, res, next) {
            if (
              req.url.indexOf('css') >= 0 ||
              req.url.indexOf('js') >= 0 ||
              req.url.indexOf('img') >= 0 ||
              req.url.indexOf('favicon.ico') >= 0
            ) {
              next();
              return
            }

            // if is a request for index in a folder
            if (req.url.slice(-2).length > 1 && req.url.slice(-1) === '/') {
              req.url = req.url + 'index';
            }

            // if root page
            if (req.url === '/') {
              req.url = '/index';
            }

            req.url = req.url + '.html';
            next();
          },
          fallback: '404.html',
          host: '0.0.0.0',
          port: 1337,
          livereload: true
        }));
    
    return stream;
  }
}