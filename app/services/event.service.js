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

            if (sectionData.schedule_type === 'Lecture' || sectionData.schedule_type === 'Lecture Topic') {
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

        let f = (a, b) => [].concat(...a.map(a => b.map(b => [].concat(a, b))));
        let cartesian2 = (a, b, ...c) => b ? cartesian2(f(a, b), ...c) : a;

        function generateSchedule(courseList) {

            permutations.length = 0; //reset permutations
            var sectionPermutations = [];

            courseList.forEach(function (course) {
                var lectures = [];
                var labs = [];

                course.section.forEach(function (section) {
                    section.name = course.name;
                    section.altColor = course.altColor;
                    section.color = course.color;

                    var schedule_type = section.schedule_type;

                    if (schedule_type === 'Lecture' || schedule_type === 'Lecture Topic') {
                        lectures.push(section);
                    } else {
                        labs.push(section);
                    }
                }, this);
                console.log(lectures);
                console.log(labs);
                if (labs.length > 0) {
                    sectionPermutations.push(cartesian([lectures, labs]));
                } else {
                    sectionPermutations.push(cartesian([lectures]));

                }

                console.log('section permutations');
                console.log(sectionPermutations);
            }, this);

            var coursePermutations = cartesian(sectionPermutations);
            console.log('permutations');
            console.log(coursePermutations);

            for (var schedule = 0; schedule < coursePermutations.length; schedule++) {
                var week = mapToWeek(coursePermutations[schedule]);
                if (!checkOverlap(week)) {
                    // if no overlaps
                    var newSchedule = mapWeekToSchedule(week);
                    permutations.push(newSchedule);
                }
                if (permutations.length > 6) {
                    break;
                }
            }

            shuffle(permutations);
            console.timeEnd('addCourse');
        }

        function checkOverlap(week) {

            for (var day = 0; day < week.length; day++) {
                var currentDay = week[day];
                if (currentDay.length === 0) {
                    continue;
                }

                for (var event = 0; event < currentDay.length; event++) {
                    var currentEvent = currentDay[event];
                    var start = new Date(currentEvent.start);
                    var end = new Date(currentEvent.end);
                    var overlap;

                    for (var otherEvent = 0; otherEvent < currentDay.length; otherEvent++) {
                        if (currentEvent.crn === currentDay[otherEvent].crn) {
                            continue;
                        }
                        var estart = new Date(currentDay[otherEvent].start);
                        var eend = new Date(currentDay[otherEvent].end);

                        overlap = (Math.round(estart) / 1000 < Math.round(end) / 1000 && Math.round(eend) > Math.round(start));

                        if (overlap) {
                            //either move this event to available timeslot or remove it
                            return true;
                        }
                    }
                }
            }
            return false;
        }

        function mapWeekToSchedule(week) {
            var schedule = [];
            week.forEach(function (day) {
                day.forEach(function (event) {
                    schedule.push(event);
                }, this);
            }, this);

            return schedule;
        }

        function mapToWeek(schedule) {
            var monday = 'July 17, 2017 ';
            var tuesday = 'July 18, 2017 ';
            var wednesday = 'July 19, 2017 ';
            var thursday = 'July 20, 2017 ';
            var friday = 'July 21, 2017 ';
            var week = [
                [],
                [],
                [],
                [],
                []
            ];

            schedule.forEach(function (course) {
                course.forEach(function (section) {
                    var days = section.days;
                    var chars = days.split(/(?=[A-Z])/);

                    var momentStartTime = moment(section.start_time, ["h:mm A"]);
                    var momentEndTime = moment(section.end_time, ["h:mm A"]);
                    section.start_time_24h = momentStartTime.format("HH:mm");
                    section.end_time_24h = momentEndTime.format("HH:mm");

                    chars.forEach(function (char) {
                        var sSection = JSON.parse(JSON.stringify(section));
                        switch (char) {
                            case 'M':
                                sSection.start = monday + sSection.start_time_24h;
                                sSection.end = monday + sSection.end_time_24h;
                                week[0].push(sSection);
                                break;
                            case 'T':
                                sSection.start = tuesday + sSection.start_time_24h;
                                sSection.end = tuesday + sSection.end_time_24h;
                                week[1].push(sSection);
                                break;
                            case 'W':
                                sSection.start = wednesday + sSection.start_time_24h;
                                sSection.end = wednesday + sSection.end_time_24h;
                                week[2].push(sSection);
                                break;
                            case 'R':
                                sSection.start = thursday + sSection.start_time_24h;
                                sSection.end = thursday + sSection.end_time_24h;
                                week[3].push(sSection);
                                break;
                            case 'F':
                                sSection.start = friday + sSection.start_time_24h;
                                sSection.end = friday + sSection.end_time_24h;
                                week[4].push(sSection);
                                break;

                            default:
                                console.log('ERROR in event.Service \n mapToWeek(), day ' + char + ' not recognized');
                        }
                    }, this);
                }, this);
            }, this);

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

        function shuffle(array) {
            var currentIndex = array.length,
                temporaryValue, randomIndex;

            // While there remain elements to shuffle...
            while (0 !== currentIndex) {

                // Pick a remaining element...
                randomIndex = Math.floor(Math.random() * currentIndex);
                currentIndex -= 1;

                // And swap it with the current element.
                temporaryValue = array[currentIndex];
                array[currentIndex] = array[randomIndex];
                array[randomIndex] = temporaryValue;
            }

            return array;
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