var app = angular.module('app', ['ui.router', 'app.mySidebar', 'app.myDatatable', 'app.myCalendar', 'app.exportModal', 'app.myTerm', 'jlareau.pnotify', 'utils.autofocus']);

app.run(function ($rootScope, $location, $window) {
  $rootScope.term = {
    val: 'inital val',
    season: '',
    range: ''
  };
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