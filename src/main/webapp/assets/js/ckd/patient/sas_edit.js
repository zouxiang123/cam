var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        sas_edit.init();
    });
});

var sas_edit = {
    recordDatePick : null,
    nextDatePick : null,
    init : function() {
        this.addEvents();
        this.addValidate();
        var id = $("#sasForm").find("input[name='id']").val();
        if (!isEmpty(id)) {
            $.ajax({
                url : ctx + "/ckdSas/getById.shtml",
                type : "post",
                data : {
                    id : id
                },
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        mappingFormData(data.rs, "sasForm");
                        $("#scoreSpan").text(data.rs.score);
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        }
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        sas_edit.recordDatePick = laydate.render({
            elem : "#recordDateInput",
            theme : '#31AAFF',
            value : new Date().pattern("yyyy-MM-dd"),
            btns : [ "now", "confirm" ],
            done : function(value, date) {
                sas_edit.nextDatePick.config.min = this.dateTime;
            }
        });
        sas_edit.nextDatePick = laydate.render({
            elem : "#nextDateInput",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            done : function(value, date) {
                sas_edit.recordDatePick.config.max = this.dateTime;
            }
        });
        // 评分项点击事件
        $("#sasForm").on("change", ":radio", function() {
            var formEl = $("#sasForm");
            var score = 0;
            formEl.find(":radio:checked").each(function() {
                score += parseInt($(this).val());
            });
            formEl.find("input[name='score']").val(score);
            $("#scoreSpan").text(score);
        });
    },
    /**
     * 保存营养评估数据
     */
    save : function(callback) {
        if ($("#sasForm").valid()) {
            $.ajax({
                url : ctx + "/ckdSas/saveOrUpdate.shtml",
                type : "post",
                data : $("#sasForm").serialize(),
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        showTips();
                        if (!isEmpty(callback)) {
                            callback();
                        }
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        }
    },
    addValidate : function() {
        $('#sasForm').validate({
            // 校验字段
            rules : {
                recordDateShow : {
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