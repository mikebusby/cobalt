//
// Copy .htaccess task
//

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(config.tplPath + '**/.htaccess')
        .pipe(gulp.dest(config.buildPath));
    return stream;
  }
}