$(document).ready(function(){
    $('#form').validate({ // initialize the plugin
        errorClass: 'text-danger',
        rules: {
            name_ar: {
                required: true
            },
            father_name: {
                required: true
            },
            grand_name: {
                required: true
            },
            family_name: {
                required: true
            },
            id_number: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            hospital_id: {
                required: true,
            },
            department_id: {
                required: true,
            },
            file_number: {
                required: true,
            },
            physician: {
                required: true,
            },
            birth_date_g: {
                required: true,
            },
            birth_date_h: {
                required: true,
            },
            provider_name: {
                required: true,
            },
            provider_id_number: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            relationship_id: {
                required: true,
            },
            patient_type_id: {
                required: true,
            },
            patient_type_other: {
                required: true,
            },
            report_type_id: {
                required: true,
            },
            report_type_other: {
                required: true,
            },
            report_purpose_id: {
                required: true,
            },
            purpose_details: {
                required: true,
            },
            email: {
                email: true
            },
            mobile: {
                required: true,
                regx: /05[0-9]{8}/,
            },
            captcha: {
                required: true,
            },
        }
    });
});

$.validator.addMethod("regx", function(value, element, regexpr) {
    return regexpr.test(value);
}, "صيغة رقم الجوال غير صحيحة ********05");

$.validator.setDefaults({
    // errorElement: "span",
    // errorClass: "help-block",
    // //	validClass: 'stay',
    // highlight: function (element, errorClass, validClass) {
    //     $(element).addClass(errorClass); //.removeClass(errorClass);
    //     $(element).closest('.form-group').removeClass('has-success').addClass('has-error');
    // },
    // unhighlight: function (element, errorClass, validClass) {
    //     $(element).removeClass(errorClass); //.addClass(validClass);
    //     $(element).closest('.form-group').removeClass('has-error');
    // },
    errorPlacement: function (error, element) {
        if (element.parent('.input-group').length) {
            error.insertAfter(element.parent());
        } else if (element.hasClass('select2')) {
            error.insertAfter(element.next('span'));
        } else {
            error.insertAfter(element);
        }
    }
});
