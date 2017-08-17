/* ------------------------------------------------------------------------------
 *
 *  # Form validation
 *
 *  Specific JS code additions for form_validation.html page
 *
 *  Version: 1.3
 *  Latest update: Feb 5, 2016
 *
 * ---------------------------------------------------------------------------- */

$(function () {


    // Form components
    // -----------------------------

    // Setup validation
    // ------------------------------

    // Initialize
    var validator = $(".form-validate-jquery").validate({
        ignore: 'input[type=hidden], .select2-search__field', // ignore hidden fields
        errorClass: 'validation-error-label',
        successClass: 'validation-valid-label',
        highlight: function (element, errorClass) {
            $(element).removeClass(errorClass);
        },
        unhighlight: function (element, errorClass) {
            $(element).removeClass(errorClass);
        },

        // Different components require proper error label placement
        errorPlacement: function (error, element) {

            // Unstyled checkboxes, radios
            if (element.parents('div').hasClass('checkbox') || element.parents('div').hasClass('radio')) {
                error.appendTo(element.parent().parent().parent());
            }

            // Input with icons and Select2
            else if (element.parents('div').hasClass('has-feedback') || element.hasClass('select2-hidden-accessible')) {
                error.appendTo(element.parent());
            }

            // Inline checkboxes, radios
            else if (element.parents('label').hasClass('checkbox-inline') || element.parents('label').hasClass('radio-inline')) {
                error.appendTo(element.parent().parent());
            }
        },
        validClass: "validation-valid-label",
        success: function (label) {
            label.addClass("validation-valid-label").text("Success.")
        },
        rules: {
            password: {
                minlength: 5,
                maxlength: 100,
                pattern: "^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$"
            },
            repeat_password: {
                minlength: 5,
                maxlength: 100,
                equalTo: "#password",
                pattern: "^[a-zA-Z0-9!@#\$%\^\&*\)\(+=._-]+$"

            },
            email: {
                email: true,
                minlength: 4,
                maxlength: 100
            },
            username: {
                minlength: 4,
                maxlength: 15,
                pattern: "^[A-Za-z0-9_-]+$",
            }
        },
        messages: {
            username: {
                pattern: "Can only contain letters, numbers and underscores"
            },
            password: {
                pattern: "Can only contain letters, numbers and special characters"
            },
            repeat_password: {
                pattern: "Can only contain letters, numbers and special characters",
                equalTo: "Re-enter the same password as above"
            }
        }
    });

});