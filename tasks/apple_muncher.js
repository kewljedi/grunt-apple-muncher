/*
 * grunt-apple-muncher
 * https://github.com/kewljedi/grunt-apple-muncher
 *
 * Copyright (c) 2013 Donald Perry
 * Licensed under the MIT license.
*/

'use strict';

var async = require('async');

module.exports = function(grunt) {

  // Please see the Grunt documentation for more information regarding task
  // creation: http://gruntjs.com/creating-tasks
  grunt.registerMultiTask('munch_apple_touch_startup_image', 'Generates Apple startup Images from a single source.', function() {
    //figure I at least need to get some of my ideas out of my head.
    
    var done = this.async();
 
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      src : 'apple-touch-icon.png',
      dest : 'dest/',
      partial: 'dest/partials/startup.html'
    });


    var outputpartial = String();
    if(options.partial)
    {
      outputpartial += '<meta name="apple-mobile-web-app-capable" content="yes" />\n';
    }

    //yes, I think I will need all of this... that way changes in the future are easier.
    var startupsizes = [
      { height:320, width:460, dw:320, retina:false, orientation:'both' },
      { height:640, width:920, dw:320, retina:true, orientation:'both' },
      { height:768, width:1004, dw:768, retina:false, orientation:'portrait' },
      { height:748, width:1024, dw:768, retina:false, orientation:'landscape' },
      { height:1536, width:2008, dw:1536, retina:true, orientation:'portrait' },
      { height:2048, width:1496, dw:1536, retina:true, orientation:'landscape' },
    ];

    async.forEach( 
      startupsizes, 
      function(f, callback) {
    
        var filename = options.dest + 'apple-touch-startup-image-' + f.height + 'x' + f.width + '.png';


        //if they asked for a partial file to be generated figure out what we need to add for this size.
        if(options.partial)
        {
          //yes I feel the link needs to be written out dynamically even though I will most likely test it against a static file.
          //I think this will allow for more features or easier changes in the future.
          var linktext = '<link href="';
          linktext += filename;
          linktext += '" media="screen and (min-device-width: '+ f.dw + 'px)';

          if(f.orientation !== 'both')
          {
            linktext += ' and (orientation: '+ f.orientation + ')';
          }

          if(f.retina)
          {
            linktext += ' and (-webkit-min-device-pixel-ratio: 2)';
          }

          linktext += '" rel="apple-touch-startup-image" />';
          outputpartial += linktext + '\n';
        }


        callback(null);

      }, 
      function(err) {
        if(err) {
          grunt.log.error(err.message);
        }
        if(options.partial){
          grunt.file.write(options.partial, outputpartial);
        }
        done();
      } 
    );
  
  });


  grunt.registerMultiTask('munch_webclip_icons', 'Generates apple-touch-icons from a single source file.', function() {
 
    var done = this.async();
    
    // Merge task-specific and/or target-specific options with these defaults.
    var options = this.options({
      src : 'apple-touch-icon.png',
      dest : 'dest/',
      precomposed: false
    });

    //I really want some errors that are going to tell the user what this task really needs so.
    function InputError () {
      Error.call(this);

      this.name = 'source file error';
      this.message  = 'the options.src file must exist and be readable as a PNG file at 144x144';
      this.code  = 949;
      Error.captureStackTrace(this, this.constructor);

    }

    var im = require('node-imagemagick');
    var fs = require('fs');
    
    var iconsizes = [57, 72, 114, 144];
    
    grunt.verbose.writeln('starting ' + options.src);

    fs.stat( options.src,   function (err, stat) {
      if(err){
        if( err.code === 'ENOENT')
          { 
            grunt.log.error(options.src + ' is missing');
            throw new InputError();
          } else {
            grunt.log.error(err.message);
            throw err;
          }
      }
      im.identify(options.src, function(err,features){
        if(err){
          grunt.log.error(err.message);
          throw err;
        }
        if( features.format === "PNG"){
          grunt.verbose.writeln('PNG File Detected');
        } else {
          grunt.log.error(options.src + " must be a png image not a " + features.format);
          throw new InputError();
        }
        if(parseInt(features.width,10) < 144) {
          grunt.log.error(options.src + " must be more than 144 pixels");
          throw new InputError();
        } else {
          if(features.height === features.width){
            grunt.verbose.writeln('Correct File Size Detected');
          }else {
            grunt.log.error(options.src + " must be a square!");
            throw new InputError();
          }
        }

        fs.stat( options.dest, function (err,stat){
          if(err){
            if(err.code === 'ENOENT') {
              grunt.verbose.writeln(options.dest + " is being created!");
              fs.mkdirSync(options.dest);
            } else {
              grunt.log.error(err.message);
              throw err;
            }
          }

          //lets start some work 
          async.forEach(iconsizes, function(f ,callback ){
            var outputname =  options.dest + 'apple-touch-icon-' + f.toString() + 'x' + f.toString();
            grunt.verbose.writeln( options.precomposed );
            if(options.precomposed === true)
            {
              outputname += '-precomposed';
            }
            outputname += '.png';

            grunt.verbose.writeln('File "' + outputname + '" is about to be created.' );
            var imagemagickoptions = {width: f, height: f, srcPath: options.src, dstPath: outputname,format: 'PNG'};

            im.resize( imagemagickoptions, function(err){
              if(err) {
                grunt.log.error(outputname + 'could not be created');
              } else {
                err = null;
              }
              grunt.verbose.writeln(outputname + ' was created.');
              callback(err);
            }); 
          },function(err)
          {
            if(err){
              grunt.log.error(err.message);
            }
            done();
          });
        });
      });
    });
  });
};
