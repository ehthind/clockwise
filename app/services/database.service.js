(function () {
    'use strict';

    angular
        .module('app')
        .service('databaseService', databaseService);

    function databaseService($http) {
        this.addCourse = addCourse;
        this.removeCourse = removeCourse;
        this.getCourses = getCourses;

        var url = "/api/databaseAPI";
        var courses = [];
        ////////////////

        function fetchSections(courseID) {
            var data = {
                params: {
                    'courseID': courseID
                }
            };

            return $http.get(url, data).then(function (response) {
                return response.data
            });
        }

        function addCourse(data) {
            var i;
            for (i = 0; i < courses.length; i++) {
                if (courses[i].courseID === data.courseID) {
                    return;
                }
            }

            var request = {
                params: {
                    'courseID': data.courseID
                }
            };

            fetchSections(data.courseID).then(function (section) {
                courses.push({
                    'courseID': data.courseID,
                    'name': data.name,
                    'title': data.title,
                    section
                });
            });
        }

        function removeCourse(courseID) {
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].courseID === courseID) {
                    courses.splice(i,1);
                    return;
                }
            }
        }

        function getCourses() {
            return courses;
        }
    }
})();