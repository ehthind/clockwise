(function () {
    'use strict';

    angular
        .module('app.datatable')
        .controller('datatableController', datatableController);

    function datatableController(DTOptionsBuilder, DTColumnDefBuilder, $resource, databaseService, eventService) {
        // vm.courseList = databaseService.getCourses();

        var vm = this;
        vm.sectionList = databaseService.getActiveSections();
        vm.activeCourse = databaseService.getActiveCourse();

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withScroller()
            .withOption('deferRender', true)
            .withOption('scrollY', 200)
            .withOption('responsive', true)
            .withDOM('t');
        vm.dtColumnDefs = [
            DTColumnDefBuilder.newColumnDef(0),
            DTColumnDefBuilder.newColumnDef(1),
            DTColumnDefBuilder.newColumnDef(2),
            DTColumnDefBuilder.newColumnDef(3),
            DTColumnDefBuilder.newColumnDef(4),
            DTColumnDefBuilder.newColumnDef(5),
            DTColumnDefBuilder.newColumnDef(6),
            DTColumnDefBuilder.newColumnDef(7),
            DTColumnDefBuilder.newColumnDef(8),
        ];

        vm.newEvent = function (sectionData) {
            eventService.addEvent(sectionData, vm.activeCourse[0]);
        }       
         // $resource('assets/data/data.json').query().$promise.then(function (persons) {
        //     vm.persons = persons;
        // });
    }
})();