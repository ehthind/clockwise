(function () {
    'use strict';

    angular
        .module('app.exportModal',[])
        .directive('exportModal', exportModal);

    function exportModal() {
        // Usage:
        //
        // Creates:
        //
        return {
            restrict: 'E',
            templateUrl: 'app/sidebar/exportModal.html'
        };

    }
})();