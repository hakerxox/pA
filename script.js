$.fn.select2.defaults.set("theme", "bootstrap");
$('.select2').select2({
    placeholder: "---أختر---",
    allowClear: true,
    language: "ar",
    dir: "rtl",
    width: '100%'
});

$('#hospital_id').on('change', function() {
    let stateID = $(this).val();
    if(stateID) {
        $.ajax({
            beforeSend: function () {
                $.blockUI({ message: '<h5><img src="images/lo.svg" />جاري التحميــــــل ....</h5>' });
            },
            url:'getDepartmentList/'+stateID,
            type: "GET",
            data : {"_token":$('[name="csrf-token"]').attr('content')},
            dataType: "json",
            complete: function () {
                $.unblockUI();
            },
            success:function(data) {
                //console.log(data);
                if(data){
                    $('#department_id').empty();
                    $('#department_id').focus;
                    $('#department_id').append('<option value="">---- أختر ----</option>');
                    $.each(data, function(key, value){
                        $('select[name="department_id"]').append('<option value="'+ value.id +'">' + value.name+ '</option>');
                    });
                }else{
                    $('#department_id').empty();
                }
            }
        });
    }else{
        $('#department_id').empty();
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

$('#patient_type_id').change(function () {
    let value = $(this).val();
    if (value === '3') {
        $('#patient_other').attr("hidden", false);
    }
    else {
        $('#patient_other').attr("hidden", true);
        $("#patient_type_other").val("");
    }
});
$('#report_type_id').change(function () {
    let value = $(this).val();
    if (value === '4') {
        $('#report_other').attr("hidden", false);
    }
    else {
        $('#report_other').attr("hidden", true);
        $("#report_type_other").val("");
    }
});

let calendarHijri,
    calendarGreg;

jQuery(document).ready(function () {
    calendarHijri = $.calendars.instance('ummalqura');
    calendarGreg = $.calendars.instance('gregorian', 'ar-EG');

    $('#birth_date_h').calendarsPicker({
        maxDate: +0,
        calendar: calendarHijri,
        dateFormat: 'yyyy-mm-dd',
        onSelect: function (dates) {
            let date = dates[0];
            let cdate = calendarGreg.fromJD(calendarHijri.toJD(date));
            let day = (cdate.day() >= 10) ? cdate.day() + '' : '0' + cdate.day();
            let month = (cdate.month() >= 10) ? cdate.month() + '' : '0' + cdate.month();
            document.getElementById('birth_date_g').value = cdate.formatYear() + '-' + month + '-' + day;
        },
    });

    $('#birth_date_g').calendarsPicker({
        maxDate: +0,
        calendar: calendarGreg,
        dateFormat: 'yyyy-mm-dd',
        onSelect: function (dates) {
            let date = dates[0];
            let cdate = calendarHijri.fromJD(calendarGreg.toJD(date));
            let day = (cdate.day() >= 10) ? cdate.day() + '' : '0' + cdate.day();
            let month = (cdate.month() >= 10) ? cdate.month() + '' : '0' + cdate.month();
            document.getElementById('birth_date_h').value = cdate.formatYear() + '-' + month + '-' + day;
        }
    });
});

$.ajaxSetup({
    headers: {
        'X-CSRF-TOKEN': $('meta[name="csrf-token"]').attr('content')
    }
});
$(document).on('submit', 'form#form', function (e){
    e.preventDefault();
    $('#ajax_button').attr("disabled", true);
    $('#spin').addClass('fa fa-spinner fa-spin');

    let form = $(this);
    let data =new FormData($(this)[0]);
    let url = form.attr("action");
    $.ajax({
        beforeSend: function () {
            $.blockUI({message: '<h5><img src="images/lo.svg" /> جاري الإرســـــــال ....</h5>'});
        },
        type: form.attr('method'),
        url:url,
        data:data,
        cache: false,
        contentType: false,
        processData: false,
        success:function(data){
            if (data.success != null){
                swal({
                    title: data.success,
                    text: '',
                    type: 'success',
                    confirmButtonText: 'حسنا'
                }).then((value) =>{
                    // window.location.href = "{{ url('/') }}";
                    $('#form').trigger("reset");
                    $('.select2').val('').trigger("change");
                    $.ajax({
                        type:'GET',
                        url:'refresh_captcha',
                        success:function(data){
                            $(".captcha span").html(data.captcha);
                        }
                    });
                })
            }
            else {
                swal({
                    title: data.error,
                    text: '',
                    type: 'error',
                    confirmButtonText: 'حسنا'
                })
            }
            //$('#frm')[0].reset();
        },
        error: function (xhr, textStatus, errorThrown)
        {
            swal({
                title: 'خطأ',
                text: 'من فضلك تأكد من الأحرف الموجودة بالصورة',
                type: 'error',
                confirmButtonText: 'إغـــلاق'
            });
            $.ajax({
                type:'GET',
                url:'refresh_captcha',
                success:function(data){
                    $(".captcha span").html(data.captcha);
                }
            });
            $("#captcha").val("");
        },
        complete: function(){
            $('#ajax_button').attr("disabled", false);
            $('#spin').removeClass('fa fa-spinner fa-spin');
            $.unblockUI();
        }
    });
});
