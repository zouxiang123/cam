$(function() {
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem : '#diagnosisHistFirstDialysis_firstTreatmentDate', // 指定元素
            theme : '#31AAFF',
            max : new Date().pattern("yyyy-MM-dd"),
            btns : [ "now", 'confirm' ]
        });
    });
    addDiagnosisHistFirstDialysisValidate();// 添加校验规则
});

/** 显示首次透析dialog */
function showDiagnosisHistFirstDialysisDialog(id, patientId, diagnosisType) {
    $.ajax({
        url : ctx + "/patient/diagnosis/search.shtml",
        data : "patientId=" + patientId + "&diagnosisType=" + diagnosisType + "&id=" + id,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data.status == 1) {
                $('#diagnosisHistFirstDialysisForm').validate().resetForm();
                resetFormAndClearHidden("diagnosisHistFirstDialysisForm");// 表单重置
                mappingFormData(data.item, "diagnosisHistFirstDialysisForm");
                $("#diagnosisHistFirstDialysis_patientId").val(data.patient.id);
                $("#diagnosisHistFirstDialysis_patientName").text("患者：" + data.patient.name);
                popDialog("#diagnosisHistFirstDialysisDialog");
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistFirstDialysis() {
    if ($('#diagnosisHistFirstDialysisForm').valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistFirstDialysis.shtml",
            dataType : "json",
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    var callbackFun = $("body").data("dialogFunctionName");
                    hiddenMe("#diagnosisHistFirstDialysisDialog");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                }
                return false;
            }
        };
        $('#diagnosisHistFirstDialysisForm').ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistFirstDialysisValidate() {
    $('#diagnosisHistFirstDialysisForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            firstTreatmentDateForm : {
                required : [ "首次透析时间" ]
            },
            firstTreatmentType : {
                required : [ "首次透析类型" ]
            }
        },
        errorPlacement : function(error, element) {
            var obj = getValidateErrorDisplayEl($(element));
            $(error).css("display", "block");
            obj.find("[data-error]").append(error);
        }
    });
}