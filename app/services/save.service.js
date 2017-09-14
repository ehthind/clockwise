(function () {
    'use strict';

    angular
        .module('app')
        .service('saveService', saveService);

    function saveService($http) {

        this.loadSavedSchedules = loadSavedSchedules;
        this.loadSavedCourses = loadSavedCourses;
        this.getSavedSchedules = getSavedSchedules;
        this.getSavedCourses = getSavedCourses;

        var saved_schedules = [];
        var saved_courses = [];

        const schedulesUrl = "/api/databaseAPI/savedSchedules";
        const classesUrl = "/api/databaseAPI/savedClasses";

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

        // Getters //
        function getSavedSchedules() {
            return saved_schedules;
        }

        function getSavedCourses() {
            return saved_courses;
        }
        // Helper functions //

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