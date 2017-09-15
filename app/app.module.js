var app = angular.module('app', ['ui.router', 'app.mySidebar', 'app.myDatatable', 'app.myCalendar', 'app.exportModal', 'app.myTerm', 'jlareau.pnotify', 'utils.autofocus']);

app.run(function ($rootScope, $location, $window) {
  $rootScope.term = {
    val: '',
    season: '',
    range: '',
    year: ''
  };

  $rootScope.alphaColorList = [
    'border-left-lg border-left-teal',
    'border-left-lg border-left-indigo',
    'border-left-lg border-left-blue',
    'border-left-lg border-left-danger',
    'border-left-lg border-left-slate',
    'border-left-lg border-left-success',
    'border-left-lg border-left-warning',
    'border-left-lg border-left-grey'
  ];
 
  $rootScope.colorList = ['#009688', '#3F51B5', '#03A9F4', '#F44336', '#607D8B', '#4CAF50', '#FF5722', '#777777'];
 
  $rootScope.altColorList = ['#26A69A', '#5C6BC0', '#29B6F6', '#EF5350', '#78909C', '#66BB6A', '#FF7043', '#888888'];
 
  $rootScope.iconList = {
    'MATH': 'icon-calculator3',
    'ENGL': 'icon-typewriter',
    'BIOL': 'icon-paw',
    'ASTR': 'icon-satellite-dish2',
    'SENG': 'icon-embed',
    'CSC': 'icon-qrcode'
  };

  $rootScope.colorIndex = 0;

});

app.config(function ($stateProvider, $urlRouterProvider) {

  $urlRouterProvider.otherwise("/term");

  var termState = {
    name: 'term',
    url: '/term',
    templateUrl: 'views/start.hbs'
  }

  var mainState = {
    name: 'main',
    url: '/main',
    templateUrl: 'views/mainApp.hbs'
  }

  $stateProvider.state(termState);
  $stateProvider.state(mainState);
});