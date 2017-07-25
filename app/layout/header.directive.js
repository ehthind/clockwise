angular
  .module('app.header')
  .directive('header', header);

function header() {
  return {
    restrict: 'E',
    templateUrl: 'app/components/header.html'
  };
}
