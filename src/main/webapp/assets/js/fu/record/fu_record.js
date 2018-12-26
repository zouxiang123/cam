$(function() {
    record_obj.init();
});
var record_obj = {
    init : function() {
        record_obj.getList();
        record_obj.addEvents();
    },
    addEvents : function() {
        // 计算与身高相关指标
        $("#tableBody").on("change", "form [data-calcstature]", function() {
            var form = $(this.form);
            var statureMeasureWay = $("[name='statureMeasureWay']", form).val();
            var weight = $("[name='weight']", form).val();
            var measureValue = $("[name='statureMeasureValue']", form).val();
            if (isEmpty(measureValue) || isEmpty(statureMeasureWay))
                return;
            var data = "value=" + measureValue + "&measureWay=" + statureMeasureWay + "&patientId=" + $("#patientId").val() + "&weight=" + weight;
            record_obj.setCalcData(data, ctx + "/nutritionCalculate/getStature.shtml", form, $(this).attr("data-calcstature"));
        });
        // 计算上臂肌围数据
        $("#tableBody").on("change", "form [data-calcmamc]", function() {
            var form = $(this.form);
            var skinfoldPart = $("[name='skinfoldPart']", form).val();
            var skinfoldThickness = $("[name='skinfoldThickness']", form).val();
            var mac = $("[name='mac']", form).val();
            // 是皮褶部位肱二头肌时
            if (skinfoldPart != "1" || isEmpty(skinfoldThickness) || isEmpty(mac))
                return;
            var data = "tsf=" + skinfoldThickness + "&mac=" + mac;
            record_obj.setCalcData(data, ctx + "/nutritionCalculate/getMamc.shtml", form, $(this).attr("data-calcmamc"));
        });
        // 计算腰臀比数据
        $("#tableBody").on("change", "form [data-calcwhr]", function() {
            var form = $(this.form);
            var waist = $("[name='waist']", form).val();
            var hip = $("[name='hip']", form).val();
            if (isEmpty(waist) || isEmpty(hip))
                return;
            var data = "waist=" + waist + "&hip=" + hip;
            record_obj.setCalcData(data, ctx + "/nutritionCalculate/getWHR.shtml", form, $(this).attr("data-calcwhr"));
        });
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
        // 需要计算分值
        $("#tableBody").on("click", "[data-itemscore]", function() {
            var totalScoreDiv = record_obj.getElByAttr(this, "[data-scoresspan]", false);
            if (!isEmpty(totalScoreDiv)) {
                var totalScore = 0;
                $("[data-itemscore]:checked", totalScoreDiv).each(function() {
                    totalScore += parseInt($(this).data("itemscore"));
                });
                var dynamicdiv = record_obj.getElByAttr(this, "[data-dynamicdiv]", true).data("dynamicdiv");
                $("input[name='scores']", $("#tableBody form[data-dynamicform='" + dynamicdiv + "']")).val(totalScore);
                $("[data-scoresspan]", totalScoreDiv).text(totalScore);
            }
        });
    },
    getElByAttr : function(el, attr, isCurrent, index) {
        index = isEmpty(index) ? 1 : ++index;
        if (index > 15) {
            return;
        }
        if ($(el).find(attr).length > 0) {
            if (isCurrent) {
                return $(el).find(attr);
            } else {
                return $(el);
            }
        } else {
            el = $(el).parent();
            return record_obj.getElByAttr(el, attr, isCurrent, index);
        }
    },
    /** 获取并设置自动计算的结果字段的值 */
    setCalcData : function(data, url, form, calcNodesStr) {
        $.ajax({
            url : url,
            type : "post",
            data : encodeURI(data),
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == 1) {
                    var calcNodes = calcNodesStr.split(",");
                    for (var i = 0; i < calcNodes.length; i++) {
                        $("[name='" + calcNodes[i] + "']", form).val(data[calcNodes[i]]);
                        $("[data-" + calcNodes[i] + "span]", form).text(data[calcNodes[i]]);
                    }
                }
            }
        });
    },
    getList : function() {
        var data = "sysOwner=" + $("#sysOwner").val() + "&scheduleId=" + $("#fkPatientScheduleId").val() + "&patientId=" + $("#patientId").val()
                        + "&type=" + $("#formType").val();
        if (!isEmpty($("#id").val())) {
            data += "&recordId=" + $("#id").val();
        }
        if (!isEmpty($("#isNew").val())) {
            data += "&isNew=" + $("#isNew").val();
        }
        if (!isEmpty($("#detailId").val())) {
            data += "&detailId=" + $("#detailId").val();
        }
        $.ajax({
            url : ctx + "/fuRecord/getList.shtml",
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
                            var formType = item.form.formType;
                            var staticHtmlObj = $("#" + formType + "_staticHtml").clone(true);
                            if (!isEmptyObject(item.nodes)) {
                                var dynamicHtml = dfr_obj.generateNodes(item.nodes);
                                staticHtmlObj.find("#" + formType + "_dynamicForm").html(dynamicHtml);
                            }
                            html += staticHtmlObj.html();
                            $("#" + formType + "_staticHtml").remove();
                        }
                    }
                }
                $("#tableBody").html(html);
                if (needMappingFormData) {// 批量设定各表单的值
                    $("#tableBody form").each(function() {
                        var formType = $(this).attr("id");
                        var jsonData;
                        for (var i = 0; i < data.items.length; i++) {
                            var item = data.items[i];
                            if (formType == item.form.formType) {
                                if (isEmpty(item.record.id))// setting initial data
                                    item.record.fkFormId = item.form.fkFormId;
                                if (formType == "FU_NA") {// 如果是化验表单
                                    item.record.skinfoldPart = "1";// 默认选择皮褶部位
                                    item.record.statureMeasureWay = "1";// 默认选择直接测量
                                }
                                jsonData = item.record;
                                break;
                            }
                        }
                        for ( var key in jsonData) {
                            $("[data-" + key + "span]", $("#" + formType + "_dynamicForm,#" + formType)).text(convertEmpty(jsonData[key]));
                        }
                        mappingFormData(jsonData, $(this).attr("id"));
                    });
                }
            }
        });
    },
    /** 保存随访记录单 */
    saveRecord : function() {
        var record = $("#recordBasicForm").serializeJson();
        var details = [];
        var errorMap = {};
        $("#tableBody form").each(function() {
            var recordData = $(this).serializeJson();
            recordData.values = dfr_obj.getSaveNodes($(this).attr("data-dynamicform"), errorMap);
            details.push(recordData);
        });
        if (!isEmptyObject(errorMap)) {
            var errors = [];
            for ( var key in errorMap) {
                errors.push(errorMap[key]);
            }
            showSystemDialog(errors);
            return false;
        }
        record.details = details;
        $.ajax({
            url : ctx + "/fuRecord/saveRecord.shtml",
            contentType : 'application/json;charset=utf-8',
            data : JSON.stringify(record),
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {
                if (data.status == "1") {
                    showTips();
                    record_obj.cancel();
                } else if (data.status == "2") {
                    showWarn("数据已被他人修改，请重新打开页面");
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
