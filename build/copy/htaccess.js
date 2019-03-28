//
// Copy .htaccess task
//

module.exports = function(gulp, config) {
  return function() {
    return gulp
      .src(config.tplPath + '**/.htaccess')
      .pipe(gulp.dest(config.buildPath));
  }
}