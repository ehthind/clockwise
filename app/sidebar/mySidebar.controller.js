angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, databaseService, eventService) {
  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();

  var alphaColorList = ['alpha-teal', 'alpha-indigo', 'alpha-primary', 'alpha-danger', 'alpha-slate', 'alpha-success', 'alpha-warning', 'alpha-grey'];                    
  var colorList = ['#26A69A', '#5C6BC0', '#42A5F5', '#EF5350', '#78909C', '#66BB6A', '#FF7043', '#888888'];
  var altColorList = ['#4DB6AC', '#7986CB', '#64B5F6', '#E57373', '#90A4AE', '#81C784', '#FF8A65', '#999999'];
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