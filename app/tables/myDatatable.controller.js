(function () {
    'use strict';

    angular
        .module('app.myDatatable')
        .controller('datatableController', datatableController);

    function datatableController(DTOptionsBuilder, DTColumnDefBuilder, $resource, $moment, databaseService, eventService) {
        // vm.courseList = databaseService.getCourses();

        var vm = this;
        vm.sectionList = databaseService.getActiveSections();
        vm.activeCourse = databaseService.getActiveCourse();
        vm.events = eventService.getEvents();

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
        ];

        vm.isSelected = function (crn) {
            for (var i = 0; i < vm.events.length; i++) {
                if (vm.events[i].crn === crn) {
                    return true;
                }
            }
            return false;
        }

        vm.newEvent = function (sectionData) {

            var momentStartTime = moment(sectionData.start_time, ["h:mm A"]);
            var momentEndTime = moment(sectionData.end_time, ["h:mm A"]);
            sectionData.start_time_24h = momentStartTime.format("HH:mm");
            sectionData.end_time_24h = momentEndTime.format("HH:mm");

            eventService.addEvent(sectionData, vm.activeCourse[0]);
        }

        vm.newShadowEvent = function (sectionData) {
            var momentStartTime = moment(sectionData.start_time, ["h:mm A"]);
            var momentEndTime = moment(sectionData.end_time, ["h:mm A"]);
            sectionData.start_time_24h = momentStartTime.format("HH:mm");
            sectionData.end_time_24h = momentEndTime.format("HH:mm");

            eventService.addShadowEvent(sectionData, vm.activeCourse[0]);
        }

        vm.removeShadowEvent = function (sectionCrn) {
            eventService.removeShadowEvent(sectionCrn);
        }
        // $resource('assets/data/data.json').query().$promise.then(function (persons) {
        //     vm.persons = persons;
        // });
    }
})();