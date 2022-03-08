# Cobalt Build Framework

Cobalt is a simple build framework for building static projects. Built by @MikeBusby

## Using

 - Gulp 4
 - Nunjucks
 - Tailwind CSS
 - PostCSS (Or SCSS)

## Installation

Node & Yarn need to be installed

## Usage

```yarn install```

Run ```yarn run dev``` and navigate to ```http://localhost:1337```

For a production ready build run ```yarn run build:production```

## FTP Deployment

Copy ftp-config.json.example, remove the .example extension and add your server credentials. For security reasons you should not commit the FTP config file. It will be excluded from the repo automaticaly. Make sure to run ```yarn run build:production``` before deloying to a server.

For staging ```yarn run deploy:staging```

For production ```yarn run deploy:production```

## License

MIT.
