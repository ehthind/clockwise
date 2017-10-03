(function () {
    'use strict';

    angular
        .module('app')
        .service('saveService', saveService);

    function saveService($rootScope, $http, eventService) {

        // Public functions
        this.loadSavedSchedules = loadSavedSchedules;
        this.loadSavedCourses = loadSavedCourses;
        this.saveSchedule = saveSchedule;

        this.getSavedSchedules = getSavedSchedules;
        this.getSavedCourses = getSavedCourses;

        // Globals
        var savedSchedule = [];
        var savedCourses = [];
        var colorIndex = 0;

        // API end points
        const scheduleEndPoint = "/api/databaseAPI/savedSchedules";
        const courseEndPoint = "/api/databaseAPI/savedCourses";

        ////////////////



        /**
         * Invokes a get request which returns all saved schedules
         * for the logged in user. Updates 'savedSchedule' with
         * get result data.
         */

        function loadSavedSchedules() {

            getRequest({

                url: scheduleEndPoint,
                params: {}

            }).then(schedules => {

                // empty the array.
                savedSchedule.length = 0

                schedules.forEach(schedule => {
                    savedSchedule.push(schedule)
                }, this);

            }).catch(err => {
                console.error(err)
            });
        }



        /**
         * Invokes a get request which returns all saved courses
         * for a particular schedule. Updates 'savedCourses' accordingly
         * 
         * @param {Number} scheduleId 
         */

        function loadSavedCourses(scheduleId) {

            return (getRequest({
                
                'url': courseEndPoint,
                'params': {
                    'scheduleId': scheduleId
                }

            }).then((courses) => {
                // Empty the array.
                savedCourses.length = 0

                courses.forEach(course => {
                    savedCourses.push(course)
                }, this);

                return (courses)

            }).catch(err => {
                console.error(err)
            }));
        }



        /**
         * Invokes a post request which will save the state of
         * of the current schedule for the logged in user. Accesses
         * the current state of events via 'eventService' Preforms
         * data validation before posting.
         * 
         * @param {String} scheduleName 
         */

        function saveSchedule(scheduleName) {

            postRequest({
                'url': scheduleEndPoint,
                'params': {
                    'name': scheduleName,
                    'term': $rootScope.term.val
                }

            }).then((insertId) => {
            
                saveState(insertId)
            
            }).catch(err => {
                console.error(err)
            });
        }

        const saveState = (insertId) => {
            
            let eventList = eventService.getUniqueCrns();

            eventList.forEach(function (course) {
                // Ensure course is one of 3 allowed lecture types.
                if (course.schedule_type === 'Lecture' || course.schedule_type === 'Lecture Topic' || course.schedule_type === 'Gradable Lab') {

                    let postData = {
                        'scheduleId': insertId,
                        'courseId': course.courseID,
                        'lec_crn': course.crn,
                        'lab_crn': null // incase course has no lab section.
                    }

                    for (var index = 0; index < eventList.length; index++) {
                        var lab = eventList[index];
                        // Ensure current event type is a 'lab'.
                        if (course.courseID === lab.courseID && course.crn !== lab.crn) {
                            postData.lab_crn = lab.crn;
                        }
                    }

                    postRequest({
                        url: courseEndPoint,
                        params: postData
                    })
                }
            });
        }



        // Getters //

        function getSavedSchedules() {
            return savedSchedule;
        }

        function getSavedCourses() {
            return savedCourses;
        }


        // Request generators //

        const getRequest = options =>
            $http.get(options.url, options.params).then(response => response.data).catch(err => console.error(err))

        const postRequest = options =>
            $http.post(options.url, options.params).then(response => response.data).catch(err => console.error(err))
    }
})();