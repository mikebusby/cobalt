//
// SCSS build task
//

// * NOTE * 
// This task is not in use by default. By default PostCSS is enabled.
// To use this task gulp-autoprefixer and gulp-sass must be installed.
// Once installed, change cssType to scss
//
// To install run: yarn add gulp-autoprefixer --dev && yarn add gulp-sass --dev

module.exports = function(gulp, plugins, config) {
  return function() {
    gulp.src(config.srcPath + '/css/main.scss')
      .pipe(plugins.plumber({
        errorHandler: function(err) {
          plugins.notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString()
          })(err);
        }
      }))
      .pipe(plugins.sass({
        outputStyle: 'compressed'
      }))
      .pipe(plugins.autoprefixer({
        browsers: ['last 3 versions'],
        cascade: false
      }))
      .pipe(gulp.dest(config.buildPath + 'css/'));
  }
}