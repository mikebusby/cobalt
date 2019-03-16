//
// Cache bust task
//

module.exports = function(gulp, plugins, config) {
  return function() {
    function getStamp() {
      const date = new Date();
      return date.getFullYear().toString() +
        ('0' + (date.getMonth() + 1)).slice(-2) +
        ('0' + date.getDate()).slice(-2) +
        date.getSeconds().toString();
    };

    return gulp.src(config.buildPath + '**/*.html')
      .pipe(
        plugins.replace(/main.css([0-9]*)/g, 'main.css?' + getStamp())
      )
      .pipe(
        plugins.replace(/favicon.ico([0-9]*)/g, 'favicon.ico?' + getStamp())
      )
      .pipe(
        plugins.replace(/main.min.js([0-9]*)/g, 'main.min.js?' + getStamp())
      )
      .pipe(gulp.dest(config.buildPath));
  }
}