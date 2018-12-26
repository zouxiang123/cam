$(function() {
    record_summary_obj.init();
});
var record_summary_obj = {
    init : function() {
        record_summary_obj.getList();
        record_summary_obj.addEvents();
    },
    addEvents : function() {
        // 展开收起事件
        $("body").on("click", "[data-collapse]", function() {
            $(this).parent().next().toggle();
            $(this).parent().toggleClass("active");
            if ($(this).parent().hasClass("active")) {
                $(this).html("展开");
            } else {
                $(this).html("收起");
            }
        });
    },
    getList : function() {
        if (isEmpty($("#id").val())) {
            return;
        }
        var data = "sysOwner=" + $("#sysOwner").val() + "&recordId=" + $("#id").val() + "&scheduleId=" + $("#scheduleId").val();
        $.ajax({
            url : ctx + "/fuRecord/getPreviewList.shtml",
            type : "post",
            data : encodeURI(data),
            dataType : "json",
            loading : true,
            success : function(data) {
                var html = "";
                var needMappingFormData = false;
                if (data.status == 1 && !isEmptyObject(data.items)) {
                    if (!isEmptyObject(data.items)) {
                        needMappingFormData = true;
                        for (var i = 0; i < data.items.length; i++) {
                            var item = data.items[i];
                            var formType = item.record.formType;
                            var staticHtmlObj = $("#" + formType + "_staticHtml").clone(true);
                            if (!isEmptyObject(item.nodes)) {
                                var dynamicHtml = dfr_obj.generatePreviewNodes(item.nodes);
                                staticHtmlObj.find("#" + formType + "_dynamicForm").html(dynamicHtml);
                            }
                            html += staticHtmlObj.html();
                            $("#" + formType + "_staticHtml").remove();
                        }
                    }
                }
                $("#tableBody").html(html);
                if (needMappingFormData) {// 批量设定各表单的值
                    $("#tableBody [data-form]").each(function() {
                        var formType = $(this).attr("id");
                        var jsonData;
                        for (var i = 0; i < data.items.length; i++) {
                            var item = data.items[i];
                            if (formType == item.record.formType) {
                                jsonData = item.record;
                                break;
                            }
                        }
                        for ( var key in jsonData) {
                            $("[data-" + key + "span]", $("#" + formType + "_dynamicForm,#" + formType)).text(convertEmpty(jsonData[key]));
                        }
                    });
                }
            }
        });
    },
    /** 保存随访记录单 */
    saveRecord : function() {
        var record = $("#recordBasicForm").serializeJson();
        $.ajax({
            url : ctx + "/fuRecord/saveSummary.shtml",
            contentType : 'application/json;charset=utf-8',
            data : JSON.stringify(record),
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    showTips();
                    record_summary_obj.cancel();
                } else if (data.status == "2") {
                    showWarn("患者尚未出院，不能小结");
                }
            }
        });
    },
    cancel : function() {
        if (existsFunction("parent.removeActiveTab")) {// 如果父节点存在removeActiveTab方法
            parent.removeActiveTab();
        } else {
            goBack();
        }
    }
};
