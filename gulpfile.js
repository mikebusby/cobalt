// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++
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
//   @mikebusby
//
//
// ++ ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~ ++

// Require Gulp & Plugins
var gulp            = require("gulp");
var gulpLoadPlugins = require("gulp-load-plugins");
var neat            = require('node-neat').includePaths;

// Rename some plugins
var plugins = gulpLoadPlugins({
  rename: {
    "gulp-sass": "sass",
    "gulp-bower": "bower",
    "gulp-file-include": "fileinclude"
  }
});

// Config Variables
var config = {
  srcPath:   "src/",
  buildPath: "www/",
  tplPath:   "src/tpl/"
}

// Output errors to console
function errorLog(error) {
  console.error.bind(error);
  plugins.notify().write(error);
  this.emit("end");
}



//
// HTML Compliation
//
gulp.task('html', function() {
  gulp.src([config.tplPath + "*.html"])
    .pipe(plugins.fileinclude({
      prefix: '@@',
      basepath: '@file'
    }))
    .pipe(gulp.dest(config.buildPath));
});



//
// JavaScript Taks
//
gulp.task("scripts", function() {
  gulp.src([config.srcPath + "js/*.js", !config.srcPath + "www/js/*.min.js"])
    .pipe(plugins.uglify())
    .on("error", errorLog)
    .pipe(plugins.concat("main.min.js"))
    .pipe(gulp.dest(config.buildPath + "js"));
});



//
// SCSS Compliation
//
gulp.task("styles", function() {
  gulp.src(config.srcPath + "scss/*.scss")
    .pipe(plugins.sourcemaps.init())
    .pipe(plugins.sass({
      outputStyle: "compressed",
      includePaths: ["styles"].concat(neat)
    }))
    .pipe(plugins.sourcemaps.write("/"))
    .on("error", errorLog)
    .pipe(gulp.dest(config.buildPath + "css"));
});



//
// Web Server
//
gulp.task("webserver", function() {
  gulp.src(config.buildPath)
    .pipe(plugins.webserver({
      port: 1337,
      livereload: true
    }));
});



//
// Move Images to build
//
gulp.task("copyimg", function() {
  gulp.src(config.srcPath + "/img/*")
  .pipe(gulp.dest(config.buildPath + "img/"));
});



//
// Move Bower pkg's to build (some needed)
//
gulp.task("copyvendor", function() {
  gulp.src("vendor/**/*")
  .pipe(gulp.dest(config.buildPath + "vendor/"));
});



//
// Watch File changes
//
gulp.task("watch", function() {
  gulp.watch(config.srcPath + "img/*", ["copyimg"]);
  gulp.watch(config.srcPath + "vendor/*", ["copyvendor"]);
  gulp.watch(config.srcPath + "js/*.js", ["scripts"]);
  gulp.watch(config.srcPath + "scss/**/*.scss", ["styles"]);
  gulp.watch(config.tplPath + "**/*.html", ["html"]);
});



//
// Run Tasks | $ gulp
//
gulp.task("default", [
  "html",
  "scripts",
  "styles",
  "copyimg",
  "copyvendor",
  "watch",
  "webserver"
]);