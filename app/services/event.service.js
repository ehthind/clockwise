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

            var newEvent = {
                title: courseData.name,
                start: '2017-07-19T' + sectionData.start_time,
                end: '2017-07-19T' + sectionData.end_time
            };
            
            eventList.push(newEvent);
        }

        function removeEvent(eventID) {}

    }
})();