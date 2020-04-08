//
// Localhost server task
//

const browserSync = require('browser-sync');

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream = 
      browserSync.init({
        server: {
          baseDir: './www',
          serveStaticOptions: {
            extensions: ['html']
          }
        },
        open: false,
        notify: false,
        port: 1337,
        watch: true,
      });
    
    return stream;
  }
}