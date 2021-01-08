//
// Clean build folder task
//

module.exports = (gulp, plugins, config) => {
  return () => {
    return gulp.src(
      config.BUILD_PATH, { 
        read: false, allowEmpty: true,
       }).pipe(plugins.clean()
      );
  }
}
