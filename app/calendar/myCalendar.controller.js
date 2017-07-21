(function () {
    'use strict';

    angular
        .module('app.myCalendar')
        .controller('myCalendarController', myCalendarController);


    function myCalendarController($scope, eventService) {

        $scope.events = eventService.getEvents();
        $scope.eventSources = [{
            events: $scope.events
        }];

        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: false,
                header: false,
                firstDay: 1,
                weekends: false,
                defaultView: 'agendaWeek',
                allDaySlot: false,
                minTime: '08:00:00',
                maxTime: '22:00:00',
                columnFormat: {
                    'week': 'dddd'
                }
            }
        };
    }
})();