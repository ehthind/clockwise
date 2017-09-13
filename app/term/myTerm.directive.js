angular
  .module('app.myTerm')
  .directive('myTerm', myTerm);

  function myTerm() {
    return {
      restrict: 'E',
      templateUrl: 'views/myTerm.hbs'
    };
  }