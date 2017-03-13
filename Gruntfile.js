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

    babel: {
      options: {
        sourceMap: false,
        presets: ['es2015']
      },
      dist: {
        files: [
          {
            expand: true,
            cwd: '<%= meta.srcPath %>app/js/',
            src: ['**/*.js'],
            dest: '<%= meta.distPath %>js/'
          }
        ]
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
  grunt.registerTask('dist', ['clean', 'dist-css', 'babel', 'copy']);

  grunt.registerTask('default', ['dist']);
};
