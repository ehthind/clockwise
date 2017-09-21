(function () {
    'use strict';

    angular
        .module('app')
        .service('saveService', saveService);

    function saveService($http, $rootScope, eventService) {

        this.loadSavedSchedules = loadSavedSchedules;
        this.loadSavedCourses = loadSavedCourses;
        this.saveSchedule = saveSchedule;        

        this.getSavedSchedules = getSavedSchedules;
        this.getSavedCourses = getSavedCourses;

        var saved_schedules = [];
        var saved_courses = [];
        var colorIndex = 0;

        const schedulesUrl = "/api/databaseAPI/savedSchedules";
        const classesUrl = "/api/databaseAPI/savedCourses";

        ////////////////

        function loadSavedSchedules() {

            fetchSavedSchedules().then((schedules) => {

                // empty the array.
                saved_schedules.length = 0

                schedules.forEach((schedule) => {
                    saved_schedules.push(schedule)
                }, this);

            });
        }

        function loadSavedCourses(courseId) {

            return (fetchSavedCourses(courseId).then((courses) => {

                // empty the array.
                saved_courses.length = 0

                courses.forEach((course) => {
                    saved_courses.push(course)
                }, this);
                return (courses)

            }));
        }

        function saveSchedule(name) {
            insertSchedule(name).then((insertId) => {
                let eventList = eventService.getUniqueCrns();

                eventList.forEach(function (course) {
                    if (course.schedule_type === 'Lecture' || course.schedule_type === 'Lecture Topic' || course.schedule_type === 'Gradable Lab') {

                        let insertData = {
                            'scheduleId': insertId,
                            'courseId': course.courseID,
                            'lec_crn': course.crn,
                            'lab_crn': null
                        }

                        for (var index = 0; index < eventList.length; index++) {
                            var lab = eventList[index];
                            if (course.courseID === lab.courseID && course.crn !== lab.crn) {
                                insertData.lab_crn = lab.crn;
                            }
                        }
                        
                        insertCourse(insertData).then((response) => {
                            console.log(response);
                        });
                    }
                }, this);
                console.log(eventList);
                console.log(insertId);
            });
        }



        // Getters //
        function getSavedSchedules() {
            return saved_schedules;
        }

        function getSavedCourses() {
            return saved_courses;
        }
        
        // Helper functions //

        var insertCourse = (course) => {

            return $http.post(classesUrl, course).then((response) => {
                return response.data;
            });

        }

        var insertSchedule = (name) => {
            var data = {
                'name': name,
                'term': $rootScope.term.val
            };

            return $http.post(schedulesUrl, data).then((response) => {
                return response.data;
            });

        }

        var fetchSavedCourses = (scheduleId) => {
            var data = {
                params: {
                    'scheduleId': scheduleId
                }
            };

            return $http.get(classesUrl, data).then((response) => {
                return response.data;
            });
        }

        var fetchSavedSchedules = () => {
            var data = {
                params: {
                    'userId': 79
                }
            };

            return $http.get(schedulesUrl, data).then((response) => {
                return response.data;
            });
        }
    }
})();