angular
    .module('app.myTerm')
    .controller('termController', termController);

function termController($scope, $rootScope, $state, databaseService) {

    $scope.selectedTerm;
    var selected = false;

    $scope.setRsTerm = () => {
        let termToSeasonAndRange = {
            '01': {
                season: 'Spring',
                range: 'Jan - Apr'
            },

            '05': {
                season: 'Summer',
                range: 'May - Aug'
            },

            '09': {
                season: 'Fall',
                range: 'Sep - Dec'
            }
        }

        if ($scope.selectedTerm.length === 6) {
            let month = $scope.selectedTerm.substring(4, 6)
            if (month === '01' || month === '05' || month === '09') {
                var season = termToSeasonAndRange[month].season
                var range = termToSeasonAndRange[month].range
                var year = $scope.selectedTerm.substring(0, 4)
            } else {
                console.error(`In start.controller.js: var $scope.selectedTerm: {$scope.selectedTerm} does not end in the correct month.`);
                return;
            }
        } else {
            console.error(`In start.controller.js: var $scope.selectedTerm: {$scope.selectedTerm} is less than 6 characters`);
            return;
        }

        $rootScope.term.val = $scope.selectedTerm;
        $rootScope.term.season = season;
        $rootScope.term.range = range;
        $rootScope.term.year = year;
        selected = true;
    }

    $scope.clicked = (view) => {
        if(selected) {
            $state.go(view)
        }
    }

}