//
// Set production env
//

module.exports = (config) => {
  return (cb) => {
    config.production = true;
    cb();
  }
}