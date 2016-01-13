/**
 * Configuration for jade gulp task.
 *
 * @author Stanislav Kalashnik <darkpark.main@gmail.com>
 * @license GNU GENERAL PUBLIC LICENSE Version 3
 */

'use strict';

// set of named configs for corresponding gulp tasks
// each profile inherits all options from the "default" profile
module.exports = {
    // config to be extended by other profiles
    default: {
        // directory to look for source files
        // default: <project root>/src/jade
        sourcePath: 'jade',

        // main source entry point
        sourceFile: 'main.jade',

        // directory to store output files
        // default: <project root>/app/
        targetPath: ''
    },

    // config for jade:build:develop task
    develop: {
        // intended output file name
        targetFile: 'develop.html',

        // indentation to use in the output file
        // use some string or false to disable
        indentString: '    ',

        // local variables available in the jade source files
        // built-in vars: name, version, description, author, license
        variables: {
            develop: true
        },

        // create task jade:watch:develop
        // to automatically rebuild on source files change
        watch: true
    },

    // config for jade:build:release task
    release: {
        // intended output file name
        targetFile: 'index.html',

        // indentation to use in the output file
        // use some string or false to disable
        indentString: false,

        // local variables available in the jade source files
        // built-in vars: name, version, description, author, license
        variables: {
            develop: false
        }
    }
};
