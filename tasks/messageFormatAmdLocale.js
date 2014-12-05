// Copyright (c) 2014, Łukasz Walukiewicz <lukasz@walukiewicz.eu>. Some Rights Reserved.
// Licensed under the MIT License <http://opensource.org/licenses/MIT>.
// Part of the grunt-messageformat-amd project <http://lukasz.walukiewicz.eu/p/grunt-messageformat-amd>

'use strict';

var path = require('path');
var localeLib = require('messageformat-amd').localeLib;

module.exports = function(grunt)
{
  grunt.registerMultiTask('messageformatAmdLocale', 'Compile MessageFormat locale files to JS AMD files.', function()
  {
    var options = this.options({
      locales: ['en'],
      srcDir: null,
      destDir: 'nls/locale'
    });

    options.locales.forEach(function(locale)
    {
      grunt.verbose.write("Resolving " + locale + " locale...");

      var localeFile;

      try
      {
        localeFile = localeLib.resolveFile(options.srcDir, locale);
      }
      catch (err)
      {
        grunt.fatal(err);
      }

      grunt.verbose.ok();

      var localeJs = grunt.file.read(localeFile);
      var wrappedLocaleJs = localeLib.wrap(localeJs);
      var wrappedLocaleFile = path.join(options.destDir, locale + '.js');

      grunt.file.write(wrappedLocaleFile, wrappedLocaleJs);
    });
  });
};
