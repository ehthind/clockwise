angular
  .module('app.myCalendar')
  .directive('myCalendar', myCalendar);

  function myCalendar() {
    return {
      restrict: 'E',
      templateUrl: 'app/calendar/myCalendar.html'
    };
  }