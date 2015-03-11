;(function() {
  'use strict';

  angular.module('nixel', ['ui.router'])

  .config(function($stateProvider) {

    $stateProvider
      .state('editor', {
        url: '',
        controller: function() { console.log('hi'); },
        templateUrl: '../templates/editor.template.html',
        views: {
          'file': {
            templateUrl: '../templates/file.template.html',
            controller : 'fileController', 
          },
          'edit': {
            templateUrl: '../templates/edit.template.html',
            controller: 'editController',
          },
          'tools': {
            templateUrl: '../templates/tools.template.html',
            controller: function() { console.log('tool-area'); },
          },
          'chr' : {
            templateUrl: '../templates/chr.template.html',
            controller: 'chrController',
          },
        },
      });

      
  });


}());
