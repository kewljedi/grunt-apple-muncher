# grunt-apple-muncher

> Creates apple-touch-icon files from a single file

## Getting Started
This plugin requires Grunt `~0.4.1`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-apple-muncher --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-apple-muncher');
```

## The "apple_muncher" task

### Overview
In your project's Gruntfile, add a section named `apple_muncher` to the data object passed into `grunt.initConfig()`.

```js
grunt.initConfig({
  apple_muncher: {
    options: {
      // Task-specific options go here.
    },
    your_target: {
      // Target-specific file lists and/or options go here.
    },
  },
})
```

### Options

#### options.precomposed
Type: 'Boolean'
Default value: false

A value true will create files with precomposed in the file name which will prevent IOS from adding Rounded Corners, Drop Shadow, and Reflective Shine to your icon.


#### options.dest
Type: `String`
Default value: `dest/`

A string value indicating the path of the directory that will contain the generated files.

#### options.src
Type: `String`
Default value: `apple-touch-icon.png`

A string value that indicates the name of the file to be used as the bases for creating the other files. This file must be:
- 144x144 pixels
- a png 

### Usage Examples

#### Default Options
In this example, the default options are used to do something with whatever. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result would be `Testing, 1 2 3.`

```js
grunt.initConfig({
  apple_muncher: {
    options: {},
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

#### Custom Options
In this example, custom options are used to do something else with whatever else. So if the `testing` file has the content `Testing` and the `123` file had the content `1 2 3`, the generated result in this case would be `Testing: 1 2 3 !!!`

```js
grunt.initConfig({
  apple_muncher: {
    options: {
      separator: ': ',
      punctuation: ' !!!',
    },
    files: {
      'dest/default_options': ['src/testing', 'src/123'],
    },
  },
})
```

## Contributing
In lieu of a formal styleguide, take care to maintain the existing coding style. Add unit tests for any new or changed functionality. Lint and test your code using [Grunt](http://gruntjs.com/).

## Release History
_(Nothing yet)_
