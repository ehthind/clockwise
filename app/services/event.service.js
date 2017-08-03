(function () {
    'use strict';

    angular
        .module('app')
        .service('eventService', eventService);

    function eventService($moment) {
        this.getEvents = getEvents;
        this.addEvent = addEvent;
        this.addShadowEvent = addShadowEvent;
        this.removeEvent = removeEvent;
        this.removeAllCourseEvents = removeAllCourseEvents;
        this.removeShadowEvent = removeShadowEvent;
        this.clearAll = clearAll;
        this.generateSchedule = generateSchedule;
        this.getPermutations = getPermutations;

        var eventList = [];
        var permutations = [];


        ////////////////

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

            permutations.length = 0; //reset permutations
            var sectionPermutations = [];

            // Get permutations of a courses lectures and labs
            for (var course = 0; course < courseList.length; course++) {
                var lectures = [];
                var labs = [];

                // Seperate lecture and lab sections
                for (var x = 0; x < courseList[course].section.length; x++) {

                    courseList[course].section[x].name = courseList[course].name;
                    courseList[course].section[x].altColor = courseList[course].altColor;
                    courseList[course].section[x].color = courseList[course].color;

                    var schedule_type = courseList[course].section[x].schedule_type;

                    if (schedule_type === 'Lecture' || schedule_type === 'Lecture Topic') {
                        lectures.push(courseList[course].section[x]);
                    } else {
                        labs.push(courseList[course].section[x]);
                    }
                }

                var args = [];
                if (labs.length > 0) {
                    args = [lectures, labs];
                } else {
                    args = [lectures];
                }
                sectionPermutations.push(cartesian(args));
            }

            // Get permutations of all courses
            var coursePermutations = cartesian(sectionPermutations);

            for (var schedule = 0; schedule < coursePermutations.length; schedule++) {
                var week = mapToWeek(coursePermutations[schedule]);
                var overlap = false;
                for (var event = 0; event < week.length; event++) {
                    if (checkOverlap(week[event], week)) {
                        overlap = true;
                        break;
                    }
                }
                // if no overlaps
                if (!overlap) {
                    //if not the current schedule
                    if (!currentSchedule(week)) {
                        permutations.push(week);
                    }
                }
            }
        }

        function currentSchedule(myEventList) {
            var temp = 0;
            for (var i = 0; i < eventList.length; i++) {
                var event = eventList[i];
                for (var j = 0; j < myEventList.length; j++) {
                    var otherEvent = myEventList[j];
                    if (event.crn === otherEvent.crn) {
                        temp++;
                        break;
                    }
                }
            }

            if (eventList.length === temp && temp != 0) {
                return true;
            } else {
                return false;
            }
        }
        
        function checkOverlap(event, myEventList) {

            var start = new Date(event.start);
            var end = new Date(event.end);
            var overlap;

            for (var index = 0; index < myEventList.length; index++) {
                if (event.crn === myEventList[index].crn) {
                    continue;
                }
                var estart = new Date(myEventList[index].start);
                var eend = new Date(myEventList[index].end);

                overlap = (Math.round(estart) / 1000 < Math.round(end) / 1000 && Math.round(eend) > Math.round(start));

                if (overlap) {
                    console.log('overlap');
                    //either move this event to available timeslot or remove it
                    return true;
                }
            }
            console.log('overlap didnt fire');
            return false;
        }

        function mapToWeek(schedule) {
            var monday = 'July 17, 2017 ';
            var tuesday = 'July 18, 2017 ';
            var wednesday = 'July 19, 2017 ';
            var thursday = 'July 20, 2017 ';
            var friday = 'July 21, 2017 ';
            var week = [];

            for (var course = 0; course < schedule.length; course++) {

                for (var section = 0; section < schedule[course].length; section++) {
                    var days = schedule[course][section].days;
                    var chars = days.split(/(?=[A-Z])/);

                    var momentStartTime = moment(schedule[course][section].start_time, ["h:mm A"]);
                    var momentEndTime = moment(schedule[course][section].end_time, ["h:mm A"]);
                    schedule[course][section].start_time_24h = momentStartTime.format("HH:mm");
                    schedule[course][section].end_time_24h = momentEndTime.format("HH:mm");

                    chars.forEach(function (char) {
                        var sSection = JSON.parse(JSON.stringify(schedule[course][section]));
                        switch (char) {
                            case 'M':
                                sSection.start = monday + sSection.start_time_24h;
                                sSection.end = monday + sSection.end_time_24h;
                                week.push(sSection);
                                break;
                            case 'T':
                                sSection.start = tuesday + sSection.start_time_24h;
                                sSection.end = tuesday + sSection.end_time_24h;
                                week.push(sSection);
                                break;
                            case 'W':
                                sSection.start = wednesday + sSection.start_time_24h;
                                sSection.end = wednesday + sSection.end_time_24h;
                                week.push(sSection);
                                break;
                            case 'R':
                                sSection.start = thursday + sSection.start_time_24h;
                                sSection.end = thursday + sSection.end_time_24h;
                                week.push(sSection);
                                break;
                            case 'F':
                                sSection.start = friday + sSection.start_time_24h;
                                sSection.end = friday + sSection.end_time_24h;
                                week.push(sSection);
                                break;

                            default:
                                console.log('ERROR in event.Service \n mapToWeek(), day ' + char + ' not recognized');
                        }
                    }, this);
                }
            }
            return week;
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

        // Getters //

        function getEvents() {
            return eventList;
        }

        function getPermutations() {
            return permutations;
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