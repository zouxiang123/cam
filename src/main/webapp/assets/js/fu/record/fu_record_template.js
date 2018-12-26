var fu_record_template = {
    saveflag : false,
    init : function() {
        // 添加时间选择
        layui.use([ 'laydate' ], function() {
            var laydate = layui.laydate;
            $('#fuRecordTemplateForm').find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", "confirm" ]
                });
            });
        });
        this.addEvents();
        this.addValidate();
        var iframeSrc = $("#aspPath").val() + "/Default.aspx";
        var srcParam = {
            token : getCookie("cookie_token"),
            xmlId : $("#xmlId").val(),
            url : $("#wsAddr").val()
        };
        iframeSrc += "?" + $.param(srcParam);
        $("#fuRecordTemplateIframe").attr("src", iframeSrc);
    },
    addEvents : function() {
        $(window).on("resize", function() {
            $('#fuRecordTemplateIframe').height($(window).height() - $("#fuRecordTemplateIframeDiv").offset().top - 5);
        });
        $(window).resize();
        // 添加message监听
        window.addEventListener("message", function(event) {
            var id = event.data;
            if (isNaN(id)) {// 不是有效的id，则为错误提示
                showTips(id);
            } else {
                $("#fuRecordTemplateForm").find("input[name='id']").val(id);
                fu_record_template.saveflag = true;
            }
        });
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#fuRecordTemplateForm').validate({
            rules : {
                recordDateShow : {
                    required : [ "记录日期" ]
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
        if (!$("#fuRecordTemplateForm").valid()) {
            return;
        }
        fu_record_template.saveflag = false;
        var iframe = $('#fuRecordTemplateIframe')[0];
        var iframeWin = iframe.contentWindow || iframe.contentDocument.parentWindow;
        iframeWin.postMessage("save", $("#aspPath").val());
        var intervalId = setInterval(function() {
            if (fu_record_template.saveflag) {
                $.ajax({
                    url : ctx + "/fuRecordTemplate/save.shtml",
                    data : $("#fuRecordTemplateForm").serialize(),
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
                clearInterval(intervalId);
            }
        }, 50);
    }
};
