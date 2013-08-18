'use strict';

var grunt = require('grunt'),
    im    = require('node-imagemagick'),
    async = require('async');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/
/*
function check_file(size, filename, test) {

    filename = filename.replace("{0}",size).replace("{0}",size);
    test.equal(grunt.file.exists(filename),true,"File was not created: " + filename); 
    var file = false;
    
    im.identify(filename, function(err, features) {
      test.ok( false, "error hit");
      if(err){
        file = false;
      } else {
        file = true;
        test.equal( features.width, size, "File width is not correct! Expected: " + size + " in " + filename);
        test.equal( features.height, size, "File height is not correct! Expected: " + size + " in " + filename);
        test.equal( features.format, "PNG", "File is not of the right format! Expected: PNG in " + filename);
      }
    });

    test.ok(file,"file not tested: " + filename);
}

*/ 
    var check_file = function(size,filename,test){
      return function(callback){
        filename = filename.replace("{0}",size).replace("{0}",size);
        test.equal(grunt.file.exists(filename),true,"File was not created: " + filename); 
        var file = false;

        im.identify(filename, function(err, features) {
          if(err){
            file = false;
          } else {
            file = true;
            test.equal( features.width, size, "File width is not correct! Expected: " + size + " in " + filename);
            test.equal( features.height, size, "File height is not correct! Expected: " + size + " in " + filename);
            test.equal( features.format, "PNG", "File is not of the right format! Expected: PNG in " + filename);
          }
          callback();
        });
      };
    };
   
   
exports.apple_muncher = {
  setUp: function(done) {
    // setup here if necessary
   
    done();
  },
  default_options: function(test) {
    test.expect(16);
 
    var path = "dest/apple-touch-icon-{0}x{0}.png";
    
    async.series([
      check_file( 57, path, test),
      check_file( 72, path, test),
      check_file( 114, path, test),
      check_file( 144, path, test),
    ], test.done);


  },
  custom_options: function(test) {
    test.expect(16);

    var path = "dest/apple-touch-icon-{0}x{0}-precomposed.png"; 
     async.series([
      check_file( 57, path, test),
      check_file( 72, path, test),
      check_file( 114, path, test),
      check_file( 144, path, test),
    ], test.done);
  }
};
