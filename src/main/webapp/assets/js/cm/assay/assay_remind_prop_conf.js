var remind_prop_conf = {
    endDateId : null,
    dictCache : {},// 字典数据缓存
    init : function() {
        // this.getEndData();
        this.addEvents();
        $(window).resize();
        this.getDictList();
        this.getList();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 变更截止日期，自动保存
        /*$("#endDate").on("change", function() {
            $.ajax({
                url : ctx + '/assayConf/update.shtml',
                dataType : 'json',
                type : 'POST',
                data : {
                    id : remind_prop_conf.endDateId,
                    endDate : $(this).val()
                },
                success : function(result) {
                    if (result.status == "1") {
                        showTips("保存成功");
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        });*/
        // window渲染事件
        $(window).on("resize", function() {
            $("#remindBodyDiv").css("max-height", $(window).height() - $("#remindBodyDiv").offset().top - 64);
            $("#dictBodyDiv").css("max-height", $(window).height() - $("#dictBodyDiv").offset().top - 206);
        })
    },
    /**
     * 获取截止日期数据
     */
    /*getEndData : function() {
        $.ajax({
            url : ctx + '/assayConf/getItem.shtml',
            dataType : 'json',
            type : 'POST',
            success : function(result) {
                remind_prop_conf.endDateId = null;
                if (result.status == "1") {
                    var item = result.rs;
                    if (!isEmptyObject(item)) {
                        remind_prop_conf.endDateId = item.id;
                        $("#endDate").val(item.endDate);
                    }
                }
            }
        });
    },*/
    /**
     * 获取字典数据列表
     */
    getDictList : function() {
        $.ajax({
            url : ctx + '/assayPropRemindConf/getDictList.shtml',
            dataType : 'json',
            type : 'POST',
            success : function(result) {
                remind_prop_conf.dictCache = {};
                if (result.status == "1") {
                    var items = result.rs;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        remind_prop_conf.dictCache[item.itemCode] = item;
                    }
                }
            }
        });
    },
    /**
     * 获取提醒项数据列表
     */
    getList : function() {
        $.ajax({
            url : ctx + '/assayPropRemindConf/getList.shtml',
            dataType : 'json',
            type : 'POST',
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var html = "";
                    if (!isEmptyObject(items)) {
                        for (var i = 0; i < items.length; i++) {
                            html += remind_prop_conf.getOneClassHtml(items[i]);
                        }
                    }
                    $("#remindBody").html(html);
                }
            }
        });
    },
    /**
     * 获取单个分类项的html
     * 
     * @param item
     */
    getOneClassHtml : function(item) {
        var html = "";
        var hidden = '<input type="hidden" name="itemCode" value="' + convertEmpty(item.itemCode) + '">';
        hidden += '<input type="hidden" name="itemName" value="' + convertEmpty(item.itemName) + '">';
        hidden += '<input type="hidden" name="groupId" value="' + convertEmpty(item.groupId) + '">';
        hidden += '<input type="hidden" name="groupName" value="' + convertEmpty(item.groupName) + '">';
        html += '<tr>';
        html += '<td class="xtt-20">' + hidden + convertEmpty(item.groupName) + '</td>';
        html += '<td>' + convertEmpty(item.itemName) + '</td>';
        // html += '<td class="xtt-9"><input type="text" class="width-72-imp" name="assayDay" value="' + convertEmpty(item.assayDay)
        // + '" maxlength="8"></td>'

        // html += '<td class="xtt-9"><input type="text" class="width-72-imp" name="minValue" value="' + convertEmpty(item.minValue)
        // + '" maxlength="8"></td>'
        // html += '<td class="xtt-9"><input type="text" class="width-72-imp" name="maxValue" value="' + convertEmpty(item.maxValue)
        // + '" maxlength="8"></td>'
        // html += '<td class="xtt-9"><input type="text" class="width-72-imp" name="differenceValue" value="' + convertEmpty(item.differenceValue)
        // + '" maxlength="8"></td>'
        // html += '<td class="xtt-9"><input type="text" class="width-72-imp" name="percentageValue" value="' + convertEmpty(item.percentageValue)
        // + '" maxlength="8"></td>'
        html += '<td class="xtt-5">';
        html += '  <button type="button" text class="u-btn-red" onclick="remind_prop_conf.removeItem(this);">删除</button>';
        html += '</td>';
        html += '</tr>';
        return html;
    },
    /**
     * 显示新增弹框
     */
    showAdd : function() {
        $('#dictBodySearch').val("");
        var items = this.dictCache;
        var html = "";
        for ( var key in items) {
            var item = items[key];
            if (item.selectFlag) {// 已选中的数据不显示
                continue;
            }
            html += '<tr>';
            html += '  <td class="xtt-4">';
            html += '    <label class="u-checkbox mr-0">';
            html += '     <input type="checkbox" name="itemCode" value="' + convertEmpty(item.itemCode) + '">';
            html += '     <span class="icon-checkbox mr-0"></span>';
            html += '    </label>';
            html += '  </td>';
            html += '  <td class="xtt-30">' + convertEmpty(item.groupName) + '</td>';
            html += '  <td class="xtt-20">' + convertEmpty(item.itemCodeShow) + '</td>';
            html += '  <td>' + convertEmpty(item.itemName) + '</td>';
            html += '</tr>';
        }
        $("#dictBody").html(html);
        $('#dictBodySearch').fastLiveFilter('#dictBody');
        popDialog("#addItemDialog");
    },
    /**
     * 删除项目
     * 
     * @param el
     */
    removeItem : function(el) {
        var trEl = $(el).parents("tr");
        var itemCode = trEl.find("[name='itemCode']").val();
        if (!isEmpty(this.dictCache[itemCode])) {
            this.dictCache[itemCode].selectFlag = false;// 设置缓存当前项目的选中标识为false
        }
        trEl.remove();
    },
    /**
     * 添加项目
     */
    addItem : function() {
        // 选中的项目
        $("#dictBody").find(":checkbox:checked").each(function() {
            var item = {};
            var dictItem = remind_prop_conf.dictCache[$(this).val()];
            item.itemCode = dictItem.itemCode;
            item.itemName = dictItem.itemName;
            item.groupId = dictItem.groupId;
            item.groupName = dictItem.groupName;
            dictItem.selectFlag = true;
            $("#remindBody").append(remind_prop_conf.getOneClassHtml(item));
        })
        hiddenMe("#addItemDialog");
    },
    /**
     * 保存数据
     */
    save : function() {
        var detailList = new Array();
        var flag = true;
        $("#remindBody").find("tr").each(function() {
            var errorMap = {};
            /*var minValue = $(this).find("input[name='minValue']").val();
            if (!isEmpty(minValue) && isNaN(minValue)) {
                errorMap.minValue = "最小值的值无效";
            }
            var maxValue = $(this).find("input[name='maxValue']").val();
            if (!isEmpty(maxValue) && isNaN(maxValue)) {
                errorMap.maxValue = "最大值的值无效";
            }
            if (!isEmpty(minValue) && !isEmpty(maxValue) && Number(minValue) > Number(maxValue)) {
                errorMap.min_max_value = "最“大”值应大于最“小”值";
            }*/
            if (!isEmptyObject(errorMap)) {
                flag = false;
                showSystemDialog(errorMap, "warn");
                $("#remindBodyDiv").animate({
                    scrollTop : $("#remindBodyDiv").scrollTop() + $(this).offset().top - $("#remindBodyDiv").offset().top
                }, 500);
            }
            if (!flag) {
                return false;
            }
        });
        if (flag) {
            $("#remindBodyDiv").find("input[name='itemCode']").each(function(i, obj) {
                var trEl = $(this).parents("tr");
                detailList.push({
                    itemCode : $(this).val(),
                    itemName : trEl.find("input[name='itemName']").val(),
                    groupId : trEl.find("input[name='groupId']").val(),
                    groupName : trEl.find("input[name='groupName']").val()
                });

            });
            $.ajax({
                url : ctx + '/assayPropRemindConf/save.shtml',
                data : JSON.stringify(detailList),
                dataType : 'json',
                type : 'POST',
                loading : true,
                contentType : 'application/json;charset=utf-8',
                success : function(data) {
                    showTips("保存成功");
                }
            });
        }
    }
}