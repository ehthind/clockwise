$(function() {


    // Prefetched data
    // ------------------------------

    // Constructs the suggestion engine
    var countries = new Bloodhound({
        datumTokenizer: Bloodhound.tokenizers.obj.whitespace('name'),
        queryTokenizer: Bloodhound.tokenizers.whitespace,
        limit: 10,
        prefetch: {

            // url points to a json file that contains an array of country names, see
            // https://github.com/twitter/typeahead.js/blob/gh-pages/data/countries.json
            url: 'assets/demo_data/typeahead/countries.json',

            // the json file contains an array of strings, but the Bloodhound
            // suggestion engine expects JavaScript objects so this converts all of
            // those strings
            filter: function(list) {
                return $.map(list, function(country) {
                    return {
                        name: country
                    };
                });
            }
        }
    });

    // Initialize engine
    countries.initialize();

    // Passing in `null` for the `options` arguments will result in the default options being used
    $('.typeahead-prefetched').typeahead({
        hint: true,
        highlight: true,
        minLength: 1,
    }, {
        name: 'countries',
        displayKey: 'name',
        limit: 6,

        // `ttAdapter` wraps the suggestion engine in an adapter that
        // is compatible with the typeahead jQuery plugin
        source: countries.ttAdapter()
    });

});
