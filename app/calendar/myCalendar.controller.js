(function () {
    'use strict';

    angular
        .module('app.calendar')
        .controller('myCalendarController', myCalendarController);


    function myCalendarController($scope, eventService) {

        $scope.eventSources = [{
            events: function (start, end, timezone, callback) {
                var events;
                events = eventService.getEvents();
                callback(events);
            }
        }];

        $scope.events = [{
                title: 'Math 101',
                start: '2017-07-19T09:00:00',
                end: '2017-07-19T09:50:00'
            },
            {
                title: 'Math 101',
                start: '2017-07-18T09:00:00',
                end: '2017-07-18T09:50:00'
            },
            {
                title: 'Math 101',
                start: '2017-07-21T09:00:00',
                end: '2017-07-21T09:50:00'
            }
        ];

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