(function() {
    'use strict';

    angular
        .module('app')
        .service('scheduleService', scheduleService);

    function scheduleService() {
        this.generateSchedule = generateSchedule;
        
        ////////////////

        function generateSchedule() { }
        }
})();