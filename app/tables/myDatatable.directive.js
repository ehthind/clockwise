(function () {
    'use strict';

    angular
        .module('app.datatable')
        .directive('mydatatable', mydatatable);

    function mydatatable() {
        // Usage:
        //
        // Creates:
        //
        return {
            restrict: 'E',
            templateUrl: 'app/tables/myDatatable.html'
        };

    }
})();