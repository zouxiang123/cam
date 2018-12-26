$(function() {
    patient_outcome_edit.init();
});
var patient_outcome_edit = {
    init : function() {
        this.addEvents();
        this.addValidate();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#patientOutcomeForm").find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", 'confirm' ]
                });
            });
        });
    },
    /**
     * 显示新增dialog
     * 
     * @param patientId
     * @param sysOwner
     */
    show : function(patientId, sysOwner) {
        $("#patientOutcomeForm")[0].reset();
        $("#patientOutcomeForm").find("input[name='fkPatientId']").val(patientId);
        $("#patientOutcomeForm").find("input[name='sysOwner']").val(sysOwner);
        $("#patientOutcomeForm").find("input[name='recordDateShow']").val(new Date().pattern("yyyy-MM-dd"));
        popDialog("#patientOutcomeDialog");
    },
    /**
     * 保存并发症
     */
    save : function() {
        if ($("#patientOutcomeForm").valid()) {
            $.ajax({
                url : ctx + "/patient/outcome/save.shtml",
                type : "post",
                data : $("#patientOutcomeForm").serialize(),
                dataType : "json",
                success : function(data) {
                    if (data.status == "1") {
                        showTips("保存成功");
                        window.location.reload(true);
                    }
                }
            });
        }
    },
    addValidate : function() {
        $('#patientOutcomeForm').validate({
            // 校验字段
            rules : {
                type : {
                    required : [ "转归类型" ]
                },
                reason : {
                    required : [ "转归原因" ]
                }
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorDisplayEl($(element));
                $(error).css("display", "block");
                obj.find("[data-error]").append(error);
            }
        });
    }
};