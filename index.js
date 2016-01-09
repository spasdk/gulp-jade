/**
 * Compile HTML files from Jade sources.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

var fs      = require('fs'),
    path    = require('path'),
    util    = require('util'),
    gulp    = require('gulp'),
    //log     = require('gulp-util').log,
    jade    = require('jade'),
    //jade    = require('gulp-jade'),
    //plumber = require('gulp-plumber'),
    //rename  = require('gulp-rename'),
    del     = require('del'),
    //load    = require('require-nocache')(module),
    tools   = require('spa-gulp/tools'),
    config  = tools.load(path.join(process.env.PATH_ROOT, process.env.PATH_CFG, 'jade'), path.join(__dirname, 'config')),
    pkgInfo = require(process.env.PACKAGE),
    //entry   = path.join(process.env.PATH_SRC, 'jade', 'main.jade'),
    //cfg     = path.join(process.env.PATH_ROOT, process.env.PATH_CFG, 'jade'),
    outFiles = [],
    profileTasks = [];


function compile ( config, done ) {
    var srcFile = path.join(process.env.PATH_ROOT, process.env.PATH_SRC, config.srcPath, config.srcFile),
        outFile = path.join(process.env.PATH_ROOT, process.env.PATH_APP, config.outPath, config.outFile),
        render  = null;

    try {
        // prepare function
        render = jade.compileFile(srcFile, {
            filename: srcFile,
            pretty: config.indentString
        });

        // save generated result
        fs.writeFileSync(outFile, render(config.variables));
    } catch ( error ) {
        // console log + notification popup
        tools.error('jade', error.message);
    }

    done();
}


// do not create tasks
if ( !config.active ) {
    return;
}


// only derived profiles are necessary
delete config.profiles.default;


// generate tasks by config profiles
Object.keys(config.profiles).forEach(function ( profileName ) {
    var profile  = config.profiles[profileName],
        taskName = 'jade:' + profileName;

    // sanitize
    profile.variables = profile.variables || {};

    // extend vars
    profile.variables.name        = profile.variables.name        || pkgInfo.name;
    profile.variables.version     = profile.variables.version     || pkgInfo.version;
    profile.variables.description = profile.variables.description || pkgInfo.description;
    profile.variables.author      = profile.variables.author      || pkgInfo.author;
    profile.variables.license     = profile.variables.license     || pkgInfo.license;

    // files to delete in clear task
    outFiles.push(path.join(process.env.PATH_APP, profile.outPath || '', profile.outFile || ''));

    gulp.task(taskName, function ( done ) {
        compile(profile, done);
    });

    // fill group task list
    profileTasks.push(taskName);
});


// output current config
gulp.task('jade:config', function () {
    tools.log('jade', util.inspect(config, {depth: 5, colors: true}));
});


// remove all generated html files
gulp.task('jade:clean', function () {
    del.sync(outFiles);
});


// run all profiles tasks
gulp.task('jade', profileTasks);


/*gulp.task('jade:watch', function ( done ) {
 // jade
 gulp.watch([
 'package.json',
 path.join(process.env.PATH_SRC, 'jade', '**', '*.jade')
 ], ['jade:develop']);
 });*/


// public
module.exports = {
    //prepare: prepare,
    compile: compile
};
