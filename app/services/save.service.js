(function () {
    'use strict';

    angular
        .module('app')
        .service('saveService', saveService);

    function saveService($http) {

        this.loadSavedSchedules = loadSavedSchedules;
        this.getSavedSchedules = getSavedSchedules;

        var saved_schedules = [];
        const url = "/api/databaseAPI/schedules";

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

        // Getters //
        function getSavedSchedules() {
            return saved_schedules;
        }

        // Helper functions //

        var fetchSavedSchedules = () => {
            var data = {
                params: {
                    'userId': 79
                }
            };

            return $http.get(url, data).then((response) => {
                return response.data;
            });
        }
    }
})();