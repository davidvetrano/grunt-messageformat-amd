'use strict';

var readFileSync = require('fs').readFileSync;
var path = require('path');
var nlsLib = require('messageformat-amd').nlsLib;

module.exports = function(grunt)
{
  grunt.registerMultiTask('messageformatAmd', 'Compile MessageFormat JSON files to JS AMD files.', function()
  {
    var options = this.options({
      destDir: 'nls/',
      localeModulePrefix: 'nls/locale/',
      rootLocale: 'en',
      resolveLocaleAndDomain: resolveLocaleAndDomain,
      includeJs: null
    });

    if (typeof options.includeJs !== 'string')
    {
      options.includeJs = resolveDefaultIncludeJs();
    }

    this.files.forEach(function(f)
    {
      f.src
        .filter(function(filepath)
        {
          if (grunt.file.exists(filepath))
          {
            return true;
          }

          grunt.log.warn("MessageFormat JSON file not found: " + filepath);

          return false;
        })
        .forEach(function(filepath)
        {
          var nlsJson = grunt.file.read(filepath);
          var localeAndDomain;

          try
          {
            localeAndDomain = options.resolveLocaleAndDomain(filepath);
          }
          catch (err)
          {
            grunt.fatal(err);
          }

          grunt.verbose.write('Compiling... ');
          grunt.verbose.writeflags(localeAndDomain);

          if (localeAndDomain.locale === 'root')
          {
            localeAndDomain.locale = options.rootLocale;
          }

          var nlsJs;

          try
          {
            nlsJs = nlsLib.compileObject(
              localeAndDomain.locale, JSON.parse(nlsJson)
            );
          }
          catch (err)
          {
            grunt.fatal(err);
          }

          var wrappedNlsJs = nlsLib.wrap(
            options.localeModulePrefix,
            localeAndDomain.locale,
            nlsJs,
            options.includeJs
          );

          var wrappedNlsFile = localeAndDomain.locale === options.rootLocale
            ? path.join(options.destDir, localeAndDomain.domain + '.js')
            : path.join(
                options.destDir,
                localeAndDomain.locale,
                localeAndDomain.domain + '.js'
              );

          grunt.file.write(wrappedNlsFile, wrappedNlsJs);
        });
    });
  });

  /**
   * @private
   * @param {string} jsonFile
   * @returns {{locale: string, domain: string}}
   */
  function resolveLocaleAndDomain(jsonFile)
  {
    var locale = path.basename(path.dirname(jsonFile));

    return {
      locale: locale === 'nls' ? 'root' : locale,
      domain: path.basename(jsonFile, '.json')
    };
  }

  /**
   * @private
   * @returns {string|null}
   */
  function resolveDefaultIncludeJs()
  {
    var includeJs = null;

    try
    {
      includeJs = readFileSync(
        require.resolve('messageformat/lib/messageformat.include.js'),
        'utf8'
      );
    }
    catch (err)
    {
      grunt.log.warn("Couldn't resolve a default value for the includeJs option: " + err.message);
    }

    return includeJs;
  }
};
