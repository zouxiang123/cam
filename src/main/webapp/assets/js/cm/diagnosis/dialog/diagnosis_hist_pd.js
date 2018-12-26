$(function() {
    addDiagnosisHistPdEvent();
    addDiagnosisHistPdValidate();// 添加校验规则
});
function addDiagnosisHistPdEvent() {
    $("#diagnosisHistPdForm").on("click", ":radio,:checkbox", function() {
        if ($(this).val() == '00') {
            $(this).parent().parent().find("textarea").parent().removeClass('hide');
        } else {
            $(this).parent().parent().find("textarea").val('');
            $(this).parent().parent().find("textarea").parent().addClass('hide');
        }
    });
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var diagnosisHistPd_startDateDatePick = laydate.render({
            elem : "#diagnosisHistPd_startDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistPd_endDateDatePick.config.min = this.dateTime;
            }
        });
        var diagnosisHistPd_endDateDatePick = laydate.render({
            elem : "#diagnosisHistPd_endDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistPd_startDateDatePick.config.max = this.dateTime;
            }
        });
    });
}
/** 显示腹透史dialog */
function showDiagnosisHistPdDialog(id, patientId, diagnosisType) {
    // 隐藏其它对应的textArea
    $("#diagnosisHistPdForm").find("[data-other]").each(function() {
        $(this).find("textarea").val("");
        $(this).addClass("hide");
    });
    $.ajax({
        url : ctx + "/patient/diagnosis/search.shtml",
        data : "patientId=" + patientId + "&diagnosisType=" + diagnosisType + "&id=" + id,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data) {
                if (data.status == 1) {
                    $('#diagnosisHistPdForm').validate().resetForm();
                    resetFormAndClearHidden("diagnosisHistPdForm");// 表单重置
                    mappingFormData(data.item, "diagnosisHistPdForm");
                    $("#diagnosisHistPd_patientId").val(data.patient.id);
                    $("#diagnosisHistPd_patientName").text("患者：" + data.patient.name);
                    // 显示选中
                    $("#diagnosisHistPdForm").find(":radio:checked,:checkbox:checked").click();
                    popDialog("#diagnosisHistPdDialog");
                }
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistPd(form) {
    if ($("#diagnosisHistPdForm").valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistPd.shtml",
            dataType : "json",
            loading : true,
            // async : false,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    hiddenMe("#diagnosisHistPdDialog");
                    var callbackFun = $("body").data("dialogFunctionName");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            },
            error : function() {
            }
        };
        $("#diagnosisHistPdForm").ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistPdValidate() {
    $('#diagnosisHistPdForm').validate({
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