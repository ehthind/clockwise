(function () {
    'use strict';

    angular
        .module('app')
        .service('databaseService', databaseService);

    function databaseService($http) {
        this.addCourse = addCourse;
        this.removeCourse = removeCourse;
        this.getCourses = getCourses;
        this.getSections = getSections;
        this.getActiveCourse = getActiveCourse;
        this.getActiveSections = getActiveSections;
        this.updateActiveCourse = updateActiveCourse;



        var url = "/api/databaseAPI";
        var courses = [];
        var sections = [];
        var activeCourse = [];
        var activeSections = [];
        ////////////////


        function updateActiveCourse(courseID) {
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].courseID === courseID) {
                    activeCourse.length = 0;
                    activeCourse.push(courses[i]);
                    activeSections.length = 0;
                    activeSections.push(courses[i].section);
                }
            }
        }

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
                sections.push(
                    section
                );
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
                    courses.splice(i, 1);
                    if (activeCourse[0].courseID === courseID) {
                        activeCourse.length = 0;
                        activeSections.length = 0;
                    }
                    return;
                }
            }
        }

        function getActiveSections() {
            return activeSections;
        }

        function getActiveCourse() {
            return activeCourse;
        }

        function getCourses() {
            return courses;
        }

        function getSections(params) {
            return sections;
        }
    }
})();