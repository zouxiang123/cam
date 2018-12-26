$(function() {
    addDiagnosisHistAllergyEvent();
    addDiagnosisHistAllergyValidate();// 添加校验规则
});
function addDiagnosisHistAllergyEvent() {
    $("#diagnosisHistAllergyForm").on("click", ":radio,:checkbox", function() {
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
            elem : "#diagnosisHistAllergy_inputDateForm",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ]
        });
    });
}
/** 显示过敏史dialog */
function showDiagnosisHistAllergyDialog(id, patientId, diagnosisType) {
    // 隐藏其它对应的textArea
    $("#diagnosisHistAllergyForm").find("[data-other]").each(function() {
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
                    $('#diagnosisHistAllergyForm').validate().resetForm();
                    resetFormAndClearHidden("diagnosisHistAllergyForm");// 表单重置
                    mappingFormData(data.item, "diagnosisHistAllergyForm");
                    $("#diagnosisHistAllergy_patientId").val(data.patient.id);

                    $("#diagnosisHistAllergy_patientName").text("患者：" + data.patient.name);
                    // 显示选中
                    $("#diagnosisHistAllergyForm").find(":radio:checked,:checkbox:checked").click();
                    popDialog("#diagnosisHistAllergyDialog");
                }
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistAllergy(form) {
    if ($("#diagnosisHistAllergyForm").valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistAllergy.shtml",
            dataType : "json",
            loading : true,
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    hiddenMe("#diagnosisHistAllergyDialog");
                    var callbackFun = $("body").data("dialogFunctionName");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            }
        };
        $("#diagnosisHistAllergyForm").ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistAllergyValidate() {
    $('#diagnosisHistAllergyForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            inputDateForm : {
                required : [ "录入日期" ]
            },
            allergens : {
                required : [ "过敏源" ]
            },
            name : {
                required : [ "名称" ]
            }
        },
        errorPlacement : function(error, element) {
            var obj = getValidateErrorDisplayEl($(element));
            $(error).css("display", "block");
            obj.find("[data-error]").append(error);
        }
    });
}