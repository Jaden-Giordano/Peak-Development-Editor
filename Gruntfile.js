module.exports = function(grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  var config = {
    pkg: grunt.file.readJSON('package.json'),

    // Metadata.
    meta: {
      distPath: 'dist/',
      srcPath: 'src/'
    },

    clean: {
      dist: ['<%= meta.distPath %>/*']
    },

    sass: {
      options: {
        sourcemap: 'none',
        style: 'expanded',
        unixNewlines: true
      },
      core: {
        src: '<%= meta.srcPath %>styles/**.scss',
        dest: '<%= meta.distPath %>css/main.css'
      },
    },

    concat: {
      options: {
        sourceMap: true
      },
      js: {
        src: '<%= meta.srcPath %>app/js/**/*.js',
        dest: '<%= meta.distPath %>js/tmp/script.js'
      }
    },

    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: {
          'dist/js/vendor.js': 'dist/js/tmp/script.js'
        }
      }
    },
    
    copy: {
      app: {
        expand: true,
        cwd: '<%= meta.srcPath %>app/',
        src: ['**', '!js/**'],
        dest: '<%= meta.distPath %>'
      },
      fonts: {
        expand: true,
        cwd: '<%= meta.srcPath %>fonts/',
        src: '**',
        dest: '<%= meta.distPath %>fonts/'
      }
    },

    cssmin: {
      options: {
        keepSpecialComments: '*' // keep all important comments
      },
      main: {
        src: '<%= meta.distPath %>css/main.css',
        dest: '<%= meta.distPath %>css/main.min.css'
      }
    }
  }

  grunt.initConfig(config);

  // Load the plugins
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  require('time-grunt')(grunt);

  // Tasks
  grunt.registerTask('dist-css', ['sass', 'cssmin']);
  grunt.registerTask('config-babel', 'Configures babel', function() {
    config.babel.options.inputSourceMap = grunt.file.readJSON('dist/js/tmp/script.js.map');
  });
  grunt.registerTask('clean-babel', 'Clean temporary babel files', function() {
    grunt.file.delete('dist/js/tmp');
  });
  grunt.registerTask('transpile', ['concat', 'config-babel', 'babel', 'clean-babel']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'transpile', 'copy']);

  grunt.registerTask('default', ['dist']);
};
