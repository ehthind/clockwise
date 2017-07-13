angular
  .module('app.sidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce) {
  $scope.selectedCourse = '';
  $scope.activeCourses = [];
  
  $scope.courses = [{
    "courseID": 1,
    "subject": "MATH",
    "number": "100",
    "title": "Calculus I"
  }];

  $scope.sections = [];

  // $http.get('assets/data/summer2017.json')
  //   .then(function (response) {
  //     $scope.courses = response.data
  //   });

  var url = "/api/databaseAPI"
  var trustedUrl = $sce.trustAsResourceUrl(url);

  var temp = {
    'temp': 'stuff'
  };

  $http.get(url, {
      params: {
        "param1": 'val1',
        "param2": 'val2'
      }
    })
    .then(function (data) {
      console.log(data.data[0]);
    });

  
  $scope.addCourse = function (data) {
    var i;
    for (var i = 0; i < $scope.activeCourses.length; i++) {
      if ($scope.activeCourses[i].data.courseID === data.courseID) {
        return;
      }
    }
    $scope.activeCourses.push({
      data
    });
    console.log($scope.activeCourses);
  }

  $scope.removeCourse = function (courseID) {
    var i;
    for (var i = 0; i < $scope.activeCourses.length; i++) {
      if ($scope.activeCourses[i].data.courseID === courseID) {
        $scope.activeCourses.splice(i, 1);
      }
    }
  };

}