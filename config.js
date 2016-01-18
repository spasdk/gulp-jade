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
        // main entry point
        source: path.join(config.default.source, 'jade', 'main.jade'),

        // intended output file
        target: path.join(config.default.target, 'index.html'),

        // indentation to use in the target file
        // use some string or false to disable
        indentString: false,

        // local variables available in the jade source files
        // built-in vars: name, version, description, author, license
        variables: {
            develop: false
        }
    },

    develop: {
        target: path.join(config.default.target, 'develop.html'),

        indentString: '    ',

        variables: {
            develop: true
        },

        watch: [
            path.join(config.default.source, 'jade', '**', '*.jade')
        ]
    }
});
