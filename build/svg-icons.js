//
// SVG icons build task
//

const path = require('path');

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream = gulp
      .src(`${config.STATIC_PATH}icons/*.svg`)
      .pipe(plugins.svgmin(function(file) {
        const prefix = path.basename(file.relative, path.extname(file.relative));
        return {
          plugins: [{
            cleanupIDs: {
              prefix: `${prefix}-`,
              minify: true,
            },
          }],
        }
      }))
      .pipe(plugins.svgstore({ inlineSvg: true }));

    const fileContents = (filePath, file) => {
      return file.contents.toString();
    }

    gulp
      .src(`${config.STATIC_PATH}icons/_inline-icons.html`)
      .pipe(plugins.inject(stream, { transform: fileContents }))
      .pipe(plugins.rename({
        basename: '_generated-icons',
        extname: '.njk',
      }))
      .pipe(gulp.dest(`${config.TPL_PATH}_partials/`));

    return stream;
  }
}
