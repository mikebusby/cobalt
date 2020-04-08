//
// Copy favicon task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(config.staticPath + '/favicon/favicon.ico')
        .pipe(gulp.dest(config.buildPath));
    return stream;
  }
}