var fu_record_detail_pd_whzx_edit = {
    init : function() {
        // 添加时间选择
        layui.use([ 'laydate' ], function() {
            var laydate = layui.laydate;
            $('#followRecordEditForm').find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", "confirm" ]
                });
            });
        });
        this.addValidate();
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#followRecordEditForm').validate({
            rules : {
                recordDateStr : {
                    required : [ "记录时间" ]
                },
                followType : {
                    required : [ "随访类型" ]
                },
                cardNum : {
                    required : [ "住院号" ]
                }
            },
            showErrors : function(errorMap, errorList) {
                if (errorList.length > 0) {
                    $(errorList[0].element).focus();
                }
                this.defaultShowErrors();
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorDisplayEl($(element));
                $(error).css("display", "block");
                obj.find("[data-error]").append(error);
            }
        });
    },
    /**
     * 保存数据
     * 
     * @param callback
     *            保存成功回调
     */
    save : function(callback) {
        if (!$("#followRecordEditForm").valid())
            return;
        $.ajax({
            url : ctx + "/fuRecordDetailPdWhzx/save.shtml",
            data : $("#followRecordEditForm").serialize(),
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                if (data.status == "1") {
                    if (!isEmpty(callback)) {
                        callback();
                    }
                    showTips();
                }
            }
        });
    }
};