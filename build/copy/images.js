//
// Copy images task
//

module.exports = function(gulp, config) {
  return function() {
    const stream =
      gulp.src(config.staticPath + '/img/*')
        .pipe(gulp.dest(config.buildPath + 'img/'));
    return stream;
  }
}