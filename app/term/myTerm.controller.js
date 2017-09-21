termController.$inject = ['$scope', '$rootScope', '$state', '$resource', '$moment', 'saveService', 'databaseService', 'eventService', 'scheduleService'];

angular
    .module('app.myTerm')
    .controller('termController', termController);

function termController($scope, $rootScope, $state, $resource, $moment, saveService, databaseService, eventService, scheduleService) {

    $scope.selectSavedOption = 'Choose a saved schedule'
    $scope.selectedTerm = false;
    $scope.selectedSchedule = false;
    $scope.termOptions = [{
            "term": "201705",
            "season": "Summer",
            "range": "May - Aug",
            "year": "2017"
        },
        {
            "term": "201709",
            "season": "Fall",
            "range": "Sep - Dec",
            "year": "2017"
        },
        {
            "term": "201801",
            "season": "Spring",
            "range": "Jan - Apr",
            "year": "2018"
        }
    ]

    saveService.loadSavedSchedules();
    $scope.scheduleOptions = saveService.getSavedSchedules();
    $scope.savedCourses = saveService.getSavedCourses();
    
    if ($scope.scheduleOptions.length > 0) {
        $scope.selectSavedOption = 'Select a saved timetable'
        
    } else {
        $scope.selectSavedOption = "No saved timetables found" 
    }


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
        $rootScope.termSet = true;
        selected = true;
    }

    $scope.stageNew = () => {
        databaseService.clearAll();
        eventService.clearAll();
        scheduleService.clearAll();

        scheduleCount = 0;
        invalidScheduleCount = 0;
    }

    $scope.stage = () => {
        databaseService.clearAll();
        eventService.clearAll();
        scheduleService.clearAll();

        scheduleCount = 0;
        invalidScheduleCount = 0;

        saveService.loadSavedCourses($scope.selectedSchedule.schedule_id).then((savedCourses) => {

            savedCourses.forEach((course) => {

                databaseService.getCourseInfo(course.course_id).then((response) => {

                    course.courseID = course.course_id
                    course.color = $rootScope.colorList[$rootScope.colorIndex];
                    course.altColor = $rootScope.altColorList[$rootScope.colorIndex];
                    course.alphaColor = $rootScope.alphaColorList[$rootScope.colorIndex];
                    course.name = response[0].name;
                    course.title = response[0].title;

                    $rootScope.colorIndex = ($rootScope.colorIndex + 1) % 8;


                    databaseService.addCourse(course).then((sections) => {

                        sections.forEach((section) => {

                            if (course.lec_crn === section.crn || course.lab_crn === section.crn) {
                                let momentStartTime = moment(section.start_time, ["h:mm A"]);
                                let momentEndTime = moment(section.end_time, ["h:mm A"]);
                                section.start_time_24h = momentStartTime.format("HH:mm");
                                section.end_time_24h = momentEndTime.format("HH:mm");

                                eventService.addEvent(section, course);
                            }
                        }, this);
                    });
                });


            }, this);

        });
    }

    $scope.changeView = (view) => {
        $state.go(view)
    }

}