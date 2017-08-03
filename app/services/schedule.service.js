(function () {
    'use strict';

    angular
        .module('app')
        .service('scheduleService', scheduleService);

    function scheduleService() {

        // exposed functions
        this.generateSchedule = generateSchedule;
        this.getSchedule = getSchedule;
        this.getInvalidSchedule = getInvalidSchedule;
        this.removeCourseFromSchedule = removeCourseFromSchedule;
        this.clearAll = clearAll;

        // globals
        var sPermutations = [];
        var cPermutations = [];
        var scheduleList = [];
        var invalidScheduleList = [];

        ////////////////
        function generateSchedule(courseList) {
            scheduleList.length = 0; //reset scheduleList
            invalidScheduleList.length = 0; //reset invalidScheduleList
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

                console.log('Section Permutations');
                console.log(sectionPermutations);
            }, this);

            var coursePermutations = cartesian(sectionPermutations);
            console.log('Course Permutations');
            console.log(coursePermutations);

            for (var schedule = 0; schedule < coursePermutations.length; schedule++) {
                var week = mapToWeek(coursePermutations[schedule]);
                if (!checkOverlap(week)) {
                    // if no overlaps
                    scheduleList.push(mapWeekToSchedule(week));
                } else if (invalidScheduleList.length < 6) {
                    invalidScheduleList.push(mapWeekToSchedule(week));
                }
                if (scheduleList.length > 6) {
                    break;
                }
            }

            shuffle(scheduleList);
            console.timeEnd('addCourse');
        }

        // Getters //
        function getSchedule() {
            return scheduleList;
        }

        function getInvalidSchedule() {
            return invalidScheduleList;
        }

        // Setters //

        function removeCourseFromSchedule(courseID) {


            scheduleList.forEach(function (schedule) {
                for (var i of reverseKeys(schedule)) {
                    if (schedule[i].courseID === courseID) {
                        schedule.splice(i, 1);
                    }
                }
            }, this);

            invalidScheduleList.forEach(function (schedule) {
                for (var i of reverseKeys(schedule)) {
                    if (schedule[i].courseID === courseID) {
                        schedule.splice(i, 1);
                    }
                }
            }, this);

        }

        function clearAll() {
            scheduleList.length = 0;
            invalidScheduleList.length = 0;
        }

        // Helpers //
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

        function* reverseKeys(arr) {
            var key = arr.length - 1;
            while (key >= 0) {
                yield key;
                key -= 1;
            }
        }
    }
})();