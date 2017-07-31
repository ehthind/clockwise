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
        this.clearAll = clearAll;
        this.generateSchedule = generateSchedule;

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

        function addEvent(sectionData, courseData) {
            console.log('in eventService \n event to add: ' + sectionData.section + ' ' + courseData.name);
            if (sectionData.courseID === courseData.courseID) {
                console.log('courseID matches!');
            } else {
                console.log('ERROR courseID did not match \n Section courseID: ' + sectionData.courseID + '\nCourse courseID: ' + courseData.courseID);
            }
            var days_parsed = parseSectionDays(sectionData.days);

            if (checkDuplicate(courseData.courseID, sectionData.schedule_type)) {
                removeEvent(courseData.courseID, sectionData.schedule_type);
            }

            if (sectionData.schedule_type === 'Lecture') {
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
                    'schedule_type': sectionData.schedule_type,
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

        function generateSchedule(courseList) {
            var sectionPermutations = [];

            // Get permutations of a courses lectures and labs
            for (var course = 0; course < courseList.length; course++) {
                var lectures = [];
                var labs = [];

                // Seperate lecture and lab sections
                for (var x = 0; x < courseList[course].section.length; x++) {
                    var schedule_type = courseList[course].section[x].schedule_type;

                    if (schedule_type === 'Lecture' || schedule_type === 'Lecture Topic') {
                        lectures.push(courseList[course].section[x]);
                    } else {
                        labs.push(courseList[course].section[x]);
                    }
                }
                var args = []
                
                if (labs.length > 0) {
                    args = [lectures, labs];
                } else {
                    args = [lectures];
                }

                sectionPermutations.push(cartesian(args));
            }

            // Get permutations of all courses
            var coursePermutations = cartesian(sectionPermutations);
            console.log(coursePermutations);
        }

        function cartesian(arg) {
            var r = [],
                max = arg.length - 1;

            function helper(arr, i) {
                for (var j = 0, l = arg[i].length; j < l; j++) {
                    var a = arr.slice(0); // clone arr
                    a.push(arg[i][j]);
                    if (i == max)
                        r.push(a);
                    else
                        helper(a, i + 1);
                }
            }
            helper([], 0);
            return r;
        }

        function checkOverLap() {

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