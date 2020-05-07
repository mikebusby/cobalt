//
// Copy images task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(`${config.STATIC_PATH}img/*`)
        .pipe(gulp.dest(`${config.BUILD_PATH}img/`));
    return stream;
  }
}
