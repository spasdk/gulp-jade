/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    jade   = require('jade'),
    del    = require('del'),
    Plugin = require('spa-gulp/lib/plugin'),
    plugin = new Plugin({name: 'jade', entry: 'build', context: module});


// rework profile
plugin.prepare = function ( name ) {
    var profile = this.config[name],
        vars    = profile.variables = profile.variables || {};

    // extend vars
    vars.name        = vars.name        || this.package.name;
    vars.version     = vars.version     || this.package.version;
    vars.description = vars.description || this.package.description;
    vars.author      = vars.author      || this.package.author;
    vars.license     = vars.license     || this.package.license;
};


// generate output file from profile
plugin.build = function ( name, callback ) {
    var data = this.config[name],
        render;

    try {
        // prepare function
        render = jade.compileFile(data.source, {
            filename: data.source,
            pretty: data.indentString
        });

        // save generated result
        fs.writeFileSync(data.target, render(data.variables));

        callback(null);
    } catch ( error ) {
        callback(error);
    }
};


// create tasks for profiles
plugin.profiles.forEach(function ( profile ) {
    // add vars
    plugin.prepare(profile.name);

    profile.watch(
        // main entry task
        profile.task(plugin.entry, function ( done ) {
            plugin.build(profile.name, function ( error ) {
                var message;

                if ( error ) {
                    // prepare
                    message = error.message.split('\n');

                    profile.notify({
                        type: 'fail',
                        info: error.message,
                        title: plugin.entry,
                        message: [message[0], '\n', message[message.length - 1]]
                    });
                } else {
                    profile.notify({
                        info: 'write '.green + profile.data.target,
                        title: plugin.entry,
                        message: profile.data.target
                    });
                }

                done();
            });
        })
    );

    // remove the generated file
    profile.task('clean', function () {
        if ( del.sync([profile.data.target]).length ) {
            // something was removed
            profile.notify({
                info: 'delete '.green + profile.data.target,
                title: 'clean',
                message: profile.data.target
            });
        }
    });
});


// public
module.exports = plugin;
