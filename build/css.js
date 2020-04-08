//
// PostCSS build task
//

// Include PostCSS plugins
const postcssImport = require('postcss-import');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const mixins = require('postcss-sassy-mixins');
const conditionals = require('postcss-conditionals')
const postcssAssets = require('postcss-assets');
const easysprite = require('postcss-easysprites');
const rucksack = require('rucksack-css');
const cssnano = require('cssnano');
const mqpacker = require('css-mqpacker');

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream =
      gulp.src(config.srcPath + '/css/main.css')
      .pipe(plugins.postcss([
        postcssImport(),
        postcssPresetEnv({
          stage: 1,
          features: {
            'custom-properties': {
              preserve: false
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

    return stream;
  }
}