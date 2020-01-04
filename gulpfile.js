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
gulp.task('copy', gulp.series(
  'copy-img',
  'copy-favicon',
  'copy-htaccess'
));

// Watch file changes
gulp.task('watch', function() {
  gulp.watch(config.tplPath + '**/*.html', gulp.series('html'));
  gulp.watch(config.srcPath + 'css/**/*.' + config.cssType, gulp.series('styles'));
  gulp.watch(config.srcPath + 'js/**/*.js', gulp.series('scripts'));
  gulp.watch(config.staticPath + 'img/*', gulp.series('copy-img'));
  gulp.watch(config.staticPath + 'icons/*.svg', gulp.series('svg-icons'));
});

// Run build tasks
gulp.task('default', gulp.series(
  'styles',
  'copy',
  'svg-icons',
  'html',
  'scripts'
));

// Run development tasks
gulp.task('dev', gulp.parallel(
  'web-server',
  'watch'
))

// Production tasks
gulp.task('set-production', async function() { config.production = true; });
gulp.task('clean-build', require('./build/clean-build')(gulp, plugins, config));
gulp.task('minify-img', require('./build/minify-img')(gulp, config));
gulp.task('cache-bust', require('./build/cache-bust')(gulp, plugins, config));

// Run production tasks
gulp.task('production', gulp.series(
  'set-production',
  'clean-build',
  'default',
  'minify-img',
  'cache-bust'
));

// Deployment task
gulp.task('deploy', require('./build/deploy')(gulp));