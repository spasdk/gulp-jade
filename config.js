/**
 * Configuration for jade gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path   = require('path'),
    extend = require('extend'),
    config = require('spa-gulp/config');


// base config
// each profile inherits all options from the "default" profile
module.exports = extend(true, {}, config, {
    default: {
        // directory to look for source files
        sourcePath: path.join(config.default.sourcePath, 'jade'),

        // main source entry point
        sourceFile: 'main.jade',

        // intended output file name
        targetFile: 'index.html',

        // indentation to use in the target file
        // use some string or false to disable
        indentString: false,

        // local variables available in the jade source files
        // built-in vars: name, version, description, author, license
        variables: {
            develop: false
        },

        // create watch task
        // to automatically rebuild on source files change
        watch: false
    },

    develop: {
        targetFile: 'develop.html',

        indentString: '    ',

        variables: {
            develop: true
        },

        watch: true
    }
});
