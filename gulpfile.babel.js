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
const plugins = require('gulp-load-plugins')();

// Config variables
const config = {
  SRC_PATH: 'src/',
  BUILD_PATH: 'www/',
  STATIC_PATH: 'src/static/',
  TPL_PATH: 'src/tpl/',
  CSS_TYPE: 'css', // CSS (PostCSS) or SCSS
}

// Main Tasks
gulp.task('templates', require('./build/templates')(gulp, plugins, config));
gulp.task('styles', require('./build/' + config.CSS_TYPE)(gulp, plugins, config));
gulp.task('scripts', require('./build/javascript')(gulp, plugins, config));
gulp.task('svg-icons', require('./build/svg-icons')(gulp, plugins, config));
gulp.task('web-server', require('./build/server')());

// Copy file tasks
gulp.task('copy-img', require('./build/copy/images')(gulp, config));
gulp.task('copy-favicon', require('./build/copy/favicon')(gulp, config));
gulp.task('copy-htaccess', require('./build/copy/htaccess')(gulp, config));
gulp.task('copy', gulp.series(
  'copy-img',
  'copy-favicon',
  'copy-htaccess'
));

// Watch file changes
gulp.task('watch', () => {
  gulp.watch(`${config.TPL_PATH}**/*.njk`, gulp.series('templates', 'styles'));
  gulp.watch(config.SRC_PATH + 'css/**/*.' + config.CSS_TYPE, gulp.series('styles'));
  gulp.watch(config.SRC_PATH + 'js/**/*.js', gulp.series('scripts'));
  gulp.watch(config.STATIC_PATH + 'img/*', gulp.series('copy-img'));
  gulp.watch(config.STATIC_PATH + 'icons/*.svg', gulp.series('svg-icons'));
});

// Production tasks
gulp.task('clean-build', require('./build/clean-build')(gulp, plugins, config));
gulp.task('minify-img', require('./build/minify-img')(gulp, config));
gulp.task('cache-bust', require('./build/cache-bust')(gulp, plugins, config));

// Run build tasks
gulp.task('default', gulp.series(
  'styles',
  'copy',
  'svg-icons',
  'templates',
  'scripts'
));

// Run development tasks
gulp.task('dev', gulp.parallel(
  'web-server',
  'watch'
))

// Run production tasks
gulp.task('production', gulp.series(
  'clean-build',
  'default',
  'minify-img',
  'cache-bust'
));

// Deployment task
gulp.task('deploy', require('./build/deploy')(gulp));
