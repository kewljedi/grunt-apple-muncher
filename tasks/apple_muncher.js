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
