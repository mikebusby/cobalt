// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++
//
//
//     _____     __        ____
//    / ___/__  / /  ___ _/ / /_
//   / /__/ _ \/ _ \/ _ `/ / __/
//   \___/\___/_.__/\_,_/_/\__/
//
//   Cobalt is built by Mike Busby
//
//   hello@mikebusby.ca
//   @MikeBusby
//
//
// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++

// Require Gulp, PostCSS plugins & Load Gulp plugins
var gulp            = require('gulp');
var path            = require('path');
var postcssImport   = require('postcss-import');
var cssnext         = require('postcss-cssnext');
var postcssNested   = require('postcss-nested');
var mixins          = require('postcss-sassy-mixins');
var conditionals    = require('postcss-conditionals')
var postcssAssets   = require('postcss-assets');
var easysprite      = require('postcss-easysprites');
var rucksack        = require('rucksack-css');
var cssnano         = require('cssnano');
var mqpacker        = require('css-mqpacker');
var gulpLoadPlugins = require('gulp-load-plugins');

// Rename some plugins
var plugins = gulpLoadPlugins({
  rename: { 'gulp-file-include': 'fileinclude' }
});

// Config Variables
var config = {
  srcPath:    'src/',
  buildPath:  'www/',
  staticPath: 'src/static/',
  tplPath:    'src/tpl/'
}

// HTML Compilation
gulp.task('html', function() {
  gulp.src([config.tplPath + '*.html'])
    .pipe(plugins.fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.buildPath));
});

// CSS Build
gulp.task('css', function() {
  return gulp.src(config.srcPath + '/css/main.css')
    .pipe(plugins.postcss([
      postcssImport(),
      cssnext({
        browsers: ['last 1 version']
      }),
      mixins(),
      postcssNested(),
      conditionals(),
      rucksack(),
      easysprite({
        imagePath: config.staticPath + 'sprite-img/',
        spritePath: config.buildPath + 'img/',
        stylesheetPath: config.buildPath + 'css/'
      }),
      cssnano(),
      mqpacker(),
      postcssAssets({
        basePath: config.staticPath,
        loadPaths: ['img', 'sprite-img']
      })
    ], { syntax: require('postcss-scss') }))
    .pipe(gulp.dest(config.buildPath + 'css/'));
});

// JavaScript Taks
gulp.task('scripts', function () {
  gulp.src([config.srcPath + 'js/**/*.js', !config.srcPath + 'www/js/*.min.js'])
    .pipe(plugins.uglify())
    .pipe(plugins.concat('main.min.js'))
    .pipe(gulp.dest(config.buildPath + 'js'));
});

// Inline SVG Icons
gulp.task('svgicons', function () {
  var svgs = gulp
    .src(config.staticPath + 'icons/*.svg')
    .pipe(plugins.svgmin(function(file) {
      var prefix = path.basename(file.relative, path.extname(file.relative));
      return {
        plugins: [{
          cleanupIDs: {
            prefix: prefix + '-',
            minify: true
          }
        }]
      }
    }))
    .pipe(plugins.svgstore({ inlineSvg: true }));

  function fileContents(filePath, file) {
    return file.contents.toString();
  }

  return gulp
    .src(config.staticPath + 'icons/_inline-icons.html')
    .pipe(plugins.inject(svgs, { transform: fileContents }))
    .pipe(gulp.dest(config.staticPath + 'icons/'));
});

// Web Server
gulp.task('webserver', function() {
  gulp.src(config.buildPath)
    .pipe(plugins.webserver({
      port: 1337,
      livereload: true
    }));
});

// Move Images to Build
gulp.task('copyimg', function () {
  gulp.src(config.staticPath + '/img/*')
    .pipe(gulp.dest(config.buildPath + 'img/'));
});

// Move Favicon to Build
gulp.task('copyfavicon', function () {
  gulp.src(config.staticPath + '/favicon/favicon.ico')
    .pipe(gulp.dest(config.buildPath));
});

// Watch File Changes
gulp.task('watch', function() {
  gulp.watch(config.tplPath + '**/*.html', ['html']);
  gulp.watch(config.srcPath + 'css/**/*.css', ['css']);
  gulp.watch(config.srcPath + 'js/**/*.js', ['scripts']);
  gulp.watch(config.staticPath + 'img/*.png', ['copyimg']);
  gulp.watch(config.staticPath + 'icons/*.svg', ['svgicons']);
});

// Run Tasks | $ gulp
gulp.task('default', [
  'html',
  'css',
  'scripts',
  'svgicons',
  'copyimg',
  'copyfavicon',
  'watch',
  'webserver'
]);
