//
// Copy favicon task
//

module.exports = function(gulp, config) {
  return function() {
    return gulp.src(config.staticPath + '/favicon/favicon.ico')
      .pipe(gulp.dest(config.buildPath));
  }
}