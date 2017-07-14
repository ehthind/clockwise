angular
  .module('app.sidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, databaseService) {
  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();

  $scope.courses = [{
    "courseID": 1,
    "name": "MATH 100",
    "title": "Calculus I"
  }];

  $scope.addCourse = function (data) {
    databaseService.addCourse(data);

    console.log("courses[]: ");
    console.log($scope.courseList);
  };

  $scope.removeCourse = function (courseID) {
    databaseService.removeCourse(courseID);
    console.log('Removed course with id: ' + courseID);
    console.log('Updated course list: ' + $scope.courseList);
  };

}