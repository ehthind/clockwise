(function () {
    'use strict';

    angular
        .module('app.myDatatable')
        .directive('myDatatable', myDatatable);

    function myDatatable() {
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