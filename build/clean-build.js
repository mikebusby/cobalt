//
// Clean build folder task
//

module.exports = function(gulp, plugins, config) {
  return function() {
    return gulp.src(config.buildPath, { read: false }).pipe(plugins.clean());
  }
}