//
// SVG icons build task
//

const path = require('path');

module.exports = function(gulp, plugins, config) {
  return function() {
    const stream = gulp
      .src(config.staticPath + 'icons/*.svg')
      .pipe(plugins.svgmin(function (file) {
        const prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
            cleanupIDs: {
              prefix: prefix + '-',
              minify: true
            }
          }]
        }
      }))
      .pipe(plugins.svgstore({ inlineSvg: true }));

    function fileContents(filePath, file) {
      return file.contents.toString();
    }

    gulp
      .src(config.staticPath + 'icons/_inline-icons.html')
      .pipe(plugins.inject(stream, { transform: fileContents }))
      .pipe(gulp.dest(config.staticPath + 'icons/'));

    return stream;
  }
}