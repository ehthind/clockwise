(function () {
    'use strict';

    angular
        .module('app')
        .service('databaseService', databaseService);

    function databaseService($http) {
        this.addCourse = addCourse;
        this.removeCourse = removeCourse;
        this.updateActiveCourse = updateActiveCourse;

        this.getCourses = getCourses;
        this.getSections = getSections;
        this.getActiveCourse = getActiveCourse;
        this.getActiveSections = getActiveSections;
        this.getCourseById = getCourseById;
        this.clearAll = clearAll;



        var url = "/api/databaseAPI";
        var courses = [];
        var sections = [];
        var activeCourse = [];
        var activeSections = [];
        ////////////////

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


            return (fetchSections(data.courseID).then(function (section) {
                sections.push(
                    section
                );
                courses.push({
                    'courseID': data.courseID,
                    'name': data.name,
                    'title': data.title,
                    'color': data.color,
                    'altColor': data.altColor,
                    'alphaColor': data.alphaColor,
                    section
                });

                if (courses.length === 1) {
                    updateActiveCourse(data.courseID);
                }
                return 'temp';

            }));
        }

        function* reverseKeys(arr) {
            var key = arr.length - 1;
            while (key >= 0) {
                yield key;
                key -= 1;
            }
        }

        function removeCourse(courseID) {

            var response = findCourse(courseID);

            if (response != null) {
                courses.splice(response.index, 1);
                if (activeCourse[0].courseID === courseID) {
                    activeCourse.length = 0;
                    activeSections.length = 0;
                }
                return;
            } else {
                console.log('In database.service.js, updateActiveCourse() \n Failed to find courseID ' + courseID);
            }
        }

        function clearAll() {
            courses.length = 0;
            sections.length = 0;
            activeCourse.length = 0;
            activeSections.length = 0;
        }

        function updateActiveCourse(courseID) {
            var response = findCourse(courseID);

            if (response != null) {
                activeCourse.length = 0;
                var newActiveCourse = {
                    'courseID': response.course.courseID,
                    'name': response.course.name,
                    'title': response.course.title,
                    'color': response.course.color,
                    'altColor': response.course.altColor,
                    'alphaColor': response.course.alphaColor
                };
                activeCourse.push(newActiveCourse);
                activeSections.length = 0;
                activeSections.push(response.course.section);

            } else {
                console.log('In database.service.js, updateActiveCourse() \n Failed to find courseID ' + courseID);
            }

        }

        // Getters //

        function getCourses() {
            return courses;
        }

        function getSections() {
            return sections;
        }

        function getActiveSections() {
            return activeSections;
        }

        function getActiveCourse() {
            return activeCourse;
        }

        function getCourseById(courseID) {
            var response = findCourse(courseID);

            if (response != null) {
                var course = response.course;
                return course;
            } else {
                return null;
            }
        }

        // Helper functions //

        function fetchSections(courseID) {
            var data = {
                params: {
                    'courseID': courseID
                }
            };

            return $http.get(url, data).then(function (response) {
                return response.data;
            });
        }


        function findCourse(courseID) {
            for (var i = 0; i < courses.length; i++) {
                if (courses[i].courseID === courseID) {
                    var index = i;
                    var course = courses[i];
                    var response = {
                        'index': index,
                        'course': course
                    };
                    return response;
                }
            }
            return null;
        }
    }
})();