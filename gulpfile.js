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

// Require Gulp, PostCSS plugins & load gulp plugins
var gulp             = require('gulp');
var path             = require('path');
var replace          = require('gulp-replace');
var argv             = require('yargs').argv
var ftp              = require('vinyl-ftp');
var postcssImport    = require('postcss-import');
var postcssPresetEnv = require('postcss-preset-env');
var postcssColorMod  = require('postcss-color-mod-function');
var postcssNested    = require('postcss-nested');
var mixins           = require('postcss-sassy-mixins');
var conditionals     = require('postcss-conditionals')
var postcssAssets    = require('postcss-assets');
var easysprite       = require('postcss-easysprites');
var rucksack         = require('rucksack-css');
var cssnano          = require('cssnano');
var mqpacker         = require('css-mqpacker');
var gulpLoadPlugins  = require('gulp-load-plugins');

// Include FTP config
//var ftpConfig = require('./ftp-config.json');

// Production plugins
var del         = require('del');
var runSequence = require('run-sequence');

// Image optimization plugins
var imagemin         = require('gulp-imagemin');
var imageminPngquant = require('imagemin-pngquant');
var imageminZopfli   = require('imagemin-zopfli');
var imageminMozjpeg  = require('imagemin-mozjpeg');
var imageminGiflossy = require('imagemin-giflossy');

// Rename some plugins
var plugins = gulpLoadPlugins({
  rename: { 
    'gulp-file-include': 'fileinclude',
    'gulp-if': 'gulpif'
  }
});

// Config variables
var config = {
  srcPath:    'src/',
  buildPath:  'www/',
  staticPath: 'src/static/',
  tplPath:    'src/tpl/',
  production: false
}

// Datestamp for cache busting
var getStamp = function () {
  var date = new Date();

  var year = date.getFullYear().toString();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  var seconds = date.getSeconds().toString();

  var timestamp = year + month + day + seconds;

  return timestamp;
};

// HTML build
gulp.task('html', function() {
  return gulp
    .src([
      config.tplPath + '**/*.html',
      '!' + config.tplPath + '_**/_*/',
      '!' + config.tplPath + '**/_*/**/*'
    ])
    .pipe(
      plugins.fileinclude({
        prefix: '@@',
        basepath: 'src/tpl/'
      })
    )
    .pipe(
      plugins.gulpif(
        config.production,
        plugins.htmlmin({ collapseWhitespace: true })
      )
    )
    .pipe(gulp.dest(config.buildPath));
});

// CSS build
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
      postcssColorMod(),
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

// JavaScript build
gulp.task('scripts', function () {
  return gulp.src([config.srcPath + 'js/**/*.js', !config.srcPath + 'www/js/*.min.js'])
    .pipe(plugins.gulpif(config.production, plugins.uglify()))
    .pipe(plugins.concat('main.min.js'))
    .pipe(gulp.dest(config.buildPath + 'js'));
});

// Inline SVG icons
gulp.task('svg-icons', function () {
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

// Web server
gulp.task('web-server', function() {
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

// Move images to build
gulp.task('copy-img', function () {
  return gulp.src(config.staticPath + '/img/*')
    .pipe(gulp.dest(config.buildPath + 'img/'));
});

// Move favicon to build
gulp.task('copy-favicon', function () {
  return gulp.src(config.staticPath + '/favicon/favicon.ico')
    .pipe(gulp.dest(config.buildPath));
});

// Watch file changes
gulp.task('watch', function() {
  gulp.watch(config.tplPath + '**/*.html', ['html']);
  gulp.watch(config.srcPath + 'css/**/*.css', ['css']);
  gulp.watch(config.srcPath + 'js/**/*.js', ['scripts']);
  gulp.watch(config.staticPath + 'img/*.png', ['copy-img']);
  gulp.watch(config.staticPath + 'icons/*.svg', ['svg-icons']);
});

// Set production to true
gulp.task('set-production', function() {
  return config.production = true;
});

// Delete build for production re-build
gulp.task('clean-build', function() {
  return del(config.buildPath);
});

// Move sever side .htaccess file to remove .html extensions | PRODUCTION ONLY
gulp.task('copy-htaccess', function () {
  gulp.src(config.srcPath + '.htaccess')
    .pipe(gulp.dest(config.buildPath));
});

// Minify images | PRODUCTION ONLY
gulp.task('minify-img', function() {
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

// Cache bust | PRODUCTION ONLY
gulp.task('bust', function() {
  return gulp.src(config.buildPath + '**/*.html')
    .pipe(replace(/main.css([0-9]*)/g, 'main.css?' + getStamp()))
    .pipe(replace(/favicon.ico([0-9]*)/g, 'favicon.ico?' + getStamp()))
    .pipe(replace(/main.min.js([0-9]*)/g, 'main.min.js?' + getStamp()))
    .pipe(gulp.dest(config.buildPath));
});

// Run dev tasks
gulp.task('default', function(callback) {
  runSequence(
    'css',
    'copy-img',
    'svg-icons',
    [
      'html',
      'scripts',
      'copy-favicon'
    ],
    'watch',
    'web-server',
    callback
  );
});

// Run production tasks
gulp.task('production', function(callback) {
  runSequence(
    'set-production',
    'clean-build',
    'css',
    'copy-img',
    'minify-img',
    'svg-icons',
    [ 
      'html', 
      'scripts', 
      'copy-favicon', 
      'copy-htaccess'
    ],
    'bust',
    callback
  );
});

// Gulp deployment task
gulp.task('deploy', function () {
  var ftpDest;

  if (argv.env === 'production') {
    var conn = ftp.create({
      host: ftpConfig.ftp.production.host,
      user: ftpConfig.ftp.production.user,
      password: ftpConfig.ftp.production.pass,
      parallel: 10
    });
    ftpDest = ftpConfig.ftp.production.dest;
  } else {
    var conn = ftp.create({
      host: ftpConfig.ftp.staging.host,
      user: ftpConfig.ftp.staging.user,
      password: ftpConfig.ftp.staging.pass,
      parallel: 10
    });
    ftpDest = ftpConfig.ftp.staging.dest;
  }

  var globs = [
    'css/**',
    'img/**',
    'js/**',
    'fonts/**',
    'favicon.ico',
    '.htaccess',
    '**/*.html'
  ];

  return gulp.src(globs, {
    base: './www',
    cwd: './www',
    buffer: false
  })
    .pipe(conn.dest(ftpDest));
});