//
// Deployment task
//

// Include plugins
const argv = require('yargs').argv
const ftp  = require('vinyl-ftp');
const fs   = require('fs');

module.exports = function(gulp) {
  return function() {
    let ftpDest, conn;
    let ftpConfig = JSON.parse(fs.readFileSync('./ftp-config.json', 'utf8'));

    if (argv.env === 'production') {
      conn = ftp.create({
        host: ftpConfig.ftp.production.host,
        user: ftpConfig.ftp.production.user,
        password: ftpConfig.ftp.production.pass,
        parallel: 10
      });
      ftpDest = ftpConfig.ftp.production.dest;
    } else {
      conn = ftp.create({
        host: ftpConfig.ftp.staging.host,
        user: ftpConfig.ftp.staging.user,
        password: ftpConfig.ftp.staging.pass,
        parallel: 10
      });
      ftpDest = ftpConfig.ftp.staging.dest;
    }

    const globs = [
      'css/**',
      'img/**',
      'js/**',
      'favicon.ico',
      '.htaccess',
      '**/*.html'
    ];

    gulp.src(globs, {
      base: './www',
      cwd: './www',
      buffer: false
    }).pipe(conn.dest(ftpDest));
  }
}