var fu_record_pops = {
    init : function() {
        // 添加时间选择
        layui.use([ 'laydate' ], function() {
            var laydate = layui.laydate;
            $('#fuRecordPopsForm').find("[datepicker]").each(function() {
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
     * 清空元素下的所有的值
     * 
     * @param el
     */
    clearValues : function(el) {
        $(el).find("input:not(:checkbox,:radio),select,textarea").val("");
        $(el).find(":checkbox,:radio").prop("checked", false);
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#fuRecordPopsForm').validate({
            rules : {
                recordDateStr : {
                    required : [ "随访日期" ]
                },
                fkOperationRecordId : {
                    required : [ "随访通路" ]
                },
                brachialArteryId : {
                    number : [ "肱动脉内径" ]
                },
                bloodFlow : {
                    number : [ "血流量" ]
                },
                nearStomaArteryId : {
                    number : [ "近吻合口动脉内径" ]
                },
                arteryPuncturePointId : {
                    number : [ "动脉穿刺点内径" ]
                },
                veinPuncturePointId : {
                    number : [ "静脉穿刺点内径" ]
                },
                puncturePointId : {
                    number : [ "穿刺点间内径" ]
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
        if (!$("#fuRecordPopsForm").valid())
            return;
        $.ajax({
            url : ctx + "/fuRecordPops/save.shtml",
            data : $("#fuRecordPopsForm").serialize(),
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
