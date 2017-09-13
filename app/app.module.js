angular.module('app', ['app.mySidebar', 'app.myDatatable', 'app.myCalendar', 'app.exportModal', 'jlareau.pnotify', 'utils.autofocus'])
.run(function($rootScope) {
    $rootScope.term = {
        val: '',
        season: '',
        range: ''
    };
})
