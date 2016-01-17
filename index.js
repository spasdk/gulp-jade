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
    profile.watch(profile.task('build', function ( done ) {
        plugin.build(profile.name, function ( error, result ) {
            var message;

            if ( error ) {
                // prepare
                message = error.message.split('\n');

                profile.notify({
                    type: 'fail',
                    info: error.message,
                    title: 'build',
                    message: [message[0], '', message[message.length - 1]]
                });
            } else {
                profile.notify({
                    title: 'build',
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




//// task set was turned off in gulp.js
//if ( !config ) {
//    // do not create tasks
//    return;
//}
//
//
//// build global task tree
////global.tasks.build[gulpName] = [];
////global.tasks.watch[gulpName] = [];
////global.tasks.clean[gulpName] = [];
////global.tasks[gulpName] = {
////    build: [],
////    watch: [],
////    clean: []
////};
//global.tasks[gulpName] = [gulpName + ':build'];
//global.tasks[gulpName + ':build'] = [];
//global.tasks[gulpName + ':watch'] = [];
//global.tasks[gulpName + ':clean'] = [];
//global.tasks.build.push(gulpName + ':build');
//global.tasks.watch.push(gulpName + ':watch');
//global.tasks.clean.push(gulpName + ':clean');
//
//
//// only derived profiles are necessary
//delete config.profiles.default;
//
//
//// generate tasks by config profiles
//Object.keys(config.profiles).forEach(function ( profileName ) {
//    var profile   = config.profiles[profileName],
//        buildName = gulpName + ':build:' + profileName,
//        watchName = gulpName + ':watch:' + profileName,
//        cleanName = gulpName + ':clean:' + profileName;
//
//    // sanitize
//    profile.variables = profile.variables || {};
//
//    // extend vars
//    profile.variables.name        = profile.variables.name        || pkgInfo.name;
//    profile.variables.version     = profile.variables.version     || pkgInfo.version;
//    profile.variables.description = profile.variables.description || pkgInfo.description;
//    profile.variables.author      = profile.variables.author      || pkgInfo.author;
//    profile.variables.license     = profile.variables.license     || pkgInfo.license;
//
//    // profile build task
//    gulp.task(buildName, function ( done ) {
//        build(profile, done);
//    });
//
//    // remove all generated html files
//    gulp.task(cleanName, function () {
//        var files = [];
//
//        // protect from upper content deletion
//        if ( profile.targetFile ) {
//            // files to delete in clear task
//            files.push(path.join(process.env.PATH_APP, profile.targetPath || '', profile.targetFile));
//        }
//
//        tools.log('clean', del.sync(files));
//    });
//
//    // profile watch task
//    if ( profile.watch ) {
//        // done callback should be present to show gulp that task is not over
//        gulp.task(watchName, function ( done ) {
//            gulp.watch([
//                //process.env.PACKAGE,
//                path.join(process.env.PATH_SRC, profile.sourcePath, '**', '*.' + gulpName)
//            ], [buildName]);
//        });
//
//        // register global tasks
//        //global.tasks.watch[gulpName].push(watchName);
//        //global.tasks[gulpName].watch.push(watchName);
//        global.tasks[gulpName + ':watch'].push(watchName);
//    }
//
//    // register global tasks
//    //global.tasks.build[gulpName].push(buildName);
//    //global.tasks.clean[gulpName].push(cleanName);
//    //global.tasks[gulpName].build.push(buildName);
//    //global.tasks[gulpName].clean.push(cleanName);
//    global.tasks[gulpName + ':build'].push(buildName);
//    global.tasks[gulpName + ':clean'].push(cleanName);
//
//    global.tasks['build:' + profileName] = global.tasks['build:' + profileName] || [];
//    global.tasks['build:' + profileName].push(buildName);
//
//    global.tasks['clean:' + profileName] = global.tasks['clean:' + profileName] || [];
//    global.tasks['clean:' + profileName].push(cleanName);
//});
//
//
//// output current config
//gulp.task(gulpName + ':config', function () {
//    tools.log(gulpName, util.inspect(config, {depth: 5, colors: true}));
//});
//
//
////// remove all generated html files
////gulp.task(gulpName + ':clean', function () {
////    tools.log('clean', del.sync(outFiles));
////});
//
//// register in global task "clean"
////global.tasks.clean.push('jade:clean');
////global.tasks.build.push('jade:build');
//
//
//// run all profiles tasks
////gulp.task('jade:build', buildTasks);
////gulp.task('jade:clean', cleanTasks);
////gulp.task('jade', ['jade:build']);
//
//
//// public
//module.exports = {
//    build: build
//};
