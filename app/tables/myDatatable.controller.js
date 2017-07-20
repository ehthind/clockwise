(function () {
    'use strict';

    angular
        .module('app.datatable')
        .controller('datatableController', datatableController);

    function datatableController(DTOptionsBuilder, DTColumnDefBuilder, $resource, $moment, databaseService, eventService) {
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
            DTColumnDefBuilder.newColumnDef(1).notSortable(),
            DTColumnDefBuilder.newColumnDef(2).notSortable(),
            DTColumnDefBuilder.newColumnDef(3).notSortable(),
            DTColumnDefBuilder.newColumnDef(4).notSortable(),
            DTColumnDefBuilder.newColumnDef(5).notSortable(),
            DTColumnDefBuilder.newColumnDef(6).notSortable(),
            DTColumnDefBuilder.newColumnDef(7).notSortable(),
            DTColumnDefBuilder.newColumnDef(8).notSortable()
        ];

        vm.newEvent = function (sectionData) {

            var momentStartTime = moment(sectionData.start_time, ["h:mm A"]);
            var momentEndTime = moment(sectionData.end_time, ["h:mm A"]);
            sectionData.start_time_24h = momentStartTime.format("HH:mm");
            sectionData.end_time_24h = momentEndTime.format("HH:mm");

            eventService.addEvent(sectionData, vm.activeCourse[0]);
        }
        // $resource('assets/data/data.json').query().$promise.then(function (persons) {
        //     vm.persons = persons;
        // });
    }
})();