//
// Javascript build task
//

const argv = require('yargs').argv
const gulpif = require('gulp-if')
const uglify = require('gulp-uglify-es').default;

module.exports = (gulp, plugins, config) => {
  return () => {
    const productionEnv = argv.env === 'production' ? true : false;
    const stream =
      gulp.src([config.SRC_PATH + 'js/**/*.js', !config.SRC_PATH + 'www/js/*.min.js'])
        .pipe(plugins.plumber())
        .pipe(plugins.babel())
        .pipe(gulpif(productionEnv, uglify()))
        .pipe(plugins.concat('main.min.js'))
        .pipe(gulp.dest(config.BUILD_PATH + 'js'));

    return stream;
  }
}
