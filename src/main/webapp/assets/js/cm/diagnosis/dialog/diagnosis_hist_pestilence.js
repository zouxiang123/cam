$(function() {
    addDiagnosisHistPestilenceValidate();// 添加校验规则
    addDiagnosisHistPestilenceEvent();
});
function addDiagnosisHistPestilenceEvent() {
    $("#diagnosisHistPestilenceForm").on("click", ":radio,:checkbox", function() {
        if ($(this).val() == '00') {
            $(this).parent().parent().find("textarea").parent().removeClass('hide');
        } else {
            $(this).parent().parent().find("textarea").val('');
            $(this).parent().parent().find("textarea").parent().addClass('hide');
        }
    });
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem : "#diagnosisHistPestilence_diagnosticDateForm",
            theme : '#31AAFF',
            btns : [ "now", "confirm" ]
        });
    });
}
/** 显示传染病史dialog */
function showDiagnosisHistPestilenceDialog(id, patientId, diagnosisType) {
    // 隐藏其它对应的textArea
    $("#diagnosisHistPestilenceForm").find("[data-other]").each(function() {
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
                $('#diagnosisHistPestilenceForm').validate().resetForm();
                resetFormAndClearHidden("diagnosisHistPestilenceForm");// 表单重置
                mappingFormData(data.item, "diagnosisHistPestilenceForm");
                $("#diagnosisHistPestilence_patientId").val(data.patient.id);
                $("#diagnosisHistPestilence_patientName").text("患者：" + data.patient.name);
                // 显示选中
                $("#diagnosisHistPestilenceForm").find(":radio:checked,:checkbox:checked").click();
                popDialog("#diagnosisHistPestilenceDialog");
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistPestilence(form) {
    if ($('#diagnosisHistPestilenceForm').valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistPestilence.shtml",
            dataType : "json",
            loading : true,
            // async : false,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    hiddenMe("#diagnosisHistPestilenceDialog");
                    var callbackFun = $("body").data("dialogFunctionName");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            }
        };
        $('#diagnosisHistPestilenceForm').ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistPestilenceValidate() {
    $('#diagnosisHistPestilenceForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            diagnosticDateForm : {
                required : [ "诊断日期" ]
            },
            diagnosticName : {
                required : [ "诊断名称" ]
            },
            activityState : {
                required : [ "活动状态" ]
            },
            treatment : {
                required : [ "治疗情况" ]
            }
        },
        errorPlacement : function(error, element) {
            var obj = getValidateErrorDisplayEl($(element));
            $(error).css("display", "block");
            obj.find("[data-error]").append(error);
        }
    });
}