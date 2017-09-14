(function () {
    'use strict';

    angular
        .module('app.myDatatable')
        .controller('datatableController', datatableController);

    function datatableController(DTOptionsBuilder, DTColumnDefBuilder, $resource, $moment, $timeout, databaseService, eventService) {
        // vm.courseList = databaseService.getCourses();
        var timer;
        var shadowEventRan = false;
        var vm = this;
        vm.sectionList = databaseService.getActiveSections();
        vm.activeCourse = databaseService.getActiveCourse();
        vm.events = eventService.getEvents();
        vm.getUniqueEvents = function() {
            var crnList = [];
            for (var index = 0; index < vm.events.length; index++) {
                var event = vm.events[index];
                if(crnAlready(event.crn, crnList)) {
                    continue;
                }
                crnList.push(event);
            }
            return crnList;
        };

        function crnAlready(crn, crnList) {
            for (var index = 0; index < crnList.length; index++) {
                if(crn === crnList[index].crn) {
                    return true;
                }
            }
            return false;
        }

        vm.dtOptions = DTOptionsBuilder.newOptions()
            .withScroller()
            .withOption('deferRender', true)
            .withOption('scrollY', 200)
            .withOption("pageLength", 100)
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
        };

        vm.newEvent = function (section) {

            var momentStartTime = moment(section.start_time, ["h:mm A"]);
            var momentEndTime = moment(section.end_time, ["h:mm A"]);
            section.start_time_24h = momentStartTime.format("HH:mm");
            section.end_time_24h = momentEndTime.format("HH:mm");

            eventService.addEvent(section, vm.activeCourse[0]);
        };

        vm.ShadowEvent = function (show, section) {

            if (show) { // mouseEnter event
                /**
                 * set timeout so function calls are not wasted
                 * when user is scrolling over datatable.
                 */
                timer = $timeout(function () {
                    shadowEventRan = true; // timer timed out
                    var momentStartTime = moment(section.start_time, ["h:mm A"]);
                    var momentEndTime = moment(section.end_time, ["h:mm A"]);
                    section.start_time_24h = momentStartTime.format("HH:mm"); // eventService requires 24h start time format
                    section.end_time_24h = momentEndTime.format("HH:mm"); // eventService requires 24h end time format

                    eventService.addShadowEvent(section, vm.activeCourse[0]);
                }, 100);
            } else { // mouseLeave event
                $timeout.cancel(timer); // cancel so addShadowEvent does not run

                if (shadowEventRan) { // if timer timed out
                    shadowEventRan = false;
                    eventService.removeShadowEvent(section.crn);
                }
            }
        };
    }
})();