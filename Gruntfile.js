module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            bootstrap: {
                files: {
                    'static/js/min.js': [
                        'lib/jquery-1.11.1.js',
                        'lib/bootstrap/js/{transition,alert,affix,button,carousel,collapse,dropdown,modal,tooltip,popover,scrollspy,tab}.js',
                        'lib/bootstrap-tagsinput.js'
                    ]
                }
            }
        },
        casper: {
            options: {
                test: true,
                parallel: true,
                concurrency: 5,
                'fail-fast': true
            },
            test: {
                src: ['test/*.js', '!test/util.js']
            }
        },
        less: {
            build: {
                options: {
                    cleancss: true
                },
                files: {
                    'static/css/min.css': [
                        'lib/bootstrap/less/bootstrap.less',
                        'lib/font-awesome/less/font-awesome.less',
                        'lib/tagsinput/bootstrap-tagsinput.css',
                        'lib/styles.css'
                    ]
                }
            }
        },
        copy: {
            build: {
                files: [
                    {expand:true, cwd: 'lib/font-awesome/', src: ['fonts/*'], dest: 'static/'}
                ]
            }
        },
        express: {
            dev: {
                options: {
                    script: 'server.js',
                    port: 8080,
                    output: 'Listening on port 8080',
                    node_env: 'testing'
                }
            }
        }
    });


    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-copy');
    grunt.loadNpmTasks('grunt-casper');
    grunt.loadNpmTasks('grunt-express-server');
    grunt.loadNpmTasks('grunt-concurrent');
    // Custom drop task
    grunt.registerTask('drop', 'Drop the \'testing\' database', function() {
        // async mode
        var done = this.async(),
              mongoose = require('mongoose');
        mongoose.connect('localhost/testing', function () {
            mongoose.connection.on('open', function () {
                mongoose.connection.db.dropDatabase(function(err) {
                    if(err) {
                        console.log(err);
                    } else {
                        console.log('Successfully dropped db');
                    }
                    mongoose.connection.close(done);
                });
            });
        });
    });
    // Default task(s).
    grunt.registerTask('build', ['uglify', 'less', 'copy']);
    grunt.registerTask('test', ['drop', 'express', 'casper']);

};
