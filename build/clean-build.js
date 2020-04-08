//
// Clean build folder task
//

module.exports = (gulp, plugins, config) => {
  return () => {
    return gulp.src(config.buildPath, { read: false }).pipe(plugins.clean());
  }
}