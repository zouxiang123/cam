$(function() {
    addDiagnosisHistTumourValidate();// 添加校验规则
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem : "#diagnosisHistTumourForm_recordDateShow",
            theme : '#31AAFF',
            btns : [ "now", "confirm" ]
        });
    });
});

/**
 * 显示肿瘤史dialog
 * 
 * @param id
 *            记录id
 * @param patientId
 *            患者id
 * @param diagnosisType
 *            诊断类别
 * @returns {Boolean}
 */
function showDiagnosisHistTumourDialog(id, patientId, diagnosisType) {
    $.ajax({
        url : ctx + "/patient/diagnosis/search.shtml",
        data : "patientId=" + patientId + "&diagnosisType=" + diagnosisType + "&id=" + id,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data.status == 1) {
                $('#diagnosisHistTumourForm').validate().resetForm();
                resetFormAndClearHidden("diagnosisHistTumourForm");// 表单重置
                mappingFormData(data.item, "diagnosisHistTumourForm");
                $("#diagnosisHistTumour_patientId").val(data.patient.id);
                $("#diagnosisHistTumour_patientName").text("患者：" + data.patient.name);
                popDialog("#diagnosisHistTumourDialog");
            }
            return false;
        }
    });
    return false;
}
/**
 * 保存肿瘤史
 * 
 * @param form
 *            表单组件
 * @returns {Boolean}
 */
function saveDiagnosisHistTumour() {
    if ($('#diagnosisHistTumourForm').valid()) {
        $.ajax({
            url : ctx + "/patient/diagnosis/saveHistTumour.shtml",
            data : $('#diagnosisHistTumourForm').serialize(),
            type : "post",
            dataType : "json",
            loading : true,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data.status == 1) {
                    hiddenMe("#diagnosisHistTumourDialog");
                    var callbackFun = $("body").data("dialogFunctionName");
                    if (!isEmpty(callbackFun)) {
                        eval(callbackFun + '()');
                    }
                } else if (data.status == '2') {
                    showWarn("保存的记录已被删除，请刷新后重试");
                }
                return false;
            }
        });
        return false;
    }
}
/**
 * 添加肿瘤史dialog校验
 */
function addDiagnosisHistTumourValidate() {
    $('#diagnosisHistTumourForm').validate({
        onfocusout : false,
        // 校验字段
        rules : {
            recordDateShow : {
                required : [ "诊断日期" ]
            },
            recordType : {
                required : [ "肿瘤类别" ]
            }
        },
        errorPlacement : function(error, element) {
            var obj = getValidateErrorDisplayEl($(element));
            $(error).css("display", "block");
            obj.find("[data-error]").append(error);
        }
    });
}