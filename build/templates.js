//
// Template build task
//

const argv = require('yargs').argv
const nunjucksRender = require('gulp-nunjucks-render');
const gulpif = require('gulp-if');

module.exports = (gulp, plugins, config) => {
  return () => {
    const productionEnv = argv.env === 'production' ? true : false;

    const stream = 
      gulp.src([
        `${config.TPL_PATH}**/*.njk`,
          `!${config.TPL_PATH}_*/*.njk`,
        ])
        .pipe(plugins.plumber({
          errorHandler: function(err) {
            plugins.notify.onError({
              title: `Gulp error in ${err.plugin}`,
              message: err.toString(),
          })(err);
          },
        }))
        .pipe(nunjucksRender({
          path: [
            `${config.TPL_PATH}`,
          ],
        }))
        .pipe(gulpif(
          productionEnv,
          plugins.htmlmin({ collapseWhitespace: true })
        ))
        .pipe(gulp.dest(config.BUILD_PATH));

    return stream;
  }
}
