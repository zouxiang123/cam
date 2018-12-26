var ckd_drugs_record = {
    /**
     * 页面初始化
     */
    init : function() {
        this.addValidate();
        this.addEvents();
        var type = $("input[name='drugsType']:checked").val();
        if (type == "drugs_type_01") {// 雷公藤
            $("#CkdDrugsRecordForm").find('[data-code="drugs_type_2"]').hide();
            $("#CkdDrugsRecordForm").find('[data-code="drugs_type_1"]').show();
        } else {
            $("#CkdDrugsRecordForm").find('[data-code="drugs_type_2"]').show();
            $("#CkdDrugsRecordForm").find('[data-code="drugs_type_1"]').hide();
        }
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#CkdDrugsRecordForm").find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", 'confirm' ]
                });
            });
        });
        // radio点击时间
        $("input[name='drugsType']").on("change", function() {
            $("#CkdDrugsRecordForm").find("input[type='text']").val("");
            var type = $(this).val();
            if (type == "drugs_type_01") {// 雷公藤
                $("#CkdDrugsRecordForm").find('[data-code="drugs_type_2"]').hide();
                $("#CkdDrugsRecordForm").find('[data-code="drugs_type_1"]').show();
            } else {
                $("#CkdDrugsRecordForm").find('[data-code="drugs_type_2"]').show();
                $("#CkdDrugsRecordForm").find('[data-code="drugs_type_1"]').hide();
            }
        });
    },
    /**
     * 保存药品观察记录数据
     */
    save : function(callback) {
        if ($("#CkdDrugsRecordForm").valid()) {
            $.ajax({
                url : ctx + "/ckdDrugsRecord/save.shtml",
                type : "post",
                data : $("#CkdDrugsRecordForm").serialize(),
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        if (!isEmpty(callback)) {
                            callback();
                        }
                        showTips();
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        }
    },
    addValidate : function() {
        $('#CkdDrugsRecordForm').validate({
            // 校验字段
            rules : {
                recordDateStr : {
                    required : [ "记录时间" ]
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