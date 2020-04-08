//
// Copy images task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(config.staticPath + '/img/*')
        .pipe(gulp.dest(config.buildPath + 'img/'));
    return stream;
  }
}