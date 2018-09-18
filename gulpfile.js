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
//   hello@mikebusby.email
//   @MikeBusby
//
//
// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++

// Require Gulp, PostCSS plugins & Load Gulp plugins
var gulp             = require('gulp');
var path             = require('path');
var postcssImport    = require('postcss-import');
var postcssPresetEnv = require('postcss-preset-env');
var postcssNested    = require('postcss-nested');
var mixins           = require('postcss-sassy-mixins');
var conditionals     = require('postcss-conditionals')
var postcssAssets    = require('postcss-assets');
var easysprite       = require('postcss-easysprites');
var rucksack         = require('rucksack-css');
var cssnano          = require('cssnano');
var mqpacker         = require('css-mqpacker');
var gulpLoadPlugins  = require('gulp-load-plugins');

// Production plugins
var del         = require('del');
var runSequence = require('run-sequence');

// Image optimization plugins
var imagemin         = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli   = require('imagemin-zopfli');
var imageminMozjpeg  = require('imagemin-mozjpeg');
var imageminGiflossy = require('imagemin-giflossy');

// Development development plugins
var ftp = require('vinyl-ftp');

// Rename some plugins
var plugins = gulpLoadPlugins({
  rename: { 
    'gulp-file-include': 'fileinclude',
    'gulp-if': 'gulpif'
  }
});

// Config Variables
var config = {
  srcPath:    'src/',
  buildPath:  'www/',
  staticPath: 'src/static/',
  tplPath:    'src/tpl/',
  production: false
}

// FTP Config
var ftpConfig = {
  host:     '',
  user:     '',
  password: '',
  parallel: 10
}

// HTML Compilation
gulp.task('html', function() {
  gulp.src([config.tplPath + '*.html'])
    .pipe(plugins.fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(plugins.gulpif(config.production, plugins.htmlmin({collapseWhitespace: true})))
    .pipe(gulp.dest(config.buildPath));
});

// CSS Build
gulp.task('css', function() {
  return gulp.src(config.srcPath + '/css/main.css')
    .pipe(plugins.postcss([
      postcssImport(),
      postcssPresetEnv({
        stage: 1,
        features: {
          'custom-properties': {
            preserve: false,
            warnings: true
          }
        }
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
    .pipe(plugins.gulpif(config.production, plugins.uglify()))
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
      middleware: function (req, res, next) {
        if (
            req.url.indexOf('css') >= 0 || 
            req.url.indexOf('js') >= 0 || 
            req.url.indexOf('img') >= 0 ||
            req.url.indexOf('favicon.ico') >= 0
          ) {
          next();
          return
        }
        if (req.url === '/') {
          req.url = '/index';
        }
        const url = req.url + '.html';
        req.url = url;
        next();
      },
      port: 1337,
      livereload: true
    }));
});

// Move Images to Build
gulp.task('copyimg', function () {
  return gulp.src(config.staticPath + '/img/*')
    .pipe(gulp.dest(config.buildPath + 'img/'));
});

// Move Favicon to Build
gulp.task('copyfavicon', function () {
  return gulp.src(config.staticPath + '/favicon/favicon.ico')
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

// Set production to true
gulp.task('set-production', () => {
  return config.production = true;
});

// Delete build for production re-build
gulp.task('clean-build', function() {
  return del(config.buildPath);
});

// Move sever side .htaccess file to remove .html extensions | PRODUCTION ONLY
gulp.task('copyhtaccess', function () {
  gulp.src(config.srcPath + '.htaccess')
    .pipe(gulp.dest(config.buildPath));
});

// Minify Images | PRODUCTION ONLY
gulp.task('minifyimg', function() {
  return gulp.src(config.buildPath + '/img/*')
    .pipe(imagemin([
      imageminPngquant({
        speed: 1,
        quality: 90
      }),
      imageminZopfli({
        more: true
      }),
      imageminGiflossy({
        optimizationLevel: 3,
        optimize: 3,
        lossy: 2
      }),
      imagemin.jpegtran({
        progressive: true
      }),
      imageminMozjpeg({
        quality: 80
      })
    ]))
    .pipe(gulp.dest(config.buildPath + 'img/'));
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

// Run Tasks | $ gulp production
gulp.task('production', function(callback) {
  runSequence(
    'set-production',
    'clean-build',   
    'css',     
    'copyimg',
    'minifyimg',
    ['html', 'scripts', 'svgicons', 'copyfavicon', 'copyhtaccess'],
    callback);
});

// Deploy to remote dev server | $ gulp deploy
gulp.task('deploy', function () {
  var conn = ftp.create({
    host:     ftpConfig.host,
    user:     ftpConfig.user,
    password: ftpConfig.password,
    parallel: ftpConfig.parallel
  });

  var globs = [
    'css/**',
    'img/**',
    'js/**',
    'fonts/**',
    'favicon.ico',
    '.htaccess',
    '**/*.html'
  ];

  return gulp.src(globs, { base: './www', cwd: './www', buffer: false })
    .pipe(conn.dest('/'));
});