# grunt-messageformat-amd

> Compile [MessageFormat](https://github.com/SlexAxton/messageformat.js) JSON files to JS AMD files.

## Getting Started

This plugin requires Grunt `~0.4.2`

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install git://github.com/morkai/grunt-messageformat-amd --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-messageformat-amd');
```

## The "messageformatAmd" task

_Run this task with the `grunt messageformatAmd` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### options.destDir

Type: `String`
Default value: `nls/`

A path to a directory where the wrapped JS AMD MessageFormat files should be written to.

#### options.localeModulePrefix

Type: `String`
Default value: `nls/locale/`

A module path prefix to the locale AMD files generated through the `messageformatAmdLocale` task.

```js
define([options.localeModulePrefix + locale], function(locale) { return <...>; });
```

#### options.rootLocale

Type: `String`
Default value: `en`

The `root` locale will be replaced with the specified one.

#### options.resolveLocaleAndDomain

Type: `Function(String): {{locale: String, domain: String}}`
Default value: `null`

A function that takes a path to the MessageFormat JSON file and should return an
object with the `locale` and the `domain` properties extracted from the specified
JSON file path.

The default implementation expects the following directory structure:

  - `module-a/`
  - `module-b/`
  - `nls/`
    - `module-a.json`
    - `module-b.json`
    - `pl/`
      - `module-a.json`
      - `module-b.json`

and will result in the following objects for the specific JSON files:

  - `nls/module-a.json`: `{locale: 'root', domain: 'module-a'}`
  - `nls/module-b.json`: `{locale: 'root', domain: 'module-b'}`
  - `nls/pl/module-a.json`: `{locale: 'pl', domain: 'module-a'}`
  - `nls/pl/module-b.json`: `{locale: 'pl', domain: 'module-b'}`

#### options.includeJs

Type: `String`
Default value: Contents of the `messageformat/lib/messageformat.include.js` file, if it can
be resolved; `null` otherwise.

JavaScript code to include between the locale definition and the returned translation messages
in the compiled file.

Used to include a common JS code required by the messageformat.js module since version 0.1.8.

### Usage Examples

```js
grunt.initConfig({
  messageformatAmd: {
    frontend: {
      expand: true,
      cwd: './build/frontend',
      src: 'app/**/nls/*.json',
      ext: '.js',
      options: {
        destDir: './build/frontend/app/nls',
        localeModulePrefix: 'app/nls/locale/',
        rootLocale: 'en',
        resolveLocaleAndDomain: function(jsonFile)
        {
          var matches = jsonFile.match(/app\/(.*?)\/nls\/(.*?)\.json/);

          if (matches === null)
          {
            throw new Error("Invalid MessageFormat JSON file: " + jsonFile);
          }

          return {
            locale: matches[2],
            domain: matches[1]
          };
        }
      }
    }
  },
})
```

Executing:

```
grunt messageformatAmd:frontend
```

will convert all `app/<domain>/nls/<locale>.json` MessageFormat JSON files
under the `./build/frontend` directory to AMD format and write them to:

  - `./build/frontend/app/nls/<domain>.js` if the `<locale>` is `root` or `en` (the `rootLocale`),
  - `./build/frontend/app/nls/<locale>/<domain>.js` if the `<locale>` is not `root` nor `en`.

## The "messageformatAmdLocale" task

_Run this task with the `grunt messageformatAmdLocale` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.

### Options

#### options.srcDir

Type: `String`
Default value: `null`

A path to a directory with the JS locale files.
If `null`, `require.resolve('messageformat/locale/' + locale)` is used;
otherwise `path.join(options.srcDir, locale + '.js')` is used (where `locale`
is one of the values of the `options.locales` array).

#### options.destDir

Type: `String`
Default value: `nls/locale`

A path to a directory where the wrapped JS AMD locale files should be written to.

#### options.locales

Type: `Array.<String>`
Default value: `['en']`

An array of locales to convert to JS AMD format.

### Usage Examples

```js
grunt.initConfig({
  messageformatAmdLocale: {
    frontend: {
      options: {
        locales: ['en', 'pl'],
        destDir: './build/frontend/app/nls/locale'
      }
    }
  },
})
```

Executing:

```
grunt messageformatAmdLocale:frontend
```

will wrap `messageformat/locale/en.js` and `messageformat/locale/pl.js` files
and write them to `./build/frontend/app/nls/locale/en.js` and
`./build/frontend/app/nls/locale/pl.js` respectively.

## Release History

_(Nothing yet)_

## License

This project is released under the
[MIT License](https://raw.github.com/morkai/grunt-messageformat-amd/master/LICENSE-MIT).
