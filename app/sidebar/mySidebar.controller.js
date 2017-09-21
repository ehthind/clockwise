angular
  .module('app.mySidebar')
  .controller('sidebarController', sidebarController);

function sidebarController($scope, $rootScope, $state, $http, $sce, $timeout, $uibModal, $log, databaseService, eventService, scheduleService, notificationService, saveService) {

  var scheduleCount = 0;
  var invalidScheduleCount = 0;

  $scope.schedule = scheduleService.getSchedule();
  $scope.invalidSchedule = scheduleService.getInvalidSchedule();
  $scope.selectedCourse = '';
  $scope.courseList = databaseService.getCourses();
  $scope.courses = '';

  var url1 = 'assets/data/' + $rootScope.term.val + '_courses.json';

  if(!$rootScope.termSet) {
    $state.go('term')    
  }

  $http.get(url1)
    .then(function (response) {
      $scope.courses = response.data;
    });

  $scope.getIcon = function (courseName) {
    var subjectAndLevel = courseName.split(" ");
    var subject = subjectAndLevel[0];
    var icon = $rootScope.iconList[subject];

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

    data.color = $rootScope.colorList[$rootScope.colorIndex];
    data.altColor = $rootScope.altColorList[$rootScope.colorIndex];
    data.alphaColor = $rootScope.alphaColorList[$rootScope.colorIndex];

    $rootScope.colorIndex = ($rootScope.colorIndex + 1) % 8;

    databaseService.addCourse(data).then(function (data) {
      console.time('addCourse');
      scheduleService.generateSchedule($scope.courseList);
      console.log('schedule:');
      console.log($scope.schedule);
      scheduleCount = 0;
      console.log("courses[]: ");
      console.log($scope.courseList);
      $scope.generateSchedule();
    });

  };

  $scope.removeCourse = function (courseID) {

    databaseService.removeCourse(courseID);
    eventService.removeAllCourseEvents(courseID);
    scheduleService.removeCourseFromSchedule(courseID);

    console.log('Removed course with id: ' + courseID);
    console.log('Updated course list: ' + $scope.courseList);
  };

  $scope.clearAll = function () {
    databaseService.clearAll();
    eventService.clearAll();
    scheduleService.clearAll();

    scheduleCount = 0;
    invalidScheduleCount = 0;
  };

  $scope.generateSchedule = function () {
    if ($scope.schedule.length > 0) {

      $scope.schedule[scheduleCount].forEach(function (event) {
        eventService.addEvent(
          event, {
            'name': event.name,
            'courseID': event.courseID,
            'altColor': event.altColor,
            'color': event.color,
            'alphaColor': event.alphaColor
          });
        scheduleCount = (scheduleCount + 1) % $scope.schedule.length;
      }, this);

    } else if ($scope.invalidSchedule.length > 0) {

      $scope.invalidSchedule[invalidScheduleCount].forEach(function (event) {
        eventService.addEvent(
          event, {
            'name': event.name,
            'courseID': event.courseID,
            'altColor': event.altColor,
            'color': event.color,
            'alphaColor': event.alphaColor
          });
      }, this);

      invalidScheduleCount = (invalidScheduleCount + 1) % $scope.invalidSchedule.length;

      // notify no valid schedule found.
      notificationService.notify({
        title: 'No Schedules Found',
        text: 'We\'re unable to find a schedule that is conflict free.',
        addclass: 'alert bg-danger alert-styled-right stack-bottom-right'
      });
    } else {
      scheduleService.generateSchedule($scope.courseList);
    }

  };

  $scope.openSaveModal = function (size, parentSelector) {

    var modalInstance = $uibModal.open({
      animation: true,
      ariaLabelledBy: 'modal-title',
      ariaDescribedBy: 'modal-body',
      templateUrl: 'saveModal.html',
      controller: 'ModalInstanceCtrl',
      size: size,
      windowClass: 'width-modal',

    });

    modalInstance.result.then(function () {
    });
  };

  $scope.openFinishedModal = function (size, parentSelector) {
    
        var modalInstance = $uibModal.open({
          animation: true,
          ariaLabelledBy: 'modal-title',
          ariaDescribedBy: 'modal-body',
          templateUrl: 'finishedModal.html',
          controller: 'ModalInstanceCtrl',
          size: size,
          windowClass: 'width-modal',
    
        });
    
        modalInstance.result.then(function () {
          return;
        });
      };
}



angular.module('app.mySidebar').controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, saveService, eventService) {
  $scope.scheduleName = '';
  $scope.scheduleNameWarning = '';  

  $scope.save = () => {
    if ($scope.scheduleName.length < 3) {
      $scope.scheduleNameWarning = 'Please enter 3 or more characters.';
    } else if ($scope.scheduleName.length > 20) {
      $scope.scheduleNameWarning = 'Schedule names cannot be more than 20 characters.';
    } else {
      $scope.scheduleNameWarning = '';
      saveService.saveSchedule($scope.scheduleName);
      $scope.ok();
    }
  }

  $scope.getCrns = () => eventService.getUniqueCrns();

  $scope.ok = function () {
    $uibModalInstance.close('close');
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});