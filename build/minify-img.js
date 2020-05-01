//
// Image minification task
//

// Include image optimization plugins
const imagemin = require('gulp-imagemin');
const imageminPngquant = require('imagemin-pngquant');
const imageminZopfli = require('imagemin-zopfli');
const imageminMozjpeg = require('imagemin-mozjpeg');
const imageminGiflossy = require('imagemin-giflossy');

module.exports = (gulp, config) => {
  return () => {
    const stream =
      gulp.src(config.BUILD_PATH + '/img/*')
        .pipe(imagemin([
          imageminPngquant({
            speed: 1,
            quality: [0.8, 0.9],
          }),
          imageminZopfli({
            more: true,
          }),
          imageminGiflossy({
            optimizationLevel: 3,
            optimize: 3,
            lossy: 2,
          }),
          imagemin.jpegtran({
            progressive: true,
          }),
          imageminMozjpeg({
            quality: 80,
          }),
        ]))
        .pipe(gulp.dest(config.BUILD_PATH + 'img/'));
        
    return stream;
  }
}
