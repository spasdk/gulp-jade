/**
 * Base configuration for jade gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var path     = require('path'),
    extend   = require('extend'),
    config   = require('spasdk/config'),
    pkgData  = require(path.join(process.cwd(), 'package.json')),
    profiles = {};


// main
profiles.default = extend(true, {}, config, {
    // main entry point
    source: path.join(config.source, 'jade', 'main.jade'),

    // intended output file
    target: path.join(config.target, 'index.html'),

    // local variables available in jade source files
    variables: {
        package: pkgData,
        develop: false
    },

    // info channels
    notifications: {
        popup: {
            info: {icon: path.join(__dirname, 'media', 'info.png')},
            warn: {icon: path.join(__dirname, 'media', 'warn.png')},
            fail: {icon: path.join(__dirname, 'media', 'fail.png')}
        }
    }
});


profiles.develop = extend(true, {}, profiles.default, {
    // intended output file
    target: path.join(config.target, 'develop.html'),

    // indentation to use in the target file
    indentString: '    ',

    // local variables available in jade source files
    variables: {
        develop: true
    },

    // false to prevent watch task creation
    // otherwise array of globs to monitor
    watch: [
        path.join(config.source, 'jade', '**', '*.jade')
    ]
});


// public
module.exports = profiles;
