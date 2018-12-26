$(function() {
    addDiagnosisHistHdEvent();
    addDiagnosisHistHdValidate();// 添加校验规则
});
function addDiagnosisHistHdEvent() {
    $("#diagnosisHistHdForm").on("click", ":radio,:checkbox", function() {
        if ($(this).val() == '00') {
            $(this).parent().parent().find("textarea").parent().removeClass('hide');
        } else {
            $(this).parent().parent().find("textarea").val('');
            $(this).parent().parent().find("textarea").parent().addClass('hide');
        }
    });
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var diagnosisHistHd_startDateDatePick = laydate.render({
            elem : "#diagnosisHistHd_startDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistHd_endDateDatePick.config.min = this.dateTime;
            }
        });
        var diagnosisHistHd_endDateDatePick = laydate.render({
            elem : "#diagnosisHistHd_endDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistHd_startDateDatePick.config.max = this.dateTime;
            }
        });
    });
}
/** 显示血透史dialog */
function showDiagnosisHistHdDialog(id, patientId, diagnosisType) {
    // 隐藏其它对应的textArea
    $("#diagnosisHistHdForm").find("[data-other]").each(function() {
        $(this).find("textarea").val("");
        $(this).addClass("hide");
    });
    $.ajax({
        url : ctx + "/patient/diagnosis/search.shtml",
        data : "patientId=" + patientId + "&diagnosisType=" + diagnosisType + "&id=" + id,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data.status == 1) {
                $('#diagnosisHistHdForm').validate().resetForm();
                resetFormAndClearHidden("diagnosisHistHdForm");// 表单重置
                mappingFormData(data.item, "diagnosisHistHdForm");
                $("#diagnosisHistHd_patientId").val(data.patient.id);
                $("#diagnosisHistHd_patientName").text("患者：" + data.patient.name);
                // 显示选中
                $("#diagnosisHistHdForm").find(":radio:checked,:checkbox:checked").click();
                popDialog("#diagnosisHistHdDialog");
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistHd(form) {
    if ($('#diagnosisHistHdForm').valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistHd.shtml",
            dataType : "json",
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    var callbackFun = $("body").data("dialogFunctionName");
                    hiddenMe("#diagnosisHistHdDialog");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            },
            error : function() {
            }
        };
        $('#diagnosisHistHdForm').ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistHdValidate() {
    $('#diagnosisHistHdForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            startDateForm : {
                required : [ "开始日期" ]
            },
            startReason : {
                required : [ "开始原因" ]
            },
            endDateForm : {
                required : [ "结束日期" ]
            },
            endReason : {
                required : [ "结束原因" ]
            }
        },
        errorPlacement : function(error, element) {
            var obj = getValidateErrorDisplayEl($(element));
            $(error).css("display", "block");
            obj.find("[data-error]").append(error);
        }
    });
}