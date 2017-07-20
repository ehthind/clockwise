(function () {
    'use strict';

    angular
        .module('app')
        .service('eventService', eventService);

    function eventService() {
        this.getEvents = getEvents;
        this.addEvent = addEvent;
        this.removeEvent = removeEvent;

        var eventList = [];


        ////////////////
        function getEvents() {
            return eventList;
        }

        function addEvent(sectionData, courseData) {
            console.log('in eventService \n event to add: ' + sectionData.section + ' ' + courseData.name);
            if (sectionData.courseID === courseData.courseID) {
                console.log('courseID matches!');
            } else {
                console.log('ERROR courseID did not match \n Section courseID: ' + sectionData.courseID + '\nCourse courseID: ' + courseData.courseID);
            }
            sectionData.days_parsed = parseSectionDays(sectionData.days);
            var newEvent = {
                title: courseData.name,
                start: '2017-07-19T' + sectionData.start_time_24h,
                end: '2017-07-19T' + sectionData.end_time_24h
            };

            eventList.push(newEvent);
        }

        function parseSectionDays(days) {
            var m = '2017-07-17T';
            var t = '2017-07-18T';
            var w = '2017-07-19T';
            var th = '2017-07-20T';
            var f = '2017-07-21T';

            var response = [];

            return response;
        }

        function removeEvent(eventID) {}

    }
})();