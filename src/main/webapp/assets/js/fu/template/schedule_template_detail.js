$(document).ready(function() {
    detail_obj.init();
});
var detail_obj = {
    followTypes : null,
    followForms : null,
    details : [],
    init : function(id) {
        this.addEvents();
        this.addValidate();
        this.getDetail(id);
    },
    addEvents : function() {
        /**
         * 页面上编辑事件，同步更新数据到缓存中
         */
        $("#detailsList").on("change", "[data-change]", function() {
            var key = $(this).data("change");
            var id = $(this).parents("[data-recordid]").data("recordid");
            var items = detail_obj.details;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    items[i][key] = $(this).val();
                    break;
                }
            }
        });
    },
    /**
     * 获取模板详情
     * 
     * @param id
     */
    getDetail : function(id) {
        $.ajax({
            url : ctx + "/fuScheduleTemplate/getDetail.shtml",
            type : "post",
            data : encodeURI("id=" + convertEmpty(id) + "&sysOwner=" + $("#sysOwner").val()),
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == 1) {
                    detail_obj.followTypes = data.followTypes;
                    detail_obj.followForms = data.followForms;
                    if (!isEmptyObject(data.details)) {
                        for (var i = 0; i < data.details.length; i++) {
                            detail_obj.details.push(data.details[i]);
                        }
                        detail_obj.getDetailContent();
                    }
                }
            }
        });
    },
    /**
     * 获取详情
     */
    getDetailContent : function() {
        var items = this.details;
        var html = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.index = i;
            html += detail_obj.getSingleHtml(item);
        }
        $("#detailsList").html(html);
    },
    /**
     * 显示删除dialog
     * 
     * @param id
     * @param index
     */
    showDelDialog : function(el, id, index) {
        var name = "";
        var followTypeName = $(el).parents("[data-recordid='" + id + "']").find("[data-followtype]").find("option:selected").text();
        var no = index < 9 ? ("0" + (index + 1)) : (index + 1);
        var tips = "您确定要删除编号为" + no + "的" + followTypeName + "吗？";
        system_dialog.show({
            content : "<span class='tipcontent'>" + tips + "</span>",
            confirmText : "删除",
            confirmCss : "u-btn-red",
            confirmCall : function() {
                detail_obj.details.splice(index, 1);
                detail_obj.getDetailContent();
            }
        });
    },
    /**
     * 添加计划内容
     * 
     * @param data
     */
    addElement : function(data) {
        if (!isEmptyObject(data) && data.count > 0) {
            var sysOwner = $("#sysOwner").val();
            var index = this.details.length;
            var id = new Date().getTime();
            if (index > 0) {// 如果不是添加第一个
                var latest = this.details[index - 1];
                id = latest.id + 1;
            }
            for (var i = 0; i < data.count; i++) {
                var item = {
                    id : id + i,
                    index : index + i,
                    sysOwner : sysOwner
                };
                $.extend(item, data);
                detail_obj.details.push(item);
                $("#detailsList").append(detail_obj.getSingleHtml(item));
            }
        }
    },
    /**
     * 获取单个模板的html
     * 
     * @param item
     * @returns {String}
     */
    getSingleHtml : function(item) {
        var html = "";
        var index = item.index;
        var isFirst = index == 0;
        var createByMe = $("#ownerId").val() == $("#userId").val();// 是否本人创建
        var no = index < 9 ? ("0" + (index + 1)) : (index + 1);
        html += '<div class="line-vertical" style="top: 0px;" data-recordid="' + item.id + '"></div>';
        html += '<div class="border-gray p-12" data-recordid="' + item.id + '">';
        html += '<input type="hidden" name="details[' + index + '].intervalType" value="' + item.intervalType + '"/>';
        html += '<input type="hidden" name="details[' + index + '].sysOwner" value="' + item.sysOwner + '"/>';
        html += '<div class="bb-dashed pb-10">';
        html += '<span class="fs-16 fw-bold">NO:' + no + ' ' + (isFirst ? "首次随访" : "距离上次" + item.taskInterval + '天') + '</span>';
        if (createByMe) {// 模板是本人创建才显示删除按钮
            html += '<button type="button" class="u-btn-red u-float-r" text onclick="detail_obj.showDelDialog(this,' + item.id + ',' + index
                            + ');"">删除</button>';
        }
        html += '</div>';
        if (isFirst) {
            html += '<input type="hidden" name="details[' + index + '].taskInterval" value="0" />';
        } else {
            html += '<div class="mt-10">';
            html += '<span>距离上次：</span>';
            html += '<input type="text" name="details[' + index + '].taskInterval" data-change="taskInterval" value="' + item.taskInterval
                            + '" required data-msg-required="天数不能为空" data-rule-isPInt="true" data-msg-isPInt="天数的值无效" maxlength="6" '
                            + (createByMe ? "" : "disabled") + '>';
            html += '<span class="opacity-5 ml-8">天</span>';
            html += '</div>';
        }
        html += '<div class="mt-10">';
        html += '<span>随访类型：</span>';
        html += '<label class="u-select">';
        html += '<select name="details[' + index + '].followType" data-change="followType" data-followtype required data-msg-required="请选择随访类型" '
                        + (createByMe ? "" : "disabled") + '>';
        var followTypes = detail_obj.followTypes;
        for (var i = 0; i < followTypes.length; i++) {
            var type = followTypes[i];
            html += '<option value="' + type.itemCode + '" ' + (type.itemCode == item.followType ? "selected" : "") + '>' + type.itemName
                            + '</option>';
        }
        html += '</select>';
        html += '</label>';
        html += '</div>';

        html += '<div class="mt-10">';
        html += '<span>随访表单：</span>';
        html += '<label class="u-select">';
        html += '<select name="details[' + index + '].followFormCode" data-change="followFormCode" required data-msg-required="请选择随访表单" '
                        + (createByMe ? "" : "disabled") + '>';
        var followForms = detail_obj.followForms;
        for (var i = 0; i < followForms.length; i++) {
            var form = followForms[i];
            html += '<option value="' + form.itemCode + '" ' + (form.itemCode == item.followFormCode ? "selected" : "") + '>' + form.itemName
                            + '</option>';
        }
        html += '</select>';
        html += '</label>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    /**
     * 显示添加dialog
     */
    showAdd : function() {
        detail_add_dialog.show(this.followTypes, this.followForms, function(data) {
            detail_obj.addElement(data);
        });
    },
    addValidate : function() {
        $('#templateForm').validate({
            rules : {
                templateName : {
                    required : [ "模板名称" ]
                }
            },
            showErrors : function(errorMap, errorList) {
                if (errorList.length > 0) {
                    $(errorList[0].element).focus();
                }
                this.defaultShowErrors();
            }
        });
    },
    /**
     * 共享模板
     * 
     * @param el
     * @param id
     * @param name
     */
    shareRecord : function(el, id, name) {
        var flag = $(el).data("flag");
        var text = flag ? "撤销共享" : "共享";
        system_dialog.show({
            content : "要" + text + "“" + name + "”模板吗？",
            confirmText : text,
            confirmCall : function() {
                $.ajax({
                    url : ctx + "/fuScheduleTemplate/updateShare.shtml",
                    type : "post",
                    data : "id=" + id + "&shareFlag=" + !flag,
                    dataType : "json",
                    loading : true,
                    success : function(data) {
                        if (data.status == 1) {
                            showTips(text + "成功");
                            $(el).data("flag", !flag);
                            $(el).text(!flag ? "撤销共享" : "共享");
                        }
                    }
                });
            }
        });
    },
    /**
     * 删除模板
     * 
     * @param el
     * @param id
     */
    delRecord : function(id, name) {
        system_dialog.show({
            content : "<span class='tipcontent'>要删除“" + name + "”模板吗？</span>",
            confirmText : "删除",
            confirmCss : "u-btn-red",
            confirmCall : function() {
                $.ajax({
                    url : ctx + "/fuScheduleTemplate/delById.shtml",
                    type : "post",
                    data : "id=" + id,
                    dataType : "json",
                    loading : true,
                    success : function(data) {
                        if (data.status == 1) {
                            showTips("删除成功", 1000);
                            detail_obj.cancel();
                        }
                    }
                });
            }
        });
    },
    /**
     * 保存模板
     * 
     * @returns {Boolean}
     */
    saveRecord : function() {
        if (!$("#templateForm").valid())
            return false;
        if (this.details.length == 0) {
            showAlert("随访计划不能为空");
            return false;
        }
        $.ajax({
            url : ctx + "/fuScheduleTemplate/save.shtml",
            type : "post",
            data : $("#templateForm").serialize(),
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == 1) {
                    showAlert("“" + $("#templateForm").find("input[name='templateName']").val() + "”模板添加成功", function() {
                        detail_obj.cancel();
                    });
                } else {
                    showWarn(data.errmsg);
                    if (data.status == "4") {// 模板名称重复,需定位到元素
                        $("#templateForm").find("input[name='templateName']").focus();
                    }
                }
            }
        });
    },
    /** 应用为我的模板 */
    copyRecord : function(id, name) {
        showConfirm("要拷贝“" + name + "”到“我的模板”吗？", function() {
            $.ajax({
                url : ctx + "/fuScheduleTemplate/applyToMe.shtml",
                type : "post",
                data : "id=" + id,
                dataType : "json",
                loading : true,
                loadingMsg : "正在拷贝，请稍等",
                success : function(data) {
                    if (data.status == "1") {
                        showAlert(data.templateName + "模板拷贝成功", function() {
                            detail_obj.cancel();
                        });
                    } else {
                        showAlert("我的模板里面存在同名模板，已经自动改名为" + data.templateName, function() {
                            detail_obj.cancel();
                        });
                    }
                }
            });
        });
    },
    /**
     * 关闭页面
     */
    cancel : function() {
        if (existsFunction("parent.removeActiveTab")) {// 如果父节点存在removeActiveTab方法
            parent.removeActiveTab();
        } else {
            goBack();
        }
    }
};