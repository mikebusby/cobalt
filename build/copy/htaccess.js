//
// Copy .htaccess task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(config.TPL_PATH + '**/.htaccess')
        .pipe(gulp.dest(config.BUILD_PATH));
    return stream;
  }
}
