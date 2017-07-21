angular
  .module('app.mySidebar')
  .directive('mySidebar', mySidebar);

  function mySidebar() {
    return {
      restrict: 'E',
      templateUrl: 'app/sidebar/mySidebar.html'
    };
  }