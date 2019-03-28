//
// Copy images task
//

module.exports = function(gulp, config) {
  return function() {
    return gulp
      .src(config.staticPath + '/img/*')
      .pipe(gulp.dest(config.buildPath + 'img/'));
  }
}