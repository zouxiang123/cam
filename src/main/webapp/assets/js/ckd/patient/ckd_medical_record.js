var ckd_medical_record = {
    saveCall : null,
    /**
     * 页面初始化
     */
    init : function() {
        this.addValidate();
        this.addEvents();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#ckdMedicalRecordForm").find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", 'confirm' ]
                });
            });
        });
    },
    show : function(patientId, patientName, saveCall, id) {
        $("#ckdMedicalRecordDialog").find("[title1]").text("患者：" + patientName);
        this.saveCall = saveCall;
        $("#ckdMedicalRecordForm")[0].reset();
        $("#ckdMedicalRecordForm").validate().resetForm();
        if (!isEmpty(id)) {
            $.ajax({
                url : ctx + "/ckdMedicalRecord/getById.shtml",
                type : "post",
                data : {
                    id : id
                },
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        mappingFormData(data.rs, "ckdMedicalRecordForm");
                        popDialog("#ckdMedicalRecordDialog");
                    }
                }
            });
        } else {
            $("#ckdMedicalRecordForm").find("input[name='fkPatientId']").val(patientId);
            $("#ckdMedicalRecordForm").find("input[name='recordDateStr']").val(new Date().pattern("yyyy-MM-dd"));
            popDialog("#ckdMedicalRecordDialog");
        }
    },
    /**
     * 保存用药记录数据
     */
    save : function(callback) {
        if ($("#ckdMedicalRecordForm").valid()) {
            $.ajax({
                url : ctx + "/ckdMedicalRecord/save.shtml",
                type : "post",
                data : $("#ckdMedicalRecordForm").serialize(),
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        if (!isEmpty(ckd_medical_record.saveCall)) {
                            ckd_medical_record.saveCall();
                        }
                        showTips();
                        hiddenMe("#ckdMedicalRecordDialog");
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        }
    },
    addValidate : function() {
        $('#ckdMedicalRecordForm').validate({
            // 校验字段
            rules : {
                recordDateStr : {
                    required : [ "记录时间" ]
                },
                medicalName : {
                    required : [ "用药名称" ]
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