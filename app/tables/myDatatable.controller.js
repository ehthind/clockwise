angular
    .module('app.datatable')
    .controller('datatableController', datatableController);

function datatableController(DTOptionsBuilder, DTColumnDefBuilder, $resource) {
    var vm = this;
    vm.persons = [];
    vm.dtOptions = DTOptionsBuilder.newOptions()
        .withScroller()
        .withOption('deferRender', true)
        .withOption('scrollY', 200)
        .withOption('responsive', true)
        ;
    vm.dtColumnDefs = [
        DTColumnDefBuilder.newColumnDef(0),
        DTColumnDefBuilder.newColumnDef(1),
        DTColumnDefBuilder.newColumnDef(2)
    ];
    $resource('assets/data/data.json').query().$promise.then(function (persons) {
        vm.persons = persons;
    });
    // $resource('assets/data/data.json').query().$promise.then(function (persons) {
    //     vm.persons = persons;
    // });
}