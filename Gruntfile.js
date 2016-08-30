module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    concurrent: {
          dev: {
            tasks: ['shell', 'nodemon', 'node-inspector'],
            options: {
                logConcurrentOutput: true
            }
        }
    },
    shell: {
      mongod: {
          command: 'mongod',
          options: {
              async: false,
              stdout: true,
              stderr: true,
              failOnError: false, // Don't fail the task if mongod isn't started. Very likely that it's already running
              execOptions: {
                  cwd: '.'
              }
          }
      }
  },

    nodemon: {
      dev: {
        script: 'index.js',
        options: {
            nodeArgs: ['--debug=5859'],
            env: {
                PORT: '1338',
                VERBOSE: 1
            },
            ignore: ['node_modules/**','public/**', 'views/**', 'logs/**','Gruntfile.js'],
            callback: function (nodemon) {
                nodemon.on('log', function (event) {
                  console.log(event.colour);
              });

                // Initial server start event
                nodemon.on('config:update', function () {

                });

                // refreshes browser when server reboots
                nodemon.on('restart', function () {
                  // Delay before server listens on port
                  setTimeout(function() {
                    require('fs').writeFileSync('.rebooted', 'rebooted');
                }, 1000);
              });
            },
            cwd: __dirname,
            ext: 'js',
            watch: ['.'],
            delay: 1000
            }
        }
    },

    'node-inspector': {
      dev: {

        // node-inspector is configured to run on http://127.0.0.1:8081/?port=5859
        options:{
            // 'web-host': 'localhost',  // Host to listen on; default localhost
            'web-port': 8081,         // Port to host the inspector; default 8080 
            'debug-port': 5859
        }
      }
    },
    
    watch: {
        server: {
            files: ['.rebooted'],
            options: {
              livereload: true
          }
      }
    }

  });

  // Load grunt tasks
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-shell-spawn');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-node-inspector');
  grunt.loadNpmTasks('grunt-contrib-watch');

  // Default task(s).
  grunt.registerTask('default', ['concurrent:dev']);

};