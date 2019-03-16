<img src="http://assets.busby.design/img/cobalt-logo.png" width="351" height="99">

# Cobalt Build Framework

Cobalt is a simple build framework for building static projects. Built by @MikeBusby

## Using

 - Gulp  
 - PostCSS  
 - PostCSS Assets  
 - PostCSS Easy sprite  
 - CSS Next  
 - Rucksack CSS  
 - CSS Nano  
 - Media Query Packer  

PostCSS SCSS like plugins:  
 - Import  
 - Nested  
 - Mixins  
 - Conditionals  

## Installation

Node & Yarn need to be installed

## Examples

```sass
.arrow {
  // Using PostCSS Assets to get dimension of asset
  width: width('sprite-img/arrow.png');
  height: height('sprite-img/arrow.png');
  
  // PostCSS Easysprite use the hash and URL doesn't need sprite-img/
  background-image: url('/arrow.png#sprite');

  // Simple retina mixin just outputs media query with content
  @include retina-img {
    background-image: url('/arrow@2x.png#sprite');
  }
  
} // .arrow
```

## Usage

```yarn install```

Run ```yarn run dev``` and navigate to ```http://localhost:1337```

For a production ready build run ```yarn run build-production```

## FTP Deployment

Copy ftp-config.json.example, remove the .example extension and add your server credentials. For security reasons you should not commit the FTP config file. It will be excluded from the repo automaticaly. Make sure to run ```yarn run build-production``` before deloying to a server.

For staging ```yarn run deploy-staging```

For production ```yarn run deploy-production```

## License

MIT.
