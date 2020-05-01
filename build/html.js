//
// HTML build task
//

const argv = require('yargs').argv
const fileinclude = require('gulp-file-include');
const gulpif = require('gulp-if');
const dom = require('gulp-dom');

module.exports = (gulp, plugins, config) => {
  return () => {
    const productionEnv = argv.env === 'production' ? true : false;

    const stream = 
      gulp.src([
        config.TPL_PATH + '**/*.html',
          '!' + config.TPL_PATH + '_**/_*/',
          '!' + config.TPL_PATH + '**/_*/**/*',
        ])
        .pipe(plugins.plumber({
          errorHandler: function(err) {
            plugins.notify.onError({
              title: 'Gulp error in ' + err.plugin,
              message: err.toString(),
            })(err);
          },
        }))
        .pipe(fileinclude({
          prefix: '@@',
          basepath: 'src/tpl/',
        }))
        .pipe(gulpif(
          productionEnv,
          plugins.htmlmin({ collapseWhitespace: true })
        ))
        .pipe(gulpif(
          !productionEnv,
          dom(function() {
            return this.querySelectorAll('body')[0].classList.add('bp-tester');
          })
        ))
        .pipe(gulp.dest(config.BUILD_PATH));

    return stream;
  }
}
