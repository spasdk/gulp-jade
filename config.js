/**
 * Configuration for jade gulp task.
 */

'use strict';

// public
module.exports = {
    // turn on/off compilation
    active: true,

    // set of named configs for corresponding gulp tasks
    // e.g. profile "develop" will inherit all options from "default"
    // and create gulp task "jade:develop"
    profiles: {
        // config to be extended by other profiles
        default: {
            // directory to look for source files
            // default: <project root>/src/jade
            srcPath: 'jade',

            // main source entry point
            srcFile: 'main.jade',

            // directory to store output files
            // default: <project root>/app/
            outPath: ''
        },

        // config for jade:develop task
        develop: {
            // intended output file name
            outFile: 'develop.html',

            // indentation to use in the output file
            // use some string or false to disable
            indentString: '    ',

            // local variables available in the jade source files
            // built-in vars: name, version, description, author, license
            variables: {
                develop: true
            }
        },

        // config for jade:release task
        release: {
            // intended output file name
            outFile: 'index.html',

            // indentation to use in the output file
            // use some string or false to disable
            indentString: false,

            // local variables available in the jade source files
            // built-in vars: name, version, description, author, license
            variables: {
                develop: false
            }
        }
    }
};
