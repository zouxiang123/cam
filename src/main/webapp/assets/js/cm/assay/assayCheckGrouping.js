var rule_conf = {
    init : function() {
        this.addEvents();
        this.getCategoryList(function() {
            $("#categoryContentDiv").find(":radio:first").click();
        });
        this.addValidate();
    },
    addEvents : function() {
        // 检查类别点击事件
        $("#categoryContentDiv").on("change", ":radio", function() {
            rule_conf.getItemList($(this).val(), function() {// 默认触发第一项的change事件
                $("#itemContentDiv").find(":radio:first").click();
            });
        });
        // itemCode点击事件
        $("#itemContentDiv").on("change", ":radio", function() {
            rule_conf.getRule($(this).val());
        });
        // 删除分组规则事件
        $("#ruleList").on("click", ".closeinput", function() {
            var ruleDiv = $(this).parents("[data-ruleadd]");
            ruleDiv.next("span").remove();
            ruleDiv.remove();
            rule_conf.resetRule();
        });
    },
    /**
     * 获取类别列表
     */
    getCategoryList : function(callback) {
        $.ajax({
            url : ctx + "/assay/hospDict/getAssayCategoryList.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                var html = '';
                if (data.status == "1") {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        html += '<div class="u-xt-3">';
                        html += '  <label class="u-radio">';
                        html += '    <input type="radio" name="groupId" value="' + item.groupId + '">';
                        html += '    <span class="icon-radio"></span>' + item.groupName;
                        html += '  </label>';
                        html += '</div>';
                    }
                }
                $("#categoryContentDiv").html(html);
                if (!isEmpty(callback)) {
                    callback();
                }
                $('#categorySearch').fastLiveFilter('#categoryContentDiv', {
                    timeout : 300
                });
            }
        });
    },
    /**
     * 获取检查项列表
     */
    getItemList : function(groupId, callback) {
        $.ajax({
            url : ctx + "/assay/hospDict/getAssayList.shtml",
            data : {
                groupId : groupId
            },
            type : "post",
            dataType : "json",
            success : function(data) {
                var html = '';
                if (data.status == "1") {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        html += '<div class="u-xt-3">';
                        html += '  <label class="u-radio">';
                        html += '    <input type="radio" name="itemCode" value="' + item.itemCode + '">';
                        html += '    <span class="icon-radio"></span>' + item.itemName;
                        html += '  </label>';
                        html += '</div>';
                    }
                }
                $("#itemContentDiv").html(html);
                if (!isEmpty(callback)) {
                    callback();
                }
                $('#itemSearch').fastLiveFilter('#itemContentDiv', {
                    timeout : 300
                });
            }
        });
    },
    /**
     * 获取对应的分组规则
     */
    getRule : function(itemCode) {
        $.ajax({
            url : ctx + "/assay/hospDict/getByItemCode.shtml",
            data : {
                "itemCode" : itemCode
            },
            type : "post",
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    mappingFormData(data.rs, "dictForm");
                }
            }
        });
        $.ajax({
            url : ctx + "/assay/patientAssayGroupRule/getGroupRuleByItemCode.shtml",
            type : "post",
            dataType : "json",
            data : {
                "itemCode" : itemCode
            },
            success : function(data) {
                if (data.status == "1") {
                    var items = data.rs;
                    var rules = [];
                    for (var i = 0; i < items.length; i++) {
                        rules.push(items[i].minValue);
                    }
                    rule_conf.createRuleHtml(rules);
                }
            }
        })
    },
    /**
     * 添加分组规则
     * 
     * @param val
     */
    addRule : function() {
        var val = $("#ruleBasic").find("input").val();
        if (isEmpty(val) || isNaN(val)) {
            showWarn("分组规则的值无效");
            return false;
        }
        this.resetRule();
    },
    /**
     * 重置分组规则
     */
    resetRule : function() {
        var ruleMap = {};
        // 去除重复数据
        $("#ruleList").find("input").each(function() {
            var val = $(this).val();
            if (!isEmpty(val) && !isNaN(val)) {
                ruleMap[Number(val)] = 1;
            }
        });
        var rules = [];
        for ( var key in ruleMap) {
            rules.push(key);
        }
        rules.sort();
        this.createRuleHtml(rules);
    },
    /**
     * 清空排序规则
     */
    clearRule : function() {
        $("#ruleList").find("[data-ruleadd],[data-rulespan]").remove();
        $("#ruleBasic").find("input").val("");
    },
    /**
     * 生成分组规则html
     */
    createRuleHtml : function(rules) {
        var html = '';
        for (var i = 0; i < rules.length; i++) {
            html += '<div class="u-display-inlineBlock position-relative" data-ruleadd>';
            html += '<input type="text" class="mr-8 width-72-imp" value="' + rules[i]
                            + '" data-addinput readonly><i class="icon-error closeinput"></i>';
            html += '</div>';
            html += '<span class="mr-8" data-rulespan>/</span>';
        }
        this.clearRule();
        $("#ruleList").prepend(html);
    },
    /**
     * 保存数据
     */
    save : function() {
        if (!$("#dictForm").valid()) {
            return false;
        }
        var postData = {};
        postData.assayHospDict = $("#dictForm").serializeJson();
        var rules = [];
        $("#ruleList").find("input[data-addinput]").each(function() {
            var rule = {};
            rule.minValue = $(this).val();
            rules.push(rule);
        });
        postData.patientAssayGroupRuleList = rules;
        $.ajax({
            url : ctx + "/assay/patientAssayGroupRule/saveRule.shtml",
            data : JSON.stringify(postData),
            type : "post",
            dataType : "json",
            contentType : "application/json",
            success : function(data) {
                if (data.status == "1") {
                    showTips("保存成功");
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
            var minValue = $("#personalMinValue").val();
            var maxValue = $("#personalMaxValue").val();
            if (isEmpty(minValue) || isEmpty(maxValue)) {
                return true;
            }
            if (Number(maxValue) < Number(minValue)) {
                return false;
            } else {
                return true;
            }
        }, jQuery.validator.format("最“大”值要大于最“小”值"));
        $("#dictForm").validate({
            rules : {
                personalMinValue : {
                    number : [ "最小值" ]
                },
                personalMaxValue : {
                    number : [ "最大值" ],
                    numCheck : true
                },
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorObj($(element));
                $(error[0]).css("padding-right", "30px");
                obj.find("[data-error]").append(error);
            }
        });
    }
}