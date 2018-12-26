$(function() {
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem : "#diagnosisHistSurgery_surgeryDateForm",
            theme : '#31AAFF',
            btns : [ "now", "confirm" ]
        });
    });
    addDiagnosisHistSurgeryValidate();// 添加校验规则
});

/** 显示手术史dialog */
function showDiagnosisHistSurgeryDialog(id, patientId, diagnosisType) {
    $.ajax({
        url : ctx + "/patient/diagnosis/search.shtml",
        data : "patientId=" + patientId + "&diagnosisType=" + diagnosisType + "&id=" + id,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data) {
                if (data.status == 1) {
                    $('#diagnosisHistSurgeryForm').validate().resetForm();
                    resetFormAndClearHidden("diagnosisHistSurgeryForm");// 表单重置
                    mappingFormData(data.item, "diagnosisHistSurgeryForm");
                    $("#diagnosisHistSurgery_patientId").val(data.patient.id);
                    $("#diagnosisHistSurgery_patientName").text("患者：" + data.patient.name);
                    popDialog("#diagnosisHistSurgeryDialog");
                }
            }
            return false;
        }
    });
    return false;
}
// 保存
function saveDiagnosisHistSurgery() {
    if ($('#diagnosisHistSurgeryForm').valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveHistSurgery.shtml",
            dataType : "json",
            loading : true,
            // async : false,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data) {
                    if (data.status == 1) {
                        hiddenMe("#diagnosisHistSurgeryDialog");
                        var callbackFun = $("body").data("dialogFunctionName");
                        if (!isEmpty(callbackFun)) {
                            eval(callbackFun + '()');
                        }
                    }
                }
                return false;
            }
        };
        $('#diagnosisHistSurgeryForm').ajaxSubmit(options);
        return false;
    }
}
function addDiagnosisHistSurgeryValidate() {
    $('#diagnosisHistSurgeryForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            surgeryDateForm : {
                required : [ "手术日期" ]
            },
            surgeryName : {
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