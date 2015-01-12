module.exports = function(grunt) {
    'use strict';

    //load all grunt tasks
    require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

    //define tasks
    grunt.registerTask('server', ['connect:server', 'watch:server']);

    //env cfg
    var pkg = grunt.file.readJSON('package.json');
    var cfg = {
        src: 'src',
        // Change 'localhost' to '0.0.0.0' to access the server from outside.
        serverHost: 'localhost',
        serverPort: 9000,
        livereload: 35729
    };

    //grunt config
    grunt.initConfig({
        //======== gloabal config ========
        pkg: pkg,
        cfg: cfg,

        //======== Dev config ========
        //http server
        connect: {
            options: {
                port: cfg.serverPort,
                hostname: cfg.serverHost
            },
            server: {
                options: {
                    // keepalive: true,
                    base: cfg.src,
                    open: true
                }
            }
        },

        //open browser
        open: {
            server: {
                url: 'http://localhost:' + cfg.serverPort + '/index.html'
            }
        },

        //watch files
        watch: {
            options: {
                livereload: cfg.livereload
            },
            server: {
                files: [cfg.src + '/**/*.html', cfg.src + '/*.html', cfg.src + '/**/*.js', cfg.src + '/**/*.css']
                // tasks: [''],
            }
        }
    });
};