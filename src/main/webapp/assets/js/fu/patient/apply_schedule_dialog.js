var apply_schedule_dialog = {
    callback : null,
    init : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            laydate.render({
                min : new Date().pattern("yyyy-MM-dd"),
                elem : "#applyScheduleForm input[name='dateStr']",
                theme : '#31AAFF',
                btns : [ 'now', 'confirm' ]
            });
        });
        this.addValidate();
    },
    /**
     * 显示dialog
     * 
     * @param id
     *            患者id
     * @param ownerId
     *            模板拥有者id
     * @param sysOwner
     *            所属系统
     * @param callback
     *            保存回调
     */
    show : function(id, ownerId, sysOwner, callback) {
        this.callback = callback;
        $("#applyScheduleForm").find("input[name='idStr']").val(convertEmpty(id));
        // 默认当前时间
        $("#applyScheduleForm").find("input[name='dateStr']").val(new Date().pattern("yyyy-MM-dd"));
        $.ajax({
            url : ctx + "/fuScheduleTemplate/getList.shtml",
            type : "post",
            data : {
                sysOwner : sysOwner,
                ownerId : ownerId
            },
            dataType : "json",
            success : function(data) {
                var html = "";
                if (data.status == 1 && !isEmptyObject(data.items)) {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        html += '<div class="bb-line pl-36 pr-30 line-height-60">';
                        html += '<label class="u-radio"><input type="radio" name="id" value="' + item.id + '"/><span class="icon-radio" ></span>'
                                        + item.templateName + '</label>';
                        html += '<span class="u-float-r opacity-5 line-height-60">创建：' + item.createUserName + '</span>';
                        html += '</div>';
                    }
                }
                $("#templateList").html(html);
                popDialog("#applyScheduleDialog");
            }
        });
    },
    save : function() {
        if (!$("#applyScheduleForm").valid())
            return false;
        $.ajax({
            url : ctx + "/fuScheduleTemplate/batchSet.shtml",
            type : "post",
            data : $("#applyScheduleForm").serialize(),
            dataType : "json",
            loadingMsg : "保存中，请稍等...",
            success : function(data) {
                if (data.status == 1) {
                    hiddenMe("#applyScheduleDialog");
                    showTips();
                    if (!isEmpty(apply_schedule_dialog.callback)) {
                        apply_schedule_dialog.callback();
                    }
                } else {
                    showWarn("请选择应用模板");
                }
            }
        });

    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#applyScheduleForm').validate({
            rules : {
                dateStr : {
                    required : [ "随访开始时间" ]
                },
                id : {
                    required : [ "随访模板" ]
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
    }
};