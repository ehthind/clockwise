angular
  .module('app.sidebar')
  .directive('sidebar', sidebar);

  function sidebar() {
    return {
      restrict: 'E',
      templateUrl: 'app/components/sidebar.html'
    };
  }
