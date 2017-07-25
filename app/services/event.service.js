(function () {
    'use strict';

    angular
        .module('app')
        .service('eventService', eventService);

    function eventService() {
        this.getEvents = getEvents;
        this.addEvent = addEvent;
        this.addShadowEvent = addShadowEvent;
        this.removeEvent = removeEvent;
        this.removeAllCourseEvents = removeAllCourseEvents;
        this.removeShadowEvent = removeShadowEvent;
        
        var eventList = [];


        ////////////////
        function getEvents() {
            console.log('in getEvents');
            return eventList;
        }

        function addShadowEvent(sectionData, courseData) {
            // Check if the event is selected and on the calendar
            for (var i = 0; i < eventList.length; i++) {
                if (eventList[i].crn === sectionData.crn && !eventList[i].shadow) {
                    return;
                }
            }

            var days_parsed = parseSectionDays(sectionData.days);

            days_parsed.forEach(function (day) {
                var newEvent = {
                    id: sectionData.crn,
                    start: day + sectionData.start_time_24h,
                    end: day + sectionData.end_time_24h,
                    color: 'rgba(0, 0, 0, 0.2)',
                    className: 'hide-time',
                    'courseID': courseData.courseID,
                    'type': sectionData.type,
                    'crn': sectionData.crn,
                    'shadow': true

                };

                eventList.push(newEvent);
            }, this);


        }

        function addEvent(sectionData, courseData) {
            console.log('in eventService \n event to add: ' + sectionData.section + ' ' + courseData.name);
            if (sectionData.courseID === courseData.courseID) {
                console.log('courseID matches!');
            } else {
                console.log('ERROR courseID did not match \n Section courseID: ' + sectionData.courseID + '\nCourse courseID: ' + courseData.courseID);
            }
            var days_parsed = parseSectionDays(sectionData.days);

            if (checkDuplicate(courseData.courseID, sectionData.type)) {
                removeEvent(courseData.courseID, sectionData.type);
            }

            if (sectionData.type === 'Lecture') {
                var sectionColor = courseData.color;
            } else {
                var sectionColor = courseData.altColor;
            }

            days_parsed.forEach(function (day) {
                var newEvent = {
                    id: sectionData.crn,
                    title: courseData.name,
                    start: day + sectionData.start_time_24h,
                    end: day + sectionData.end_time_24h,
                    color: sectionColor,
                    'alphaColor': courseData.alphaColor,
                    'courseID': courseData.courseID,
                    'type': sectionData.type,
                    'crn': sectionData.crn,
                    'shadow': false

                };

                eventList.push(newEvent);
            }, this);

        }

        function removeShadowEvent(crn) {
            for (var i of reverseKeys(eventList)) {
                if (eventList[i].crn === crn && eventList[i].shadow) {
                    eventList.splice(i, 1);
                }
            }
        }

        function removeEvent(courseID, type) {
            for (var i of reverseKeys(eventList)) {
                if (eventList[i].courseID === courseID && eventList[i].type === type) {
                    eventList.splice(i, 1);
                }
            }
        }

        function removeAllCourseEvents(courseID) {
            for (var i of reverseKeys(eventList)) {
                if (eventList[i].courseID === courseID) {
                    eventList.splice(i, 1);
                }
            }
        }

        // Getters //

        function getEvents() {
            return eventList;
        }


        // Helper Functions //

        function* reverseKeys(arr) {
            var key = arr.length - 1;
            while (key >= 0) {
                yield key;
                key -= 1;
            }
        }

        function checkDuplicate(courseID, type) {
            if (eventList.some(function (event) {
                    if (event.courseID === courseID && event.type === type) {
                        return true;
                    }
                })) {
                return true;
            } else {
                return false;
            }

        }

        function parseSectionDays(days) {
            var monday = '2017-07-17T';
            var tuesday = '2017-07-18T';
            var wednesday = '2017-07-19T';
            var thursday = '2017-07-20T';
            var friday = '2017-07-21T';

            var response = [];
            var chars = days.split(/(?=[A-Z])/);

            chars.forEach(function (char) {
                switch (char) {
                    case 'M':
                        response.push(monday);
                        break;
                    case 'T':
                        response.push(tuesday);
                        break;
                    case 'W':
                        response.push(wednesday);
                        break;
                    case 'Th':
                        response.push(thursday);
                        break;
                    case 'F':
                        response.push(friday);
                        break;

                    default:
                        console.log('ERROR in event.Service \n parseSectionDays(), day ' + char + ' not recognized');
                }
            }, this);

            return response;
        }

    }
})();