angular
  .module('app.sidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce) {
  $scope.selectedCourse = '';
  $scope.activeCourses = [];

  $scope.courses = [{
    "courseID": 1,
    "name": "MATH 100",
    "title": "Calculus I"
  }];

  $scope.activeSections = [];

  var url = "/api/databaseAPI"

  $scope.addCourse = function (data) {
    var i;
    for (var i = 0; i < $scope.activeCourses.length; i++) {
      if ($scope.activeCourses[i].data.courseID === data.courseID) {
        return;
      }
    }
    $scope.activeCourses.push(
      data
    );
    getSectionData(data.courseID);
    console.log("activeCourses[]: ");
    console.log($scope.activeCourses);
  }

  function getSectionData(courseID) {
    var data = {
      params: {
        'courseID': courseID
      }
    };

    $http.get(url, data).then(function (response) {
      $scope.activeSections.push({
        'courseID': response.data[0].courseID,
        'sections': response.data
      });

    });
    console.log("activeSections[]: ");
    console.log($scope.activeSections);
  }

  $scope.removeCourse = function (courseID) {
    var i;
    for (var i = 0; i < $scope.activeCourses.length; i++) {
      if ($scope.activeCourses[i].courseID === courseID) {
        $scope.activeCourses.splice(i, 1);
      }
    }
  };

}