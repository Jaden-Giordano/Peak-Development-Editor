module.exports = function(grunt) {
  'use strict';

  // Force use of Unix newlines
  grunt.util.linefeed = '\n';

  // Project configuration.
  grunt.initConfig({
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

    browserify: {
      vendor: {
        src: '<%= meta.srcPath %>app/**/*.js',
        dest: '<%= meta.distPath %>vendor.js',
        options: {
          require:['jquery']
        }
      }
    }

    copy: {
      package: {
        expand: true,
        src: 'package.json',
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
  });

  // Load the plugins
  require('load-grunt-tasks')(grunt, {
    scope: 'devDependencies'
  });
  require('time-grunt')(grunt);

  // Tasks
  grunt.registerTask('dist-css', ['sass', 'cssmin']);
  grunt.registerTask('dist', ['clean', 'dist-css', 'copy']);

  grunt.registerTask('default', ['browserify', 'dist']);
};
