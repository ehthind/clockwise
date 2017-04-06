$(function() {


    // Prefetched data
    // ------------------------------

    // Constructs the suggestion engine
    var courses = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        prefetch: {


            url: 'assets/data/summer2017.json',

            // the json file contains an array of strings, but the Bloodhound
            // suggestion engine expects JavaScript objects so this converts all of
            // those strings
            filter: function(list) {
                return $.map(list, function(course) {
                    return {
                        name: course
                    };
                });
            }
        }
    });

    // Initialize engine
    courses.initialize();

    // Passing in `null` for the `options` arguments will result in the default options being used
    $('#scrollable-dropdown-menu .typeahead-prefetched').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
    }, {
        name: 'courses',
        displayKey: 'name',
        limit: 1000,

        // `ttAdapter` wraps the suggestion engine in an adapter that
        // is compatible with the typeahead jQuery plugin
        source: courses.ttAdapter()
    });

});
