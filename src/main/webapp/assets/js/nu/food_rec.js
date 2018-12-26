var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        food_rec.init();
    });
});
var food_rec = {
    foods : [],
    foodComponent : {},// 食品对应的组成成份
    componentTotal : {},// 营养总量
    init : function() {
        this.addEvents();
        this.addValidate();
        // 初始化数据加载状态
        var initDataLoadCnt = 2;
        // 获取营养成份列表
        $.ajax({
            url : ctx + "/nuFood/listAllComponent.shtml",
            type : "post",
            dataType : "json",
            loading : false,
            success : function(data) {
                if (data.status == "1") {
                    var items = data.rs;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        // 缓存所有饮食成份数据，及每种成份当前含量
                        food_rec.componentTotal[item.itemCode] = {
                            itemCode : item.itemCode,
                            itemName : item.itemName,
                            itemUnit : item.itemUnit,
                            count : 0
                        };
                    }
                    // food_rec.createComponentTotal();
                    initDataLoadCnt--;
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
        // 获取食品数据
        $.ajax({
            url : ctx + "/nuFood/getList.shtml",
            type : "post",
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    for (var i = 0; i < data.rs.length; i++) {
                        var food = data.rs[i];
                        // 缓存所有食品
                        food_rec.foods.push({
                            id : food.itemCode,
                            text : food.itemName
                        });
                        // 缓存食品对应的组成成份
                        food_rec.foodComponent[food.itemCode] = food.components;
                    }
                    initDataLoadCnt--;
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
        // 使用定时器判断初始化数据是否加载完毕
        var intervalId = setInterval(function() {
            if (initDataLoadCnt == 0) {// 所有初始化数据都加载完成了
                var id = $("#foodRecForm").find("input[name='id']").val();
                if (!isEmpty(id)) {// 修改操作
                    $.ajax({
                        url : ctx + "/nuFoodRec/getById.shtml",
                        data : {
                            id : id
                        },
                        type : "post",
                        dataType : "json",
                        success : function(data) {
                            if (data.status == "1") {
                                var item = data.rs;
                                $("#foodRecForm").find("input[name='fkPatientId']").val(item.fkPatientId);
                                $("#foodRecForm").find("input[name='recordDateShow']").val(item.recordDateShow);
                                var hasRecom = false;// 是否存在饮食推荐数据
                                var hasNormal = false;// 是否存在饮食回顾数据
                                if (!isEmptyObject(item.children)) {// 渲染饮食回顾和饮食推荐数据
                                    for (var i = 0; i < item.children.length; i++) {
                                        var child = item.children[i];
                                        food_rec.addRec(child.recType == "recom" ? "foodRecomDiv" : "foodNormalDiv", child.recType, child);
                                        if (!hasRecom) {
                                            hasRecom = child.recType == "recom";
                                        }
                                        if (!hasNormal) {
                                            hasNormal = child.recType == "normal";
                                        }
                                    }
                                    food_rec.addSelectPage($("#foodRecForm"));
                                }
                                if (!hasNormal) {// 如果没有回顾数据，默认显示一条
                                    food_rec.addRec("foodNormalDiv", "normal");
                                }
                                if (!hasRecom) {// 如果没有添加饮食推荐数据，添加一条空的
                                    food_rec.addRec("foodRecomDiv", "recom");
                                }
                            } else {
                                showWarn(data.errmsg);
                            }
                            // 渲染对应的组成成份数据
                            food_rec.calcComponentTotal();
                            // 清除定时器
                            clearInterval(intervalId);
                        }
                    });
                } else {
                    // 默认显示一条饮食回顾
                    food_rec.addRec("foodNormalDiv", "normal");
                    // 默认显示饮食推荐
                    food_rec.addRec("foodRecomDiv", 'recom');
                    // 渲染对应的组成成份数据
                    food_rec.calcComponentTotal();
                    // 清除定时器
                    clearInterval(intervalId);
                }
            }
        }, 200);
    },
    /**
     * 时间注册
     */
    addEvents : function() {
        // 时间注册
        $("#foodRecForm").find("[datepicker]").each(function() {
            laydate.render({
                elem : this,
                value : $("#currentDate").val(),
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });
        // 变更foodCode, quantity事件
        $("#foodNormalDiv").on("change", "[data-foodcode],[data-quantity]", function() {
            food_rec.calcComponentTotal();
        });
        // 食物选中框失焦事件
        $("#foodNormalDiv").on("blur", "[data-foodcode]", function() {
            if (!isEmpty($(this).val())) {
                $(this).selectPageRefresh();
            } else {
                $(this).parents("[data-food]").data("food", "");
            }
        });
    },
    /**
     * 添加饮食数据
     * 
     * @param elId
     * @param type
     */
    addRec : function(elId, type, item) {
        var recItem = isEmptyObject(item) ? {
            recordDateShow : $("#currentDate").val()
        } : item;
        $("#" + elId).append(this.getRecHtml(recItem, type));
        $("#" + elId).find("[datepicker]").each(function() {
            laydate.render({
                elem : this,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });
    },
    /**
     * 添加详情数据
     */
    addDetail : function(el) {
        if ($(el).find("[data-food]").length >= 10) {
            showWarn("最多添加十种食品数据");
            return false;
        }
        $(el).append(this.getDetailHtml({}));
        this.addSelectPage(el);
    },
    /**
     * 注册selectPage
     * 
     * @param el
     */
    addSelectPage : function(el) {
        $(el).find("[data-foodcode]").each(function() {
            var el = this;
            $(this).selectPage({
                showField : 'text',
                keyField : 'id',
                data : food_rec.foods,
                dropButton : false,
                listSize : 15,
                autoFillResult : true,
                eSelect : function(data) {
                    $(el).parents("[data-food]").data("food", data.id);
                }
            });
        });
    },
    /**
     * 获取饮食回顾html
     */
    getRecHtml : function(param, type) {
        var breakfast = "";
        var lunch = "";
        var supper = "";
        var roundName = new Date().getTime();// 随机名称，数据校验用
        if (!isEmptyObject(param.details)) {
            for (var i = 0; i < param.details.length; i++) {
                var detail = param.details[i];
                if (detail.diningTime == "breakfast") {
                    breakfast += food_rec.getDetailHtml(detail);
                } else if (detail.diningTime == "lunch") {
                    lunch += food_rec.getDetailHtml(detail);
                } else if (detail.diningTime == "supper") {
                    supper += food_rec.getDetailHtml(detail);
                }
            }
        }
        var html = '<div data-rec="' + type + '">';
        if (type == "normal") {// 饮食推荐不需要显示时间
            html += '<div class="u-list-text">';
            html += '  <div class="left">回顾时间：</div>';
            html += '  <div class="right">';
            html += '    <input type="text" name="' + roundName + '_date" class="custom" value="' + convertEmpty(param.recordDateShow)
                            + '" required data-date datepicker data-msg-required="请选择回顾时间" readonly>';
            html += '  </div>';
            html += '</div>';
        }
        html += '<div class="u-list-text">';
        html += '  <div class="left">早餐：</div>';
        html += '  <div class="right">';
        html += '    <div><button type="text" class="u-btn-blue custom" onclick="food_rec.addDetail($(this).parent().next())">添加饮食</button></div>';
        html += '    <div data-detail="breakfast">' + breakfast + '</div>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="u-list-text">';
        html += '  <div class="left">午餐：</div>';
        html += '  <div class="right">';
        html += '    <div><button type="text" class="u-btn-blue custom" onclick="food_rec.addDetail($(this).parent().next())">添加饮食</button></div>';
        html += '    <div data-detail="lunch">' + lunch + '</div>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="u-list-text">';
        html += '  <div class="left"> 晚餐：</div>';
        html += '  <div class="right">';
        html += '    <div><button type="text" class="u-btn-blue custom" onclick="food_rec.addDetail($(this).parent().next())">添加饮食</button></div>';
        html += '    <div data-detail="supper">' + supper + '</div>';
        html += '  </div>';
        html += '</div>';
        html += '<div class="u-list-text">';
        html += '  <div class="left">备注信息：</div>';
        html += '  <div class="right">';
        html += '    <textarea class="mt-6" long placeholder="请输入内容" maxlength="128" data-remark>'
                        + convertEmpty(type == "normal" ? param.remark : param.recomRemark) + '</textarea>';
        html += '  </div>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    /**
     * 获取详情html
     * 
     * @param obj
     */
    getDetailHtml : function(obj) {
        var roundName = new Date().getTime();
        var html = "";
        html += '<div data-food="' + convertEmpty(obj.foodCode) + '">';
        html += '  <input type="text" class="custom" name="' + roundName + '_foodcode" data-init="' + convertEmpty(obj.foodCode)
                        + '" required data-foodcode data-msg-required="请选择食品"/>';
        html += '  <input type="text" class="custom" short name="' + roundName + '_quantity" value="'
                        + (isEmpty(obj.quantity) ? "" : Number(obj.quantity))
                        + '" maxlength="6" required data-msg-required="请填写数量" data-rule-quantity="true" data-quantity>';
        html += '  <span class="unit">g</span>';
        html += '  <button type="button" text class="u-btn-red ml-10" onclick="food_rec.removeDetail($(this).parent())">删除</button>';
        html += '</div>';
        return html;
    },
    /**
     * 删除详情
     * 
     * @param el
     */
    removeDetail : function(el) {
        el.remove();
        this.calcComponentTotal();
    },
    /**
     * 计算摄入总量
     */
    calcComponentTotal : function() {
        var foodComponent = this.foodComponent;
        var total = this.componentTotal;
        for ( var key in total) {// 重置总量
            total[key].count = 0;
        }
        $("#foodNormalDiv").find('[data-food]').each(function() {
            var quantity = $(this).find("[data-quantity]").val();
            if (!isNaN(quantity)) {
                var component = foodComponent[$(this).data("food")];
                // 数据库存储的是100g的含量
                quantity = quantity / 100;
                for ( var key in component) {
                    total[key].count += component[key].quantity * quantity;
                    // 保留两位小数
                    total[key].count = Number(Number(total[key].count).toFixed(2));
                }
            }
        });
        this.componentTotal = total;
        this.createComponentTotal();
    },
    /**
     * 计算营养摄入量
     */
    createComponentTotal : function() {
        var html = '';
        var total = this.componentTotal;
        // 计算对象数据总量
        var totalSize = 0;
        for (key in total) {
            if (total.hasOwnProperty(key)) {
                totalSize++;
            }
        }
        var i = 0;
        var dei = "";
        var dpi = "";
        for ( var key in total) {
            var item = total[key];
            if (i == 0) {// 营养成份分成左右两边显示，一边显示一半
                html += '<div>';
            } else if (i == parseInt(totalSize / 2) + 1) {
                html += '</div><div>';
            }
            html += '<div class="list">';
            html += '<span>' + item.itemName + '：</span>';
            html += '<span>' + item.count + '</span>';
            html += '<span>' + convertEmpty(item.itemUnit) + '</span>';
            html += '</div>';
            if (i == totalSize) {
                html += '</div>';
            }
            // dpi
            if (key == $("#proteinKey").val()) {
                dpi = item.count + convertEmpty(item.itemUnit);
            }
            // dei
            if (key == $("#energyKey").val()) {
                dei = item.count + convertEmpty(item.itemUnit);
            }
            i++;
        }
        $("#dpiSpan").text(dpi);
        $("#deiSpan").text(dei);
        $("#foodNormalComponentTotalDiv").html(html);
    },
    /**
     * 保存记录
     * 
     * @param callback
     */
    save : function(callback) {
        if (!$('#foodRecForm').valid()) {
            return;
        }
        var form = $('#foodRecForm');
        var param = {
            id : form.find("[name='id']").val(),
            fkPatientId : form.find("[name='fkPatientId']").val(),
            recordDateShow : form.find("[name='recordDateShow']").val(),
        };
        var children = [];
        var foodComponent = this.foodComponent;// 食品组成
        var proteinKey = $("#proteinKey").val();// 蛋白质的key
        var energyKey = $("#energyKey").val();// 能量的key
        form.find("[data-rec]").each(function() {
            var type = $(this).data("rec");
            var recEl = $(this);
            var rec = {
                recordDateShow : recEl.find("[data-date]").val(),
                recType : type
            };
            if (type == "recom") {// 饮食推荐
                rec.recomRemark = recEl.find("[data-remark]").val();
            } else {
                rec.remark = recEl.find("[data-remark]").val();
            }
            var details = [];
            // 组装详情数据
            recEl.find("[data-food]").each(function() {
                var foodId = $(this).data("food");
                var component = foodComponent[foodId];
                var detail = {
                    recType : type,
                    quantity : $(this).find("[data-quantity]").val(),
                    foodCode : $(this).data("food"),
                    diningTime : $(this).parents("[data-detail]").data("detail")
                };
                if (component.hasOwnProperty(proteinKey)) {// 判断是否有蛋白质
                    detail.protein = convertEmpty(component[proteinKey].quantity);
                }
                if (component.hasOwnProperty(energyKey)) {// 判断是否有能量
                    detail.energy = convertEmpty(component[energyKey].quantity);
                }
                details.push(detail);
            });
            rec.details = details;
            if (details.length > 0) {
                children.push(rec);
            }
        });
        if (children.length == 0) {
            showAlert("没有需要保存的数据");
            return;
        }
        param.children = children;
        $.ajax({
            url : ctx + "/nuFoodRec/save.shtml",
            data : JSON.stringify(param),
            type : "post",
            dataType : "json",
            contentType : "application/json",
            success : function(data) {
                if (data.status == "1") {
                    showTips();
                    if (!isEmpty(callback)) {
                        callback();
                    }
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
        // 数量的取值范围
        $.validator.addMethod("quantity", function(value, element) {
            if (isEmpty(value)) {
                return true;
            }
            if (isNaN(value)) {
                return false;
            }
            var valueNo = Number(value);
            if (valueNo >= 0.01 && valueNo <= 99999) {
                return true;
            }
            return false;
        }, jQuery.validator.format("数量的值无效,应位于0.01~99999之间"));
        $('#foodRecForm').validate({
            onsubmit : false,
            // 校验字段
            rules : {
                recordDateShow : {
                    required : [ "测量日期" ]
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