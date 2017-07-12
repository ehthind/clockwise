angular
  .module('app.sidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http) {
  $scope.selectedCourse = '';
  $scope.arr = [];
  $scope.courses = [];

  $http.get('assets/data/summer2017.json')
    .then(function(response) {
      $scope.courses = response.data
    });

  $scope.addCourse = function(data) {
    var i;
    for (var i = 0; i < $scope.arr.length; i++) {
      if ($scope.arr[i].name === data) {
        return;
      }
    }
    $scope.arr.push({
      'name': data
    });
    console.log($scope.arr);
  }

  $scope.removeCourse = function(course) {
    console.log(course);
    var i;
    for (var i = 0; i < $scope.arr.length; i++) {
      if ($scope.arr[i].name === course) {
        $scope.arr.splice(i, 1);
      }
    }
  };

}
