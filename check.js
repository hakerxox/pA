$(document).ready(function(){
    $('#check-form').validate({ // initialize the plugin
        errorClass: 'text-danger',
        rules: {
            id_number: {
                required: true,
                digits: true,
                minlength: 10,
                maxlength: 10
            },
            app_number: {
                required: true,
                digits: true,
                minlength: 11,
                maxlength: 11
            },
            mobile: {
                required: true,
                regx: /9665[0-9]{8}/,
            },
            captcha: {
                required: true,
            },
        }
    });
});

$.validator.addMethod("regx", function(value, element, regexpr) {
    return regexpr.test(value);
}, "صيغة رقم الجوال غير صحيحة");

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

$(".btn-refresh").click(function(){
    $.ajax({
        type:'GET',
        url:'refresh_captcha',
        success:function(data){
            $(".captcha span").html(data.captcha);
        }
    });
});

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
getRecaptcha();
$(document).on('submit', 'form#check-form', function (e){
    e.preventDefault();
    $('#ajax_button').attr("disabled", true);
    $('#spin').addClass('fa fa-spinner fa-spin');

    let form = $(this);
    let data =new FormData($(this)[0]);
    let url = form.attr("actions");
    $.ajax({
        beforeSend: function () {
            // $.blockUI({message: '<h5><img src="images/lo.svg" /> جاري البــــــــحث ....</h5>'});
        },
        type: form.attr('method'),
        url:url,
        data:data,
        cache: false,
        contentType: false,
        processData: false,
        success:function(data){
            getRecaptcha();
            if (data.success != null){
                // moment.locale('ar');
                // $.ajax({
                //     type:'GET',
                //     url:'refresh_captcha',
                //     success:function(data){
                //         $(".captcha span").html(data.captcha);
                //     }
                // });
                // $("#captcha").val("");
                $("span.res").html('');
                $("#result").show();
                $("#st2").hide();
                $("#st3").hide();
                $("#st4").hide();
                $("#app_num").append(data.success['application_number']);
                $("#name").append(data.success['name_ar']);
                $("#id_num").append(data.success['id_number']);
                $("#app_date").append(moment(data.success['created_at']).format('DD-MM-YYYY / hh:mm a'));

                switch(data.success['application_status']) {
                    case '1':
                        $("#st2").show();
                        $("#st3").show();
                        $("#response").append(moment(data.success['worked_at']).format('DD-MM-YYYY / hh:mm a'));
                        $("#status").append('تم قبــــول الطلب');
                        break;
                    case '2':
                        $("#st2").show();
                        $("#st3").hide();
                        $("#st4").hide();
                        $("#response").append('تم رفــــض الطلب <br>');
                        $("#response").append(moment(data.success['worked_at']).format('DD-MM-YYYY / hh:mm a'));
                        $("#status").append(data.success['rejected_reason']);
                        break;
                    default:
                        $("#st2").show();
                        $("#st3").hide();
                        $("#st4").hide();
                        $("#response").append('في إنتظـــار الرد');
                        $("#status").append('<img src="images/lo.svg" />');
                }
                if (data.success['done_at'] === null){
                    $("#done").append('<img src="images/lo.svg" />');
                    $("#message").append('جـــــاري تجهيــــــز التقرير');
                }
                else {
                    $("#st4").show();
                    $("#done").append(moment(data.success['done_at']).format('DD-MM-YYYY / hh:mm a'));
                    $("#message").append('التقريـــــــر جــــــاهز للإستــــــلام');
                }
                if (data.success['received_at'] === null){

                    $("#receive").append('<img src="images/lo.svg" />');
                    $("#message2").append('لم يتـــم الإستــــــــلام');
                }
                else {
                    $("#receive").append(moment(data.success['received_at']).format('DD-MM-YYYY / hh:mm a'));
                    $("#message2").append('تم إستــــــــلام التقريـــــــر');
                }
                // $('#reply_form')[0].reset();
            }
            else {
                swal({
                    title: 'خطأ',
                    text: data.error,
                    type: 'error',
                    confirmButtonText: 'إغـــلاق'
                });
                // $("#result").load(location.href + " #result");
            }
            //$('#frm')[0].reset();
            // $("#result").load(location.href + " #result");

        },
        error: function (xhr, textStatus, errorThrown, data)
        {
            getRecaptcha();
            swal({
                title: 'خطأ',
                text: data.error,
                type: 'error',
                confirmButtonText: 'إغـــلاق'
            });
            // $.ajax({
            //     type:'GET',
            //     url:'refresh_captcha',
            //     success:function(data){
            //         $(".captcha span").html(data.captcha);
            //     }
            // });
            // $("#captcha").val("");
        },
        complete: function(){
            $.unblockUI();
            $('#ajax_button').attr("disabled", false);
            $('#spin').removeClass('fa fa-spinner fa-spin');
        }
    });
});
