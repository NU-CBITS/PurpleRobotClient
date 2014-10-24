module.exports = function(grunt) {
  'use strict';

  // Project configuration.
  grunt.initConfig({
    uglify: {
      purple_robot: {
        options: {
          sourceMap: true
        },
        files: {
          'purple-robot.min.js': ['purple-robot.js']
        }
      }
    },
    jasmine: {
      src: 'purple-robot.min.js',
      options: {
        specs: 'spec/**/*.js'
      }
    },
    jshint: {
      all: [
        'Gruntfile.js',
        'purple-robot.js',
        'spec/**/*.js'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    docco: {
      docs: {
        src: ['purple-robot.js']
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jasmine');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-docco3');

  grunt.registerTask('minify', ['jshint', 'uglify']);
  grunt.registerTask('test', ['jasmine']);
  grunt.registerTask('document', ['docco']);

  grunt.registerTask('default', ['minify', 'test', 'document']);
};
