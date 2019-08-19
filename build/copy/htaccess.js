//
// Copy .htaccess task
//

module.exports = function(gulp, config) {
  return function() {
    const stream =
      gulp.src(config.tplPath + '**/.htaccess')
        .pipe(gulp.dest(config.buildPath));
    return stream;
  }
}