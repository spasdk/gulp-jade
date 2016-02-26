/**
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs     = require('fs'),
    jade   = require('jade'),
    PluginTemplate = require('spa-plugin');
    //plugin = new Plugin({name: 'jade', entry: 'build', config: require('./config')});


/**
 * @constructor
 * @extends PluginTemplate
 *
 * @param {Object} config init parameters (all inherited from the parent)
 */
function Plugin ( config ) {
    var self = this;

    // parent constructor call
    PluginTemplate.call(this, config);

    // create tasks for profiles
    this.profiles.forEach(function ( profile ) {
        // main entry task
        var task = profile.task(self.entry, function ( done ) {
            self.build(profile.name, function ( error ) {
                var message;

                if ( error ) {
                    // prepare
                    message = error.message.split('\n');

                    profile.notify({
                        type: 'fail',
                        info: error.message,
                        title: self.entry,
                        message: [message[0].trim(), '', message[message.length - 1].trim()]
                    });
                } else {
                    profile.notify({
                        info: 'write ' + profile.data.target,
                        tags: [self.entry],
                        title: self.entry
                        //message: profile.data.target
                    });
                }

                done();
            });
        });

        profile.watch({
            glob: profile.data.watch,
            task: task
        });

        // remove the generated file
        profile.task('clean', function ( done ) {
            fs.unlink(profile.data.target, function ( error ) {
                profile.notify({
                    type: error ? 'warn' : 'info',
                    title: 'clean',
                    info: 'delete ' + profile.data.target,
                    message: error ? error.message : ''
                });

                done();
            });
        });
    });

    this.debug('tasks: ' + Object.keys(this.tasks).sort().join(', '));
}


// inheritance
Plugin.prototype = Object.create(PluginTemplate.prototype);
Plugin.prototype.constructor = Plugin;


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
Plugin.prototype.build = function ( name, callback ) {
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


//console.log(plugin);


// public
module.exports = Plugin;
