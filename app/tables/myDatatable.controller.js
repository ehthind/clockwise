angular
    .module('app.datatable')
    .controller('datatableController', datatableController);

function datatableController($scope, DTOptionsBuilder, DTColumnDefBuilder, $resource, databaseService) {
    // $scope.courseList = databaseService.getCourses();
    var $scope = this;
    $scope.sectionList = databaseService.getSections();
    $scope.dtOptions = DTOptionsBuilder.newOptions()
        .withScroller()
        .withOption('deferRender', true)
        .withOption('scrollY', 200)
        .withOption('responsive', true);
    $scope.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2),
        DTColumnDefBuilder.newColumnDef(3),
        DTColumnDefBuilder.newColumnDef(4),
        DTColumnDefBuilder.newColumnDef(5),
        DTColumnDefBuilder.newColumnDef(6),
        DTColumnDefBuilder.newColumnDef(7),
        DTColumnDefBuilder.newColumnDef(8),
        DTColumnDefBuilder.newColumnDef(9)
    ];
    // $resource('assets/data/data.json').query().$promise.then(function (persons) {
    //     vm.persons = persons;
    // });
}