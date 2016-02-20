# grunt-qunit-kimchi
> Grunt QUnit Plugin with Screenshot Support and Style Regression Test.

| Circle CI |
| --------- |
| [![Circle CI](https://circleci.com/gh/blueapron/grunt-qunit-kimchi/tree/master.svg?style=svg&circle-token=917739f06228f3a744e9fc5197f8f18809c3e915)](https://circleci.com/gh/blueapron/grunt-qunit-kimchi/tree/master) |

## Getting Started
This plugin requires ```Grunt >= 0.4.0```

If you haven't used [Grunt](http://gruntjs.com) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a Gruntfile as well as install and use Grunt plugins.

## Install
```
$ npm install --save-dev grunt-qunit-kimchi
```
## Usage
```javascript
// Load the task
grunt.loadNpmTasks('grunt-phantomjs-basil');

// Configure
grunt.initConfig({
  qunit: {
    options: {
      urls: [
       'http://localhost:4100'
      ],
      screenshotOnFail: true,
      viewportSize: {
       width: 1100,
       height: 768
      },
      screenshotPath: '.tmp/screenshots',
      originalScreenshotPath: '.tmp/original_screenshots',
      diffScreenshotPath: '.tmp/diff_screenshots',
      errorDiffPath: '.tmp/screenshots/error',
      resemble: {
       errorType: 'movement'
      }
    }
  }
});

```

## Qunit Task
Running task: ```grunt qunit```

### Options
- [urls](#urls)
- [timeout](#timeout)
- [viewportSize](#viewportsize)
- [screenshotPath](#screenshotpath)
- [originalScreenshotPath](#originalscreenshotpath)
- [diffScreenshotPath](#diffscreenshotpath)
- [resemble](#resemble)
- [inject](#inject)
- [consoleOutput](#consoleoutput)
- [screenshotOnFail](#screenshotonfail)
- [httpBase](#httpbase)
- [force](#force)
- [--PhantomJS arguments](#--phantomjs-arguments)

#### urls
Type: ```Array``` <br />
Default: ```[]```

#### timeout
Type: ```Integer``` <br />
Default: ```5000```

#### viewportSize
Type: ```Object``` <br />
Default: ```null```

Overrides default viewport size of phantomjs (width: 320px)
Example:
```javascript
viewportSize: {
  width: 1100,
  height: 768
}
```

#### screenshotPath
Type: ```String``` <br />
Default: ```"screenshots"```

Path where screenshots are saved within the root folder of the project

#### originalScreenshotPath
Type: ```String``` <br />
Default: ```null```

Path where original screenshots are stored within the root folder of the project to compare with the screenshots under ```screenshotPath```

#### diffScreenshotPath
Type: ```String``` <br />
Default: ```null```

Path where diff screenshots generated with resemble.js are saved within the root folder of the project

#### resemble
Type: ```Boolean``` or ```Object``` <br />
Default: ```null```

Uses resemble.js for screenshot image analysis and comparison
[https://huddle.github.io/Resemble.js/](https://huddle.github.io/Resemble.js/)

Example:
```javascript
resemble: {
  errorColor: {
    red: 255,
    green: 0,
    blue: 255
  },
  errorType: 'movement' || 'flat',
  transparent: 1.0
}
```

#### inject
Type: ```String``` <br />
Default: (built in)

Path to alternate QUnit bridge to phantomjs. Default built in bridge script:  [bridge.js](https://github.com/blueapron/grunt-qunit-kimchi/blob/master/phantomjs/bridge.js)

#### consoleOutput
Type: ```Boolean``` <br />
Default: ```false```

#### screenshotOnFail
Type: ```Boolean``` <br />
Default: ```false```

#### httpBase
Type: ```String``` <br />
Default: ```null```

Create URLs for the src files, all src files are prefixed with that base.

#### force
Type: ```Boolean``` <br />
Default: ```false```

#### --PhantomJS arguments
Type: ```String``` <br />
Example:
```javascript
options: {
  '--config': '/path/to/config.json'
  '--ssl-protocol': 'sslv3'
}
```

# Usage Examples

# Release History
