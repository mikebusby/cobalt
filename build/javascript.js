//
// Javascript build task
//

const gulpif = require('gulp-if')
const uglify = require('gulp-uglify-es').default;

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream =
      gulp.src([config.srcPath + 'js/**/*.js', !config.srcPath + 'www/js/*.min.js'])
        .pipe(plugins.plumber())
        .pipe(plugins.babel())
        .pipe(gulpif(config.production, uglify()))
        .pipe(plugins.concat('main.min.js'))
        .pipe(gulp.dest(config.buildPath + 'js'));

    return stream;
  }
}