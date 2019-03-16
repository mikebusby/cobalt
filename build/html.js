//
// HTML build task
//

const fileinclude = require('gulp-file-include');
const gulpif = require('gulp-if');
const dom = require('gulp-dom');

module.exports = function(gulp, plugins, config) {
  return function() {
    gulp.src([
        config.tplPath + '**/*.html',
        '!' + config.tplPath + '_**/_*/',
        '!' + config.tplPath + '**/_*/**/*'
      ])
      .pipe(plugins.plumber({
        errorHandler: function(err) {
          plugins.notify.onError({
            title: 'Gulp error in ' + err.plugin,
            message: err.toString()
          })(err);
        }
      }))
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
      .pipe(
        gulpif(
          !config.production,
          dom(function() {
            return this.querySelectorAll('body')[0].classList.add('bp-tester');
          })
        )
      )
      .pipe(gulp.dest(config.buildPath));
  }
}