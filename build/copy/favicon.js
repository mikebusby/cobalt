//
// Copy favicon task
//

module.exports = function(gulp, config) {
  return function() {
    const stream =
      gulp.src(config.staticPath + '/favicon/favicon.ico')
        .pipe(gulp.dest(config.buildPath));
    return stream;
  }
}