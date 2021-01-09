//
// PostCSS build task
//

// Include PostCSS plugins
const postcssImport = require('postcss-import');
const postcssTailwind = require('tailwindcss');
const postcssPresetEnv = require('postcss-preset-env');
const postcssNested = require('postcss-nested');
const postcssCombinemq = require('postcss-combine-media-query');
const mixins = require('postcss-sassy-mixins');
const conditionals = require('postcss-conditionals')
const cssnano = require('cssnano');
const autoprefixer = require('autoprefixer');

module.exports = (gulp, plugins, config) => {
  return () => {
    const stream =
      gulp.src(`${config.SRC_PATH}css/main.css`)
      .pipe(plugins.postcss([
        postcssImport(),
        postcssTailwind(),
        postcssPresetEnv({
          stage: 1,
          features: {
            'custom-properties': {
              preserve: false,
            },
          },
        }),
        postcssNested(),
        postcssCombinemq(),
        mixins(),
        conditionals(),
        cssnano(),
        autoprefixer(),
      ], { syntax: require('postcss-scss') }))
      .pipe(gulp.dest(`${config.BUILD_PATH}css/`));

    return stream;
  }
}
