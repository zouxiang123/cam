var ad_manual = {
    /**
     * 初始化
     */
    init : function() {
        this.addEvents();
        // 触发渲染事件，设置高度
        $(window).resize();
        this.getGroupList(function() {
            ad_manual.getDictList();
        });
        this.addValidate();
    },
    /**
     * 注册事件
     */
    addEvents : function() {
        // 窗口渲染时，设置显示区域的高度
        $(window).on("resize", function() {
            $("#dictListDiv").css("max-height", $(window).height() - $("#dictListDiv").offset().top - 10);
        });
        // 最大值，最小值，单位发生变更时，动态生成参考值
        $("#addMaxValue,#addMinValue,#addUnit").on("change", function() {
            var maxValue = $("#addMaxValue").val();
            var minValue = $("#addMinValue").val();
            var unit = $("#addUnit").val();
            if (isEmpty(maxValue) && !isEmpty(minValue)) {
                $("#addReference").val(">" + minValue);
            }
            if (isEmpty(minValue) && !isEmpty(maxValue)) {
                $("#addReference").val("<" + maxValue);
            }
            if (!isEmpty(maxValue) && !isEmpty(minValue)) {
                $("#addReference").val(minValue + "~" + maxValue);
            }
            if (isEmpty(maxValue) && isEmpty(minValue)) {
                $("#addReference").val("");
            }
        })
    },
    /**
     * 获取手动维护的化验分组列表
     */
    getGroupList : function(callback) {
        $.ajax({
            url : ctx + "/assay/hospDict/listManualAddGroup.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    var list = data.items;
                    var tHtml = "";
                    for (var i = 0; i < list.length; i++) {
                        tHtml += '<option value="' + list[i].groupId + '">' + list[i].groupName + '</option>'
                    }
                    $("#dictAddFrom").find("[name='groupId']").html(tHtml);
                    if (list.length == 0) {
                        $("#dictAddBtn").addClass("hide");
                    } else {
                        $("#dictAddBtn").removeClass("hide");
                        if (!isEmpty(callback)) {
                            callback();
                        }
                    }
                }
            }
        })
    },
    /**
     * 获取手动添加的字典项目
     */
    getDictList : function() {
        $.ajax({
            url : ctx + "/assay/hospDict/listAllManualAdd.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                var html = "";
                if (data.status == "1") {
                    var items = data.allDictHospitalLabPO;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            var item = items[i];
                            html += '<tr>';
                            html += '  <td>' + convertEmpty(item.groupName) + '</td>';
                            html += '  <td class="xtt-10">' + convertEmpty(item.itemName) + '</td>';
                            html += '  <td class="xtt-8">' + convertEmpty(item.itemCode) + '</td>';
                            html += '  <td class="xtt-8">' + convertEmpty(item.minValue) + '</td>';
                            html += '  <td class="xtt-8">' + convertEmpty(item.maxValue) + '</td>';
                            html += '  <td class="xtt-8">' + convertEmpty(item.reference) + '</td>';
                            html += '  <td class="xtt-8">' + convertEmpty(item.unit) + '</td>';
                            html += '  <td class="xtt-10">' + (item.valueType == 1 ? "数值" : "文本") + '</td>';
                            html += '  <td class="xtt-9">';
                            html += '    <button type="button" text class="u-btn-red" onclick="ad_manual.del(\'' + item.groupId + '\',\''
                                            + item.itemCode + '\')">删除</button>';
                            html += '    <button type="button" text class="u-btn-blue" onclick="ad_manual.showAddDict(\'' + item.groupId + '\',\''
                                            + item.itemCode + '\')">编辑</button>';
                            html += '  </td>';
                            html += '</tr>';
                        }
                    }
                }
                $("#dictListBody").html(html);
            }
        })
    },
    /**
     * 删除数据
     * 
     * @param groupId
     * @param itemCode
     */
    del : function(groupId, itemCode) {
        showWarn("您确定要删除该数据么？", function() {
            $.ajax({
                url : ctx + "/assay/hospDict/deleteByGroupIdAndCode.shtml",
                data : {
                    groupId : groupId,
                    itemCode : itemCode
                },
                type : "post",
                dataType : "json",
                success : function(data) {
                    if (data.status == "1") {
                        showTips("删除成功");
                        ad_manual.getDictList();
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            })
        })
    },
    /**
     * 显示新增字典dialog
     */
    showAddDict : function(groupId, itemCode) {
        $("#dictAddFrom").validate().resetForm();
        resetFormAndClearHidden("dictAddFrom");// 表单重置
        if (isEmpty(groupId)) {
            $('#editTitle').html('新增化验项');
            $('#editFalse').hide();
            $('#assayName').show();
            popDialog("#dictAddDialog");
        } else {
            $.ajax({
                url : ctx + "/assay/hospDict/getByGroupIdAndItemCode.shtml",
                data : {
                    groupId : groupId,
                    itemCode : itemCode
                },
                type : "post",
                dataType : "json",
                success : function(data) {
                    if (data.status == "1") {
                        data.rs.oldItemCode = data.rs.itemCode;
                        mappingFormData(data.rs, "dictAddFrom");
                        popDialog("#dictAddDialog");
                        $('#editTitle').html('编辑化验项');
                        $('#editFalse').html(data.rs.groupId);
                        $('#assayName').hide();
                        $('#editFalse').show();
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            })
        }
    },
    /**
     * 显示添加分组dialog
     */
    showAddGroup : function() {
        $("#groupAddFrom").validate().resetForm();
        resetFormAndClearHidden("groupAddFrom");// 表单重置
        popDialog("#groupAddDialog")
    },
    /**
     * 保存分组数据
     */
    saveGroup : function() {
        if (!$("#groupAddFrom").valid()) {
            return false;
        }
        $.ajax({
            url : ctx + "/assay/hospDict/insertGroupName.shtml",
            type : "post",
            data : $("#groupAddFrom").serialize(),
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    showTips("保存成功");
                    ad_manual.getGroupList();
                    hiddenMe("#groupAddDialog");
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 保存字典数据
     */
    saveDict : function() {
        if (!$("#dictAddFrom").valid()) {
            return false;
        }
        $.ajax({
            url : ctx + "/assay/hospDict/saveDict.shtml",
            type : "post",
            data : $("#dictAddFrom").serialize(),
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    showTips("保存成功");
                    ad_manual.getDictList();
                    hiddenMe("#dictAddDialog");
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $.validator.addMethod("numCheck", function(value, element, params) {
            var minValue = $("#addMinValue").val();
            var maxValue = $("#addMaxValue").val();
            if (isEmpty(minValue) || isEmpty(maxValue)) {
                return true;
            }
            if (Number(maxValue) < Number(minValue)) {
                return false;
            } else {
                return true;
            }
        }, jQuery.validator.format("最“大”值要大于最“小”值"));
        $("#groupAddFrom").validate({
            rules : {
                groupName : {
                    required : [ "化验单名称" ]
                },
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorObj($(element));
                $(error[0]).css("padding-right", "30px");
                obj.find("[data-error]").append(error);
            }
        });
        $("#dictAddFrom").validate({
            rules : {
                groupId : {
                    required : [ "化验单名称" ]
                },
                itemName : {
                    required : [ "项目名称" ]
                },
                itemCode : {
                    required : [ "项目代号" ],
                    isNumberOr_Letter : [ "项目代号" ]
                },
                minValue : {
                    number : [ "最小值" ]
                },
                maxValue : {
                    number : [ "最大值" ],
                    numCheck : true
                }
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorObj($(element));
                $(error[0]).css("padding-right", "30px");
                obj.find("[data-error]").append(error);
            }
        });
    }

}