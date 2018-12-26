$(document).ready(function() {
    template_list.init();
});
var template_list = {
    /**
     * 初始化页面
     */
    init : function() {
        this.addEvents();
        this.getList();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $("#templateTypeList").find("[data-share]").on("click", function(event) {
            $(this).addClass("active").siblings().removeClass("active");
            template_list.getList($(this).data("share"));
            stopEventBubble(event);
        });
    },
    /**
     * 获取模板列表
     * 
     * @param type
     */
    getList : function(type) {
        // 获取模板类别 1,为共享模板
        type = isEmpty(type) ? ($("#templateTypeList").find("[data-share].active").data("share")) : type;
        var param = {
            sysOwner : $("#sysOwner").val()
        };
        if (isEmpty(type)) { // 查询我的模板
            param.ownerId = $("#ownerId").val();
        } else { // 查询共享模板
            param.isShared = type;
        }
        $.ajax({
            url : ctx + "/fuScheduleTemplate/getList.shtml",
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                var html = "";
                if (data.status == 1) {
                    if (isEmpty(type)) { // 显示我的模板
                        html += '<div class="templateBorder" onclick="template_list.showDetail(null,\'添加新模板\');">';
                        html += '<div class="templatecenter">';
                        html += '<div class="newtemplatemodel">';
                        html += '<i class="icon-add icon-round-add fs-14 addicon"></i>';
                        html += '</div>';
                        html += '<div class="addmodeltext">添加新模板</div>';
                        html += '</div>';
                        html += '</div>';
                    }
                    for (var i = 0; i < data.items.length; i++) {
                        html += template_list.generateRecordDiv(data.items[i], type);
                    }
                }
                $("#templateList").html(html);

                $('#templateSearch').fastLiveFilter('#templateList', {
                    timeout : 300,
                    selector : "[data-templatename]"
                });
            }
        });
    },
    /**
     * 获取单个模板div
     * 
     * @param item
     */
    generateRecordDiv : function(item) {
        var isMe = item.createUserId == $("#ownerId").val();
        var html = "";
        html += '<div class="templateBorder" onclick="template_list.showDetail(' + item.id + ',\'' + item.templateName + '\');">';
        html += '<div class="bb-dashed pb-10 mt-6">';
        html += '<div class="fs-16 fw-bold text-ellipsis u-display-inlineBlock" style="width: 70%;" title="' + item.templateName
                        + '" data-templatename>' + item.templateName;
        html += '<span class="hide">' + convertEmpty(item.templateInitial) + '</span></div>';
        html += '<div class="u-float-r mt-4 u-display-inlineBlock text-right text-ellipsis" style="width: 30%;" title="'
                        + (isMe ? "我" : item.createUserName) + '">创建：' + (isMe ? "我" : item.createUserName) + '</div>';
        html += '</div>';
        html += '<div class="mt-12">';
        html += '<span  style="width: 50%">创建于：' + new Date(item.createTime).pattern("yyyy/MM/dd") + '</span>';
        html += '<span class="u-float-r text-right" style="width: 50%">最后编辑：' + new Date(item.updateTime).pattern("yyyy/MM/dd") + '</span>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    /**
     * 显示详情
     */
    showDetail : function(id, name) {
        var url = ctx + "/fuScheduleTemplate/detailView.shtml?sysOwner=" + $("#sysOwner").val() + (isEmpty(id) ? "" : ("&id=" + id));
        if (existsFunction("parent.addTab")) {
            parent.addTab({
                id : "template_" + (isEmpty(id) ? new Date().getTime() : id),
                name : name,
                url : url,
                refresh : '0'
            });
        } else {
            window.location.href = url;
        }
    }
};
