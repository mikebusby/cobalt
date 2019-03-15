//
// HTML build task
//

module.exports = function(gulp, plugins, config) {
  return function() {
    gulp.src([
        config.tplPath + '**/*.html',
        '!' + config.tplPath + '_**/_*/',
        '!' + config.tplPath + '**/_*/**/*'
      ])
      .pipe(
        plugins.fileinclude({
          prefix: '@@',
          basepath: 'src/tpl/'
        })
      )
      .pipe(
        plugins.gulpif(
          config.production,
          plugins.htmlmin({ collapseWhitespace: true })
        )
      )
      .pipe(gulp.dest(config.buildPath));
  }
}