/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    jade   = require('jade'),
    Plugin = require('spasdk/lib/plugin'),
    plugin = new Plugin({name: 'jade', entry: 'build', config: require('./config')});


// rework profile
//plugin.prepare = function ( name ) {
//    var profile = this.config[name],
//        vars    = profile.variables = profile.variables || {};
//
//    // extend vars
//    vars.name        = vars.name        || this.package.name;
//    vars.version     = vars.version     || this.package.version;
//    vars.description = vars.description || this.package.description;
//    vars.author      = vars.author      || this.package.author;
//    vars.license     = vars.license     || this.package.license;
//};


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
    //plugin.prepare(profile.name);

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
                        message: [message[0].trim(), '', message[message.length - 1].trim()]
                    });
                } else {
                    profile.notify({
                        info: 'write ' + profile.data.target,
                        tags: [plugin.entry],
                        title: plugin.entry,
                        message: profile.data.target
                    });
                }

                done();
            });
        })
    );

    // remove the generated file
    profile.task('clean', function ( done ) {
        fs.unlink(profile.data.target, function ( error ) {
            profile.notify({
                type: error ? 'warn' : 'info',
                title: 'clean',
                message: error ? error : 'delete ' + profile.data.target
            });

            done();
        });
    });
});

//console.log(plugin);

// public
module.exports = plugin;
