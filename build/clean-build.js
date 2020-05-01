//
// Clean build folder task
//

module.exports = (gulp, plugins, config) => {
  return () => {
    return gulp.src(config.BUILD_PATH, { read: false }).pipe(plugins.clean());
  }
}
