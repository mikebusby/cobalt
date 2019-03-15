//
// Cache bust task
//

module.exports = function(gulp, plugins, config) {
  return function() {
    function getStamp() {
      const date = new Date();

      const year = date.getFullYear().toString();
      const month = ('0' + (date.getMonth() + 1)).slice(-2);
      const day = ('0' + date.getDate()).slice(-2);
      const seconds = date.getSeconds().toString();

      const timestamp = year + month + day + seconds;

      return timestamp;
    };

    gulp
      .src(config.buildPath + '**/*.html')
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