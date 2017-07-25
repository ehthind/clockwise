angular.module('app.myDatatable', ['datatables', 'datatables.scroller', 'datatables.bootstrap', 'datatables.select', 'ngResource', 'angular-momentjs']).run(function (DTDefaultOptions) {
    // Display 25 items per page by default
    DTDefaultOptions.setDisplayLength(5);
});