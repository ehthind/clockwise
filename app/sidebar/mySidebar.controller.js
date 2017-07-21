angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, databaseService, eventService) {
  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();

  var alphaColorList = [
    'border-left-lg border-left-teal',
    'border-left-lg border-left-indigo',
    'border-left-lg border-left-blue',
    'border-left-lg border-left-danger',
    'border-left-lg border-left-slate',
    'border-left-lg border-left-success',
    'border-left-lg border-left-warning',
    'border-left-lg border-left-grey'
  ];
  var colorList = ['#009688', '#3F51B5', '#03A9F4', '#F44336', '#607D8B', '#4CAF50', '#FF5722', '#777777'];
  var altColorList = ['#26A69A', '#5C6BC0', '#29B6F6', '#EF5350', '#78909C', '#66BB6A', '#FF7043', '#888888'];
  var colorIndex = 0;

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
    {
      "courseID": 6,
      "name": "ASTR 101",
      "title": "Into To Biol"
    },
    {
      "courseID": 7,
      "name": "ASTR 201",
      "title": "Into To Biol"
    },
    {
      "courseID": 8,
      "name": "ASTR 301",
      "title": "Into To Biol"
    },

  ];

  $scope.updateActive = function (courseID) {
    databaseService.updateActiveCourse(courseID);
  };

  $scope.addCourse = function (data) {
    data.color = colorList[colorIndex];
    data.altColor = altColorList[colorIndex];
    data.alphaColor = alphaColorList[colorIndex];
    colorIndex = (colorIndex + 1) % 8;
    databaseService.addCourse(data);

    console.log("courses[]: ");
    console.log($scope.courseList);
  };

  $scope.removeCourse = function (courseID) {
    databaseService.removeCourse(courseID);
    eventService.removeAllCourseEvents(courseID);
    console.log('Removed course with id: ' + courseID);
    console.log('Updated course list: ' + $scope.courseList);
  };

}