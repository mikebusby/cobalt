//
// Scripts build task
//

const gulpif = require('gulp-if');

module.exports = function(gulp, plugins, config) {
  return function() {
    const stream =
      gulp.src([config.srcPath + 'js/**/*.js', !config.srcPath + 'www/js/*.min.js'])
        .pipe(plugins.plumber({
          errorHandler: function(err) {
            plugins.notify.onError({
              title: 'Gulp error in ' + err.plugin,
              message: err.toString()
            })(err);
          }
        }))
        .pipe(gulpif(config.production, plugins.uglify()))
        .pipe(plugins.concat('main.min.js'))
        .pipe(gulp.dest(config.buildPath + 'js'));

    return stream;
  }
}