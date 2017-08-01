angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, databaseService, eventService, notificationService) {
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

  var iconList = {
    'MATH': 'icon-calculator3',
    'ENGL': 'icon-typewriter',
    'BIOL': 'icon-paw',
    'ASTR': 'icon-satellite-dish2',
    'SENG': 'icon-embed',
    'CSC': 'icon-qrcode'
  };

  var scheduleCount = 0;
  var schedule = eventService.getPermutations();

  $scope.courses = '';

  $http.get('assets/data/201705_courses.json')
    .then(function (response) {
      $scope.courses = response.data;
    });

  $scope.getIcon = function (courseName) {
    var subjectAndLevel = courseName.split(" ");
    var subject = subjectAndLevel[0];
    var icon = iconList[subject];

    return icon;
  }

  $scope.updateActive = function (courseID) {
    databaseService.updateActiveCourse(courseID);
    // notificationService.notify({
    //   title: 'Time Conflict',
    //   text: 'Between ENGL 135 & Math 200',
    //   addclass: 'alert bg-danger alert-styled-right stack-bottom-right'

    // });

  };

  $scope.addCourse = function (data) {
    data.color = colorList[colorIndex];
    data.altColor = altColorList[colorIndex];
    data.alphaColor = alphaColorList[colorIndex];
    colorIndex = (colorIndex + 1) % 8;
    databaseService.addCourse(data).then(function (data) {
      eventService.generateSchedule($scope.courseList);
      scheduleCount = 0;
    });

    // eventService.generateSchedule($scope.courseList);
    // perms = eventService.getPermutations();
    // console.log(perms);

    console.log("courses[]: ");
    console.log($scope.courseList);
  };

  $scope.removeCourse = function (courseID) {

    databaseService.removeCourse(courseID);
    eventService.removeAllCourseEvents(courseID);

    console.log('Removed course with id: ' + courseID);
    console.log('Updated course list: ' + $scope.courseList);
  };

  $scope.clearAll = function () {
    databaseService.clearAll();
    eventService.clearAll();
  };

  $scope.generateSchedule = function () {

    for (var event = 0; event < schedule[scheduleCount].length; event++) {
      var newEvent = schedule[scheduleCount][event];
      eventService.addEvent(
        newEvent, {
          'name': newEvent.name,
          'courseID': newEvent.courseID,
          'altColor': newEvent.altColor,
          'color': newEvent.color,
          'alphaColor': newEvent.alphaColor
        });
    }
    scheduleCount = (scheduleCount + 1) % schedule.length;

  };
}