var detail_add_dialog = {
    callback : null,
    /**
     * 初始化显示dialog
     * 
     */
    init : function() {
        this.addValidate();
    },
    /**
     * 显示添加dialog
     * 
     * @param followTypes
     * @param followForms
     */
    show : function(followTypes, followForms, callback) {
        $("#scheduleTemplateDetailAddForm")[0].reset();
        $("#scheduleTemplateDetailAddForm").validate().resetForm();
        this.callback = callback;
        var optionHtml = "";
        if (!isEmptyObject(followTypes)) {
            for ( var key in followTypes) {
                var item = followTypes[key];
                optionHtml += '<option value="' + item.itemCode + '">' + item.itemName + '</option>';
            }
        }
        $("#scheduleTemplateDetailAddForm").find('select[name="followType"]').html(optionHtml);
        optionHtml = "";
        if (!isEmptyObject(followForms)) {
            for ( var key in followForms) {
                var item = followForms[key];
                optionHtml += '<option value="' + item.itemCode + '">' + item.itemName + '</option>';
            }
        }
        $("#scheduleTemplateDetailAddForm").find('select[name="followFormCode"]').html(optionHtml);
        popDialog("#scheduleTemplateDetailAddDialog");
    },
    /**
     * 确定添加
     */
    save : function() {
        if ($("#scheduleTemplateDetailAddForm").valid()) {
            if (!isEmpty(detail_add_dialog.callback)) {
                var data = $("#scheduleTemplateDetailAddForm").serializeJson();
                detail_add_dialog.callback(data);
            }
            hiddenMe($("#scheduleTemplateDetailAddDialog"));
        }
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#scheduleTemplateDetailAddForm').validate({
            rules : {
                count : {
                    required : [ "随访次数" ],
                    isPInt : [ "随访次数" ],
                    customRange : [ 1, 1000, "随访次数" ]
                },
                taskInterval : {
                    required : [ "距离上次天数" ],
                    isPInt : [ "距离上次天数" ]
                },
                followType : {
                    required : [ "随访类型" ]
                },
                followFormCode : {
                    required : [ "随访表单" ]
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