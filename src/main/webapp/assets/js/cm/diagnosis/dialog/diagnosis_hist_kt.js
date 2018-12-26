$(function() {
    addDiagnosisHistKtEvent();
    addDiagnosisHistKtValidate();// 添加校验规则
});
function addDiagnosisHistKtEvent() {
    $("#diagnosisHistKtForm").on("click", ":radio,:checkbox", function() {
        if ($(this).val() == '00') {
            $(this).parent().parent().find("textarea").parent().removeClass('hide');
        } else {
            $(this).parent().parent().find("textarea").val('');
            $(this).parent().parent().find("textarea").parent().addClass('hide');
        }
    });
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        var diagnosisHistKt_startDateDatePick = laydate.render({
            elem : "#diagnosisHistKt_startDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistKt_endDateDatePick.config.min = this.dateTime;
            }
        });
        var diagnosisHistKt_endDateDatePick = laydate.render({
            elem : "#diagnosisHistKt_endDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                diagnosisHistKt_startDateDatePick.config.max = this.dateTime;
            }
        });
    });
}
/** 显示肾移植史dialog */
function showDiagnosisHistKtDialog(id, patientId, diagnosisType) {
    // 隐藏其它对应的textArea
    $("#diagnosisHistKtForm").find("[data-other]").each(function() {
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
                $('#diagnosisHistKtForm').validate().resetForm();
                resetFormAndClearHidden("diagnosisHistKtForm");// 表单重置
                mappingFormData(data.item, "diagnosisHistKtForm");

                $("#diagnosisHistKt_patientId").val(data.patient.id);
                $("#diagnosisHistKt_patientName").text("患者：" + data.patient.name);
                // 显示选中
                $("#diagnosisHistKtForm").find(":radio:checked,:checkbox:checked").click();
                popDialog("#diagnosisHistKtDialog");
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistKt() {
    if ($('#diagnosisHistKtForm').valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistKt.shtml",
            dataType : "json",
            loading : true,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    hiddenMe("#diagnosisHistKtDialog");
                    var callbackFun = $("body").data("dialogFunctionName");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            }
        };
        $('#diagnosisHistKtForm').ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistKtValidate() {
    $('#diagnosisHistKtForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            startDateForm : {
                required : [ "开始日期" ]
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