(function () {
    'use strict';
    
    angular
        .module('app')
        .service('saveService', saveService);

    function saveService($http) {

        this.loadSavedSchedules = loadSavedSchedules;
        this.getSavedSchedules = getSavedSchedules;
        
        var saved_schedules;
        const url = "/api/databaseAPI/schedules";

        ////////////////
        function loadSavedSchedules() {
            fetchSavedSchedules().then( function(schedules) {
                saved_schedules = schedules;
            });
        }

        // Getters //
        function getSavedSchedules() {
            return saved_schedules;
        }

        // Helper functions //

        function fetchSavedSchedules () {
            var data = {
                params: {
                    'userId': 79
                }
            };

            return $http.get(url, data).then(function (response) {
                return response.data;
            });
        }
    }
})();