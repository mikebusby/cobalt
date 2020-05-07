//
// SCSS build task
//

// * NOTE * 
// This task is not in use by default. By default PostCSS is enabled.
// To use this task gulp-autoprefixer and gulp-sass must be installed.
// Once installed, change CSS_TYPE to scss and rename all files from .css to .scss
//
// To install run: yarn add gulp-autoprefixer --dev && yarn add gulp-sass --dev

const postcssTailwind = require('tailwindcss');

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream =
      gulp.src(`${config.SRC_PATH}css/main.scss`)
        .pipe(plugins.plumber({
          errorHandler: function (err) {
            plugins.notify.onError({
              title: `Gulp error in ${err.plugin}`,
              message: err.toString(),
            })(err);
          },
        }))
        .pipe(plugins.sass({
          outputStyle: 'compressed',
        }))
        .pipe(plugins.postcss([
          postcssTailwind(),
        ]))
        .pipe(plugins.autoprefixer({
          cascade: false,
        }))
        .pipe(gulp.dest(`${config.BUILD_PATH}css/`));

    return stream;
  }
}
