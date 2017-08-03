angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $http, $sce, $timeout, databaseService, eventService, notificationService) {

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
  var invalidScheduleCount = 0;
  var schedule = eventService.getSchedule();
  var invalidSchedule = eventService.getInvalidSchedule();

  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();

  $scope.courses = '';

  $http.get('assets/data/201709_courses.json')
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
      console.time('addCourse');
      eventService.generateSchedule($scope.courseList);
      console.log('schedule:');
      console.log(schedule);
      scheduleCount = 0;
      console.log("courses[]: ");
      console.log($scope.courseList);
      $scope.generateSchedule();
    });
  };

  $scope.removeCourse = function (courseID) {

    databaseService.removeCourse(courseID);
    eventService.removeAllCourseEvents(courseID);
    eventService.removeCourseFromSchedule(courseID);

    console.log('Removed course with id: ' + courseID);
    console.log('Updated course list: ' + $scope.courseList);
  };

  $scope.clearAll = function () {
    databaseService.clearAll();
    eventService.clearAll();
  };

  $scope.generateSchedule = function () {
    if (schedule.length > 0) {

      schedule[scheduleCount].forEach(function (event) {
        eventService.addEvent(
          event, {
            'name': event.name,
            'courseID': event.courseID,
            'altColor': event.altColor,
            'color': event.color,
            'alphaColor': event.alphaColor
          });
        scheduleCount = (scheduleCount + 1) % schedule.length;
      }, this);

    } else {

      invalidSchedule[invalidScheduleCount].forEach(function (event) {
        eventService.addEvent(
          event, {
            'name': event.name,
            'courseID': event.courseID,
            'altColor': event.altColor,
            'color': event.color,
            'alphaColor': event.alphaColor
          });
      }, this);

      invalidScheduleCount = (invalidScheduleCount + 1) % invalidSchedule.length;

      // notify no valid schedule found.
      notificationService.notify({
        title: 'No Schedules Found',
        text: 'We\'re unable to find a schedule that is conflict free.',
        addclass: 'alert bg-danger alert-styled-right stack-bottom-right'
      });
    }
  };
}