(function () {
    'use strict';

    angular
        .module('app')
        .service('eventService', eventService);

    function eventService() {

        // exposed functions
        this.addEvent = addEvent;
        this.addShadowEvent = addShadowEvent;
        this.getEvents = getEvents;
        this.removeShadowEvent = removeShadowEvent;
        this.removeEvent = removeEvent;
        this.removeAllCourseEvents = removeAllCourseEvents;
        this.clearAll = clearAll;
        this.getUniqueCrns = getUniqueCrns;

        // globals
        var eventList = [];


        ////////////////
        function addEvent(sectionData, courseData) {
            // console.log('courseData in EventService:', courseData);
            // console.log('sectionData in EventService:', sectionData);
            
            if (sectionData.courseID != courseData.courseID) {
                console.error('courseID did not match \n Section courseID: ' + sectionData.courseID + '\nCourse courseID: ' + courseData.courseID);
            }
            var days_parsed = parseSectionDays(sectionData.days);

            if (checkDuplicate(courseData.courseID, sectionData.schedule_type)) {
                removeEvent(courseData.courseID, sectionData.schedule_type);
            }

            if (sectionData.schedule_type === 'Lecture' || sectionData.schedule_type === 'Lecture Topic' || sectionData.schedule_type === 'Gradable Lab') {
                var sectionColor = courseData.color;
                var name = courseData.name;
            } else {
                var sectionColor = courseData.altColor;
                var name = courseData.name + ' - ' + sectionData.schedule_type;
            }

            days_parsed.forEach(function (day) {
                var newEvent = {
                    id: sectionData.crn,
                    title: name,
                    start: day + sectionData.start_time_24h,
                    end: day + sectionData.end_time_24h,
                    color: sectionColor,
                    'alphaColor': courseData.alphaColor,
                    'courseID': courseData.courseID,
                    'schedule_type': sectionData.schedule_type,
                    'crn': sectionData.crn,
                    'shadow': false

                };
                eventList.push(newEvent);
            }, this);

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
                    color: 'rgba(0, 0, 0, 0.14)',
                    className: 'hide-time',
                    'courseID': courseData.courseID,
                    'schedule_type': sectionData.schedule_type,
                    'crn': sectionData.crn,
                    'shadow': true

                };

                eventList.push(newEvent);
            }, this);
        }

        // Getters //

        function getEvents() {
            return eventList;
        }

        function getUniqueCrns() {
            var crnList = [];
            for (var index = 0; index < eventList.length; index++) {
                let event = eventList[index];
                if(crnAlready(event.crn, crnList)) {
                    continue;
                }
                crnList.push(event);
            }
            crnList.sort(compare);
            return crnList;
        };

        function crnAlready(crn, crnList) {
            for (var index = 0; index < crnList.length; index++) {
                if(crn === crnList[index].crn) {
                    return true;
                }
            }
            return false;
        }

        function compare(a, b) {
            if (a.crn < b.crn) {
                return -1;
            }
            if (a.crn > b.crn) {
                return 1;
            }
            // a must be equal to b
            return 0;
        }

        // Setters //
        function removeShadowEvent(crn) {
            for (var i of reverseKeys(eventList)) {
                if (eventList[i].crn === crn && eventList[i].shadow) {
                    eventList.splice(i, 1);
                }
            }
        }

        function removeEvent(courseID, schedule_type) {
            for (var i of reverseKeys(eventList)) {
                if (eventList[i].courseID === courseID && eventList[i].schedule_type === schedule_type) {
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

        function clearAll() {
            eventList.length = 0;
        }

        // Helper Functions //

        function* reverseKeys(arr) {
            var key = arr.length - 1;
            while (key >= 0) {
                yield key;
                key -= 1;
            }
        }

        function checkDuplicate(courseID, schedule_type) {
            if (eventList.some(function (event) {
                    if (event.courseID === courseID && event.schedule_type === schedule_type) {
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
                    case 'R':
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