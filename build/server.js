//
// Localhost server task
//

const browserSync = require('browser-sync');

module.exports = function(gulp, plugins, config) {
  return function() {
    const stream = 
      browserSync.init({
        server: {
          baseDir: './www',
          serveStaticOptions: {
            extensions: ['html']
          }
        },
        open: false,
        port: 1337,
        watch: true,
      });
    
    return stream;
  }
}