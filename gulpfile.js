// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++
//     _____     __        ____
//    / ___/__  / /  ___ _/ / /_
//   / /__/ _ \/ _ \/ _ `/ / __/
//   \___/\___/_.__/\_,_/_/\__/
//
//   Cobalt is built by Mike Busby
//
//   hello@mikebusby.email
//   @MikeBusby
//
// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++

const gulp = require('gulp');
const runSequence = require('run-sequence');

// Load Plugins
const plugins = require('gulp-load-plugins')({
  rename: {
    'gulp-file-include': 'fileinclude',
    'gulp-if': 'gulpif'
  }
});

// Config variables
let config = {
  srcPath: 'src/',
  buildPath: 'www/',
  staticPath: 'src/static/',
  tplPath: 'src/tpl/',
  cssType: 'css', // CSS (PostCSS) or SCSS
  production: false
}

// Main Tasks
gulp.task('html', require('./build/html')(gulp, plugins, config));
gulp.task('styles', require('./build/' + config.cssType)(gulp, plugins, config));
gulp.task('scripts', require('./build/scripts')(gulp, plugins, config));
gulp.task('svg-icons', require('./build/svg-icons')(gulp, plugins, config));
gulp.task('web-server', require('./build/server')(gulp, plugins, config));

// Copy file tasks
gulp.task('copy-img', require('./build/copy/images')(gulp, config));
gulp.task('copy-favicon', require('./build/copy/favicon')(gulp, config));
gulp.task('copy-htaccess', require('./build/copy/htaccess')(gulp, config));
gulp.task('copy', [
  'copy-img',
  'copy-favicon',
  'copy-htaccess'
]);

// Watch file changes
gulp.task('watch', function () {
  gulp.watch(config.tplPath + '**/*.html', ['html']);
  gulp.watch(config.srcPath + 'css/**/*.' + config.cssType, ['styles']);
  gulp.watch(config.srcPath + 'js/**/*.js', ['scripts']);
  gulp.watch(config.staticPath + 'img/*', ['copy-img']);
  gulp.watch(config.staticPath + 'icons/*.svg', ['svg-icons']);
});

// Run development tasks
gulp.task('default', function (callback) {
  runSequence(
    'styles',
    'copy',
    'svg-icons',
    'html',
    'scripts',
    'watch',
    'web-server',
    callback
  );
});

// Production tasks
gulp.task('set-production', function () { return config.production = true; });
gulp.task('clean-build', require('./build/clean-build')(gulp, plugins, config));
gulp.task('minify-img', require('./build/minify-img')(gulp, config));
gulp.task('cache-bust', require('./build/cache-bust')(gulp, plugins, config));

// Run production tasks
gulp.task('production', function (callback) {
  runSequence(
    'set-production',
    'clean-build',
    'styles',
    'copy',
    'minify-img',
    'svg-icons',
    'html',
    'scripts',
    'cache-bust',
    callback
  );
});

// Deployment task
gulp.task('deploy', require('./build/deploy')(gulp));