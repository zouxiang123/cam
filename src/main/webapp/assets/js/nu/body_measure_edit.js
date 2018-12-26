var body_measure_edit = {
    init : function() {
        this.addEvents();
        this.addValidate();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 日历查询
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#bodyMeasureForm").find('input[name="recordDateShow"]').each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", "confirm" ]
                });
            });
        });
        // 计算与身高相关指标
        $("#bodyMeasureForm").on("change", "[data-calcstature]", function() {
            var form = $("#bodyMeasureForm");
            var stature = $("[name='stature']", form).val();
            var weight = $("[name='weight']", form).val();
            var checkNum = body_measure_edit.checkNum;
            var calcNodes = $(this).attr("data-calcstature");
            body_measure_edit.clearCalcData(form, calcNodes);// 清空自动计算的值
            if (isEmpty(stature) || isEmpty(weight) || !checkNum(stature, 0.01, 999) || !checkNum(weight, 0.01, 999)) {
                return;
            }
            var param = {
                patientId : $("#patientId").val(),
                stature : stature,
                weight : weight
            };
            body_measure_edit.setCalcData(param, ctx + "/nuCalc/getStature.shtml", form, calcNodes, function(rs) {
                var bmi = rs.bmi;
                var tips = "";
                if (bmi < 18.5) {
                    tips = "过轻";
                } else if (bmi >= 25 && bmi <= 30) {
                    tips = "超重";
                } else if (bmi > 30) {
                    tips = "肥胖";
                }
                $("#bmiTipsSpan").html(tips);
            });
        });
        // 计算上臂肌围数据
        $("#bodyMeasureForm").on("change", "[data-calcmamc]", function() {
            var form = $("#bodyMeasureForm");
            var tsf = $("[name='tsf']", form).val();
            var mac = $("[name='mac']", form).val();
            var checkNum = body_measure_edit.checkNum;
            var calcNodes = $(this).attr("data-calcmamc");
            body_measure_edit.clearCalcData(form, calcNodes);// 清空自动计算的值
            if (isEmpty(tsf) || isEmpty(mac) || !checkNum(tsf, 0.01, 999) || !checkNum(mac, 0.01, 999)) {
                return;
            }
            var data = {
                tsf : tsf / 10,
                mac : mac
            };
            body_measure_edit.setCalcData(data, ctx + "/nuCalc/getMamc.shtml", form, calcNodes);
        });
        // 计算腰臀比数据
        $("#bodyMeasureForm").on("change", "[data-calcwhr]", function() {
            var form = $("#bodyMeasureForm");
            var waist = $("[name='waist']", form).val();
            var hip = $("[name='hip']", form).val();
            var checkNum = body_measure_edit.checkNum;
            var calcNodes = $(this).attr("data-calcwhr");
            body_measure_edit.clearCalcData(form, calcNodes);// 清空自动计算的值
            if (isEmpty(waist) || isEmpty(hip) || !checkNum(waist, 0.01, 999) || !checkNum(hip, 0.01, 999)) {
                return;
            }
            var data = {
                waist : waist,
                hip : hip
            };
            body_measure_edit.setCalcData(data, ctx + "/nuCalc/getWHR.shtml", form, calcNodes, function(rs) {
                var whr = rs.whr / 100.00;
                var isMan = $("#patientSex").val() == "M";
                var tips = "";
                // 正常男性>=0.85，女性>=0.80位腹型肥胖
                if ((isMan && (whr >= 0.85)) || (!isMan && (whr >= 0.8))) {
                    tips = "肥胖";
                }
                $("#whrTipsSpan").html(tips);
            });
        });
    },
    /** 获取并设置自动计算的结果字段的值 */
    setCalcData : function(data, url, form, calcNodesStr, callback) {
        $.ajax({
            url : url,
            type : "post",
            data : data,
            dataType : "json",
            loading : false,
            success : function(result) {
                if (result.status == "1") {
                    var calcNodes = calcNodesStr.split(",");
                    for (var i = 0; i < calcNodes.length; i++) {
                        $("[name='" + calcNodes[i] + "']", form).val(convertEmpty(result[calcNodes[i]]));
                        $("[data-" + calcNodes[i] + "span]", form).text(convertEmpty(result[calcNodes[i]]));
                    }
                    if (!isEmpty(callback)) {
                        callback(result);
                    }
                }
            }
        });
    },
    /**
     * 清空自动计算的值
     * 
     * @param form
     * @param calcNodesStr
     */
    clearCalcData : function(form, calcNodesStr) {
        var calcNodes = calcNodesStr.split(",");
        for (var i = 0; i < calcNodes.length; i++) {
            var inputEl = $("[name='" + calcNodes[i] + "']", form);
            $("#" + inputEl.attr("aria-describedby"), form).hide();
            inputEl.val("");
            $("[data-" + calcNodes[i] + "span]", form).text("");
        }
    },
    /**
     * 保存数据
     * 
     * @param callback
     */
    save : function(callback) {
        if ($("#bodyMeasureForm").valid()) {
            $.ajax({
                url : ctx + "/nuBodyMeasure/save.shtml",
                data : $("#bodyMeasureForm").serialize(),
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("保存成功");
                        if (!isEmpty(callback)) {
                            callback();
                        }
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        }
    },
    /**
     * 校验数据是否有效
     * 
     * @param num
     * @param min
     * @param max
     */
    checkNum : function(num, min, max) {
        var flag = true;
        if (isNaN(num)) {
            return false;
        }
        if (!isEmpty(min)) {
            flag = Number(num) >= min;
        }
        if (flag && !isEmpty(max)) {
            flag = Number(max) <= max;
        }
        return flag;
    },
    addValidate : function() {
        $('#bodyMeasureForm').validate({
            // 校验字段
            rules : {
                recordDateShow : {
                    required : [ "测量日期" ]
                },
                weight : {
                    number : [ "体重" ],
                    customRange : [ 0.01, 999, "体重" ]
                },
                statureMeasureValue : {
                    number : [ "测量结果" ],
                    customRange : [ 0.01, 999, "测量结果" ]
                },
                stature : {
                    number : [ "身高" ],
                    customRange : [ 0.01, 999, "身高" ]
                },
                mac : {
                    number : [ "上臀围" ],
                    customRange : [ 0.01, 999, "上臀围" ]
                },
                tsf : {
                    number : [ "三头肌皮褶厚度" ],
                    customRange : [ 0.01, 999, "三头肌皮褶厚度" ]
                },
                waist : {
                    number : [ "腰围" ],
                    customRange : [ 0.01, 999, "腰围" ]
                },
                hip : {
                    number : [ "臀围" ],
                    customRange : [ 0.01, 999, "臀围" ]
                },
                ssf : {
                    number : [ "肩胛下皮褶厚度" ],
                    customRange : [ 0.01, 999, "肩胛下皮褶厚度" ]
                },
                asf : {
                    number : [ "腹部皮褶厚度" ],
                    customRange : [ 0.01, 999, "腹部皮褶厚度" ]
                },
                bmi : {
                    number : [ "BMI" ],
                    customRange : [ 0.01, 999, "BMI" ]
                },
                bsa : {
                    number : [ "BSA" ],
                    customRange : [ 0.01, 999, "BSA" ]
                },
                whr : {
                    number : [ "腰臀比" ],
                    customRange : [ 0.01, 99, "腰臀比" ]
                },
                mamc : {
                    number : [ "上臀肌围" ],
                    customRange : [ 0.01, 999, "上臀肌围" ]
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