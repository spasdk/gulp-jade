/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    path   = require('path'),
    jade   = require('jade'),
    del    = require('del'),
    Plugin = require('spa-gulp/lib/plugin'),
    plugin = new Plugin({name: 'jade', entry: 'build', context: module});


// rework profile
plugin.prepare = function ( name ) {
    var data = this.config[name],
        vars = data.variables = data.variables || {};

    // extend vars
    vars.name        = vars.name        || this.package.name;
    vars.version     = vars.version     || this.package.version;
    vars.description = vars.description || this.package.description;
    vars.author      = vars.author      || this.package.author;
    vars.license     = vars.license     || this.package.license;
};


// generate output file from profile
plugin.build = function ( name, callback ) {
    var data       = this.config[name],
        sourceFile = path.join(data.sourcePath, data.sourceFile),
        targetFile = path.join(data.targetPath, data.targetFile),
        render     = null;

    try {
        // prepare function
        render = jade.compileFile(sourceFile, {
            filename: sourceFile,
            pretty: data.indentString
        });

        // save generated result
        fs.writeFileSync(targetFile, render(data.variables));

        callback(null, {targetFile: targetFile});
    } catch ( error ) {
        callback(error);
    }
};


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    // add vars
    plugin.prepare(profile.name);

    // build + watch
    profile.watch(profile.task(plugin.entry, function ( done ) {
        plugin.build(profile.name, function ( error, result ) {
            var message;

            if ( error ) {
                // prepare
                message = error.message.split('\n');

                profile.notify({
                    type: 'fail',
                    info: error.message,
                    title: plugin.entry,
                    message: [message[0], '', message[message.length - 1]]
                });
            } else {
                profile.notify({
                    title: plugin.entry,
                    message: result.targetFile
                });
            }

            done();
        });
    }));

    // remove the generated file
    profile.task('clean', function () {
        var files = del.sync([path.join(profile.data.targetPath, profile.data.targetFile)]);

        if ( files ) {
            profile.notify({
                info: files,
                title: 'clean',
                message: files
            });
        }
    });
});


// public
module.exports = plugin;
