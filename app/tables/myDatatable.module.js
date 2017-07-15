angular.module('app.datatable', ['datatables', 'datatables.scroller', 'datatables.bootstrap', 'datatables.select', 'ngResource']).run(function (DTDefaultOptions) {
    // Display 25 items per page by default
    DTDefaultOptions.setDisplayLength(5);
});