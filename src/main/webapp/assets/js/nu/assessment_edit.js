var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        assessment_edit.init();
    });
});

var assessment_edit = {
    /**
     * 初始化编辑页面
     * <p>
     * 1：注册事件；
     * </p>
     */
    init : function() {
        this.addEvents();
        this.addValidate();
        var id = $("#nuAssessmentForm").find("input[name='id']").val();
        if (!isEmpty(id)) {
            $.ajax({
                url : ctx + "/nuAssessment/getById.shtml",
                data : {
                    id : id
                },
                type : "post",
                dataType : "json",
                success : function(data) {
                    if (data.status == 1) {
                        mappingFormData(data.rs, "nuAssessmentForm");
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        }
    },
    /**
     * 事件注册
     * <p>
     * 1:日历控件初始化事件；
     * </p>
     */
    addEvents : function() {
        var currentDateStr = new Date().pattern("yyyy-MM-dd");
        laydate.render({
            elem : "#recordDateInput",
            theme : '#31AAFF',
            btns : [ "now", "confirm" ],
            max : currentDateStr
        });
        laydate.render({
            elem : "#nextDateInput",
            theme : '#31AAFF',
            btns : [ "clear", "now", "confirm" ],
            min : currentDateStr
        });
        // 评分项点击事件
        $("#nuAssessmentForm").on("change", ":radio[data-score]", function() {
            var formEl = $("#nuAssessmentForm");
            var score = 0;
            formEl.find(":radio[data-score]:checked").each(function() {
                score += parseInt($(this).data("score"));
            });
            formEl.find("input[name='score']").val(score);
            $("#scoreSpan").text(score);
        });
    },
    /**
     * 保存营养评估数据
     */
    save : function(callback) {
        if ($("#nuAssessmentForm").valid()) {
            $.ajax({
                url : ctx + "/nuAssessment/save.shtml",
                type : "post",
                data : $("#nuAssessmentForm").serialize(),
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
        $('#nuAssessmentForm').validate({
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
