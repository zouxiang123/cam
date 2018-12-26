var dict_maintain = {
    /**
     * 化验项
     */
    assayItems : [],
    /**
     * 所属系统
     */
    sysOwner : null,
    /**
     * 初始化字典表维护页面
     * 
     * @param sysOwner
     *            所属系统，必须字段
     */
    init : function(sysOwner) {
        this.sysOwner = sysOwner;
        $("#dictionaryTopTab").css("margin-left", "-" + ($("#dictionaryTopTab").width() / 2) + "px");
        // 清空tablebody数据
        this.clearTableBody();
        this.addEvents();
        $(window).resize();
        this.addValidate();
        $("#dictionaryTopTab").find("span[data-type].active").trigger("click");
    },
    addEvents : function() {
        // 动态设置高度
        $(window).on("resize", function() {
            var displayHeight = $(window).height() - $("#dictionaryList").offset().top - 10;
            $("#dictionaryCategoryList").height(displayHeight);
            $("#dictionaryList").height(displayHeight);
            $("#dictionaryCategorySearchContent").height(displayHeight - 70);
        });

        // 化验项和字典点击tab切换事件
        $("#dictionaryTopTab").on("click", "span[data-type]", function() {
            $(this).addClass("active").siblings().removeClass("active");
            dict_maintain.clearTableBody();
            dict_maintain.getTableBody();
            dict_maintain.showActiveContent();
        });

        // 字典表类别点击事件
        $("#dictionaryCategorySearchContent").on("click", "[data-type]", function() {
            dict_maintain.clearTableBody();
            $(this).addClass("active").siblings().removeClass("active");
            $("#dictionaryQueryForm input[name='pItemCode']").val($(this).attr("data-type"));
            dict_maintain.getDictionaryTableBody();
        });
    },
    /** 显示active tab的内容 */
    showActiveContent : function() {
        $("#dictionaryTopTab span[data-type]").each(function() {
            if ($(this).hasClass("active")) {
                $("#" + $(this).attr("data-type")).show();
            } else {
                $("#" + $(this).attr("data-type")).hide();
            }
        });
    },
    /** 清空tableBody的值 */
    clearTableBody : function() {
        var type = $("#dictionaryTopTab .active").attr("data-type");
        $("#" + type + "TableBody").html("");
    },
    /** 获取tableBody数据 */
    getTableBody : function() {
        var type = $("#dictionaryTopTab .active").attr("data-type");
        if (type == "dictionary") {
            var selectedObj = $("#dictionaryCategorySearchContent").find("[data-type].active");
            if (!isEmpty(selectedObj) && selectedObj.length > 0) { // 刷新项
                dict_maintain.getDictionaryTableBody();
            } else { // 刷新类别
                dict_maintain.getDictionaryCategory();
            }
        }
    },
    /** 获取字典表类别列表 */
    getDictionaryCategory : function() {
        $.ajax({
            url : ctx + "/system/dictionary/getDictCategoryList.shtml",
            type : "post",
            data : "sysOwner=" + dict_maintain.sysOwner,
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    var bodyHtml = "";
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        bodyHtml += '<div class="nav-search-result" style="min-height:40px;height:auto;" data-type="' + item.pItemCode
                            + '"><span style="max-width: inherit;">' + item.itemDesc + '</span></div>';
                    }
                    $("#dictionaryCategorySearchContent").html(bodyHtml);

                    $("#dictionaryList").css("height", $("#dictionaryCategoryList").css("height"));
                    $('#dictionaryCategorySearch').fastLiveFilter('#dictionaryCategorySearchContent', {
                        timeout : 300,
                        callback : function(total) {
                            $('#dictionaryCategorySearchCount').html("共" + total + "种类别");
                        }
                    }); // 初始化过滤器
                }
            }
        });
    },
    /** 获取table数据 */
    getDictionaryTableBody : function() {
        $.ajax({
            url : ctx + "/system/dictionary/getDictionaryList.shtml",
            type : "post",
            data : $("#dictionaryQueryForm").serialize() + "&sysOwner=" + dict_maintain.sysOwner,
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    var bodyHtml = "";
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        bodyHtml += '<tr data-type="' + item.pItemCode + '">';
                        bodyHtml += '<td class="text-center">' + convertEmpty(item.pItemCode) + '</td>';
                        bodyHtml += '<td class="text-center">' + convertEmpty(item.itemDesc) + '</td>';
                        bodyHtml += '<td class="text-center">' + convertEmpty(item.itemCode) + '</td>';
                        bodyHtml += '<td class="text-center"><input type="text" name="itemName" value="' + (item.itemName)
                            + '" maxlength="64" /></td>';
                        bodyHtml += '<td class="text-center"><input type="number" name="orderBy" value="' + convertEmpty(item.orderBy)
                            + '" maxlength="3" /></td>';
                        bodyHtml += '<td class="text-center">' + (item.isEnable ? "是" : "否") + '</td>';
                        bodyHtml += '<td>';
                        bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="dict_maintain.updateDictionary(this,\'' + item.id
                            + '\')">更  新</button>';
                        if (item.isEnable)
                            bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="dict_maintain.updateDictionary(this,'
                                + item.id + ',false)">停  用</button>';
                        else
                            bodyHtml += '<button type="button" class="btn btn-def pull-right" onclick="dict_maintain.updateDictionary(this,'
                                + item.id + ',true)">启  用</button>';
                        bodyHtml += '</td>';
                        bodyHtml += '</tr>';
                    }
                    $("#dictionaryTableBody").html(bodyHtml);
                }
            }
        });
    },
    /** 显示添加项dialog */
    showAddDialog : function(dialogId) {
        $("#" + dialogId).find("form")[0].reset();
        $("#" + dialogId).find("form input[name='id']").val("");
        if ("dictionaryAddDialog" == dialogId) {
            var selectedObj = $("#dictionaryCategorySearchContent").find("[data-type].active");
            if (!isEmpty(selectedObj) && selectedObj.length > 0) {
                $("#" + dialogId).find("form input[name='pItemCode']").attr("readonly", true).val(selectedObj.attr("data-type"));
                $("#" + dialogId).find("form input[name='itemDesc']").attr("readonly", true).val(selectedObj.find("span").text());
            }
        }
        $("#" + dialogId).modal("show");
    },
    /** 更新字典表 */
    updateDictionary : function(element, itemId, isEnable) {
        var data = "";
        if (!isEmpty(isEnable)) { // 更新状态
            data = "id=" + itemId + "&isEnable=" + isEnable;
        } else { // 更新数据操作
            var parentObj = $(element).parent().parent();
            var orderBy = parentObj.find("input[name='orderBy']").val();
            var name = parentObj.find("input[name='itemName']").val();
            var errorMap = {};
            if (isEmpty(name)) {
                errorMap["itemName"] = "显示的名称不能为空";
            }
            if (isEmpty(orderBy)) {
                errorMap["orderBy"] = "排序的值不能为空";
            } else if (!isPInt(orderBy)) {
                errorMap["orderBy"] = "排序的值只能为正整数";
            }
            if (isEmptyObject(errorMap)) {
                data = "id=" + itemId + "&itemName=" + encodeURIComponent(name) + "&orderBy=" + encodeURIComponent(orderBy) + "&pItemCode="
                + encodeURIComponent(parentObj.attr("data-type"));
            } else {
                showSystemDialog(errorMap, "info");
            }
        }
        if (!isEmpty(data))
            dict_maintain.saveDictionary(data);
    },
    /** 保存添加的字典表数据 */
    saveAddDictionary : function(formId, dialogId, needHide) {
        if ($("#" + formId).valid()) {
            dict_maintain.saveDictionary($("#" + formId).serialize(), dialogId, needHide);
        }
    },
    /** 保存字典表数据 */
    saveDictionary : function(data, dialogId, needHide) {
        $.ajax({
            url : ctx + "/system/dictionary/updateDictionary.shtml",
            type : "post",
            data : data + "&sysOwner=" + dict_maintain.sysOwner,
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == 1) {
                    showTips();
                    if (needHide) {
                        dict_maintain.clearTableBody();
                        dict_maintain.getTableBody();
                        $("#" + dialogId).modal("hide");
                    }
                } else if (data.status == 2) {
                    showWarn("当前类别下的(名称/值)已存在");
                } else if (data.status == 0) {
                    showWarn("同类别下的排序值不能相同");
                }
            }
        });
    },
    /** 刷新内存数据 */
    refreshMemory : function() {
        $.ajax({
            url : ctx + "/system/dictionary/refresh.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    showAlert("刷新成功");
                }
            }
        });
    },
    /** 添加校验 */
    addValidate : function() {
        $('#dictionaryAddForm').validate({
            onfocusout : false,
            // 校验字段
            rules : {
                pItemCode : {
                    required : [ "类别key" ],
                    isNumberOr_Letter : [ "类别key" ]
                },
                itemDesc : {
                    required : [ "类别名称" ]
                },
                itemCode : {
                    required : [ "value" ],
                    isNumberOr_Letter : [ "value" ]
                },
                itemName : {
                    required : [ "名称" ]
                },
                orderBy : {
                    required : [ "排序" ],
                    isPInt : [ "排序" ]
                }
            },
            // 全部校验结果
            showErrors : function(errorMap, errorList) {
                showSystemDialog(errorMap);
            }
        });
    }
};