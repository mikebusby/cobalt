//
// Copy favicon task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(`${config.STATIC_PATH}favicon/favicon.ico`)
        .pipe(gulp.dest(config.BUILD_PATH));
    return stream;
  }
}
