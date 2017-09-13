angular
    .module('app.mySidebar')
    .controller('sidebarController', sidebarController);

function sidebarController($scope, $rootScope, databaseService) {

    $scope.changeRsTerm = (newTerm) => {
        let termToSeasonAndRange = {
            01: {
                season: 'Spring',
                range: 'Jan - Apr'
            },

            05: {
                season: 'Summer',
                range: 'May - Aug'
            },

            09: {
                season: 'Fall',
                range: 'Sep - Dec'
            }
        }

        if (newTerm.length === 6) {
            let month = newTerm.substring(4, 6)
            if (month === '01' || month === '05' || month === '09') {
                var season = termToSeasonAndRange[month].season
                var range = termToSeasonAndRange[month].range
                var year = newTerm.substring(0, 4)
            } else {
                console.error(`In start.controller.js: var newTerm: {$newTerm} does not end in the correct month.`);
                return;
            }
        } else {
            console.error(`In start.controller.js: var newTerm: {$newTerm} is less than 6 characters`);
            return;
        }

        $rootScope.term.val = newTerm;
        $rootScope.term.season = season;
        $rootScope.term.range = range;
    }

}