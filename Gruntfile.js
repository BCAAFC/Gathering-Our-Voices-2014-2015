module.exports = function(grunt) {
    // Project configuration.
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        uglify: {
            bootstrap: {
                // options: {
                //     mangle: false,
                //     compress: false,
                //     beautify: true
                // },
                files: {
                    'static/js/min.js': [
                        'lib/jquery-1.11.1.js',
                        'lib/bootstrap/js/transition.js',
                        'lib/bootstrap/js/alert.js',
                        'lib/bootstrap/js/affix.js',
                        'lib/bootstrap/js/button.js',
                        'lib/bootstrap/js/carousel.js',
                        'lib/bootstrap/js/collapse.js',
                        'lib/bootstrap/js/dropdown.js',
                        'lib/bootstrap/js/modal.js',
                        'lib/bootstrap/js/tooltip.js',
                        'lib/bootstrap/js/popover.js',
                        'lib/bootstrap/js/scrollspy.js',
                        'lib/bootstrap/js/tab.js',
                        'lib/tagsinput/bootstrap-tagsinput.js',
                        'lib/datatables/jquery.dataTables.js',
                        'lib/datatables/dataTables.colVis.js',
                        // 'lib/datatables/dataTables.colReorder.js',
                        'lib/datatables/dataTables.responsive.js',
                    ]
                }
            }
        },
        casper: {
            options: {
                test: true,
                // parallel: true, // Mangles output
                'fail-fast': true
            },
            test: {
                src: [
                    'test/registration-flow.js',
                    'test/admin-flow.js'

                ]
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
                        'lib/datatables/jquery.dataTables.css',
                        'lib/datatables/dataTables.bootstrap.css',
                        'lib/datatables/dataTables.colVis.css',
                        // 'lib/datatables/dataTables.colReorder.css',
                        // 'lib/datatables/dataTables.responsive.css',
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
