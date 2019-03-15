//
// HTML build task
//

const fileinclude = require('gulp-file-include');
const gulpif = require('gulp-if');

module.exports = function(gulp, plugins, config) {
  return function() {
    gulp.src([
        config.tplPath + '**/*.html',
        '!' + config.tplPath + '_**/_*/',
        '!' + config.tplPath + '**/_*/**/*'
      ])
      .pipe(
        fileinclude({
          prefix: '@@',
          basepath: 'src/tpl/'
        })
      )
      .pipe(
        gulpif(
          config.production,
          plugins.htmlmin({ collapseWhitespace: true })
        )
      )
      .pipe(gulp.dest(config.buildPath));
  }
}