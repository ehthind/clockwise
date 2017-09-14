    termController.$inject = ['$scope', '$rootScope', '$state', '$resource', 'saveService'];

    angular
        .module('app.myTerm')
        .controller('termController', termController);

    function termController($scope, $rootScope, $state, $resource, saveService) {

        $scope.selectedTerm = false;
        $scope.selectedSchedule = false;

        $scope.termOptions = [
            {"term":"201705","season":"Summer","range":"May - Aug","year":"2017"},
            {"term":"201709","season":"Fall","range":"Sep - Dec","year":"2017"},
            {"term":"201801","season":"Spring","range":"Jan - Apr","year":"2018"}
        ]
        
        saveService.loadSavedSchedules();                        
        $scope.scheduleOptions = saveService.getSavedSchedules();
        

        $scope.setRsTerm = (newTerm) => {
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

            if (newTerm.term.length === 6) {
                let month = newTerm.term.substring(4, 6)
                if (month === '01' || month === '05' || month === '09') {
                    var season = termToSeasonAndRange[month].season
                    var range = termToSeasonAndRange[month].range
                    var year = newTerm.term.substring(0, 4)
                } else {
                    console.error(`In start.controller.js: var newTerm.term: ${newTerm.term} does not end in the correct month.`);
                    return;
                }
            } else {
                console.error(`In start.controller.js: var newTerm.term: ${newTerm.term} is less than 6 characters`);
                return;
            }

            $rootScope.term.val = newTerm.term;
            $rootScope.term.season = season;
            $rootScope.term.range = range;
            $rootScope.term.year = year;
            selected = true;
        }

        $scope.changeView = (view) => {
            $state.go(view)
        }

    }