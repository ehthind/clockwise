angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, databaseService) {
  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();

  $scope.courses = [{
      "courseID": 1,
      "name": "MATH 100",
      "title": "Calculus I"
    },
    {
      "courseID": 2,
      "name": "MATH 200",
      "title": "Calculus II"
    },
    {
      "courseID": 3,
      "name": "MATH 300",
      "title": "Calculus III"
    },
    {
      "courseID": 4,
      "name": "ENGL 135",
      "title": "Intro To English"
    },
    {
      "courseID": 5,
      "name": "BIOL 345",
      "title": "Into To Biol"
    },

  ];

  $scope.updateActive = function(courseID) {
    databaseService.updateActiveCourse(courseID);
  };

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