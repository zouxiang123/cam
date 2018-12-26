var fu_record_pd = {
    init : function() {
        // 添加时间选择
        layui.use([ 'laydate' ], function() {
            var laydate = layui.laydate;
            $('#fuRecordPdForm').find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", "confirm" ]
                });
            });
        });
        this.addEvents();
        // 触发选中事件
        $('#fuRecordPdForm').find("[name='edema']:checked,[name='appetite']:checked,[name='sleep']:checked").click();
        this.addValidate();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $('#fuRecordPdForm').on("click", "[name='edema'],[name='appetite'],[name='sleep']", function() {
            var otherName = $(this).attr("name") + "Other";
            var otherEl = $('#fuRecordPdForm').find("[name='" + otherName + "']");
            if ($(this).val() == "0") {
                otherEl.removeClass("hide");
            } else {
                otherEl.addClass("hide");
            }
        });
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#fuRecordPdForm').validate({
            rules : {
                recordDateStr : {
                    required : [ "随访日期" ]
                },
                sbp : {
                    digits : [ "收缩压" ]
                },
                dbp : {
                    digits : [ "舒张压" ]
                },
                urineVol : {
                    number : [ "尿量" ]
                },
                ufv : {
                    digits : [ "超滤" ]
                },
                weightShow : {
                    number : [ "体重" ]
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
        if (!$("#fuRecordPdForm").valid())
            return;
        $.ajax({
            url : ctx + "/fuRecordPd/save.shtml",
            data : $("#fuRecordPdForm").serialize(),
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
