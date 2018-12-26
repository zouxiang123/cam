var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        nu_list.init();
    });
});

var nu_list = {
    patientId : null,
    patientName : null,
    /**
     * 初始化页面
     */
    init : function() {
        this.patientId = $("#patientId").val();
        this.patientName = $("#patientName").val();
        body_measure.init();
        assessment.init();
        food_record.init();
        this.addEvents();
        // 默认显示第一页
        $("#nuTypeDiv").find("[data-type]:not('.hide'):first").click();
    },
    /**
     * 时间注册
     */
    addEvents : function() {
        $("#nuTypeDiv").on("click", "[data-type]", function() {
            $(".nutrition,.nutrition-action").addClass("hide");
            $(this).addClass("u-btn-blue").siblings().removeClass("u-btn-blue");
            var type = $(this).data("type");
            if (type == "body_measure") {// 人体测量
                body_measure.show();
            } else if (type == "assessment") {
                assessment.show();
            } else if (type == "food_record") {
                food_record.show();
            }
        });
    },
    /**
     * 处理num
     */
    handNum : function(num) {
        return isEmpty(num) ? "" : Number(num);
    }
};
/**
 * 人体测量
 */
var body_measure = {
    cacheCol : "",
    cacheName : "",
    init : function() {
        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#body_measure_queryDiv").find('[datepicker]').each(function() {
            laydate.render({
                elem : this,
                value : $(this).attr("name") == "startDateStr" ? startDate : endDate,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });
        $("#body_measure_hisDialog").find('[datepicker]').each(function() {
            laydate.render({
                elem : this,
                value : $(this).attr("name") == "startDateStr" ? startDate : endDate,
                theme : '#31AAFF',
                done : function() {
                    body_measure.showColDialog();
                },
                btns : [ "now", "confirm" ]
            });
        });
        this.addEvents();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 人体测量col点击事件
        $("#body_measure_tbody").on("click", "button[data-col]", function() {
            body_measure.showColDialog($(this).data("col"), $(this).data("name"), true);
        });
    },
    /**
     * 显示人体测量列表
     */
    show : function() {
        $("#body_measure_div,#body_measure_queryDiv").removeClass("hide");
        this.getList();
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        var isMan = $("#patientSex").val() == "M";
        this.getData("body_measure_queryDiv",
                        function(items) {
                            var html = "";
                            for (var i = 0; i < items.length; i++) {
                                var item = items[i];
                                var bmiTips = "";
                                // BMI在18.5-24.9时属正常范围，大于25为超重，大于30为肥胖
                                if (item.bmi < 18.5) {
                                    bmiTips = '<span class="icon-down fc-red u-float-r mt-4"></span>';
                                } else if (item.bmi >= 25) {
                                    bmiTips = '<span class="icon-upward fc-red u-float-r mt-4"></span>';
                                }
                                var whrTips = '';
                                // whr正常男性>=0.85，女性>=0.80位腹型肥胖
                                if ((isMan && (Number(item.whr) / 100) >= 0.85) || (!isMan && (Number(item.whr) / 100) >= 0.8)) {
                                    whrTips = '<span class="icon-upward fc-red u-float-r mt-4"></span>';
                                }

                                html += '<tr>';
                                html += '<td class="xtt-12">' + new Date(item.recordDate).pattern("yyyy/MM/dd") + '</td>';
                                html += '<td class="xtt-8">';
                                html += '  <button type="button" class="u-btn-blue" data-col="stature" data-name="身高" text>'
                                                + nu_list.handNum(item.stature) + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-8">';
                                html += '  <button type="button" class="u-btn-blue" data-col="weight" data-name="体重" text>'
                                                + nu_list.handNum(item.weight) + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-8">';
                                html += '  <button type="button" class="u-btn-blue" data-col="bmi" data-name="BMI" text>' + nu_list.handNum(item.bmi)
                                                + '</button>' + bmiTips;
                                html += '</td>';
                                html += '<td class="xtt-8">';
                                html += '  <button type="button" class="u-btn-blue" data-col="bsa" data-name="BSA" text>' + nu_list.handNum(item.bsa)
                                                + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-10">';
                                html += '<button type="button" class="u-btn-blue" data-col="mac" data-name="上臀围" text>' + nu_list.handNum(item.mac)
                                                + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-20">';
                                html += '<button type="button" class="u-btn-blue" data-col="tsf" data-name="三头肌皮褶厚度" text>'
                                                + nu_list.handNum(item.tsf) + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-13">';
                                html += '<button type="button" class="u-btn-blue" data-col="mamc" data-name="上臂肌围" text>'
                                                + nu_list.handNum(item.mamc) + '</button>';
                                html += '</td>';
                                html += '<td class="xtt-10">';
                                html += '<button type="button" class="u-btn-blue" data-col="whr" data-name="腰臀比" text>' + nu_list.handNum(item.whr)
                                                + '</button>' + whrTips;
                                html += '</td>';
                                html += '<td class="xtt-10">';
                                html += '  <button type="button" class="u-btn-red" onclick="body_measure.del(' + item.id + ')" text>删除</button>';
                                if (hasPermission("CM_nu_body_measure_edit")) {
                                    html += '  <button type="button" class="u-btn-blue" onclick="body_measure.edit(' + item.id
                                                    + ')" text>编辑</button>';
                                }
                                html += '</td>';
                                html += '</tr>';
                            }
                            $("#body_measure_tbody").html(html);
                        });
    },
    /**
     * 显示列弹框dialog
     */
    showColDialog : function(col, name, isShow) {
        if (!isEmpty(col)) {
            this.cacheCol = col;
        } else {
            col = this.cacheCol;
        }
        if (!isEmpty(name)) {
            this.cacheName = name;
        } else {
            name = this.cacheName;
        }
        $("#body_measure_hisDialog").find("[data-title]").text(name);
        this.getData("body_measure_hisDialog", function(items) {
            var fun = function() {
                var xData = [];
                var seriesData = [];
                for (var i = items.length - 1; i >= 0; i--) {
                    var item = items[i];
                    xData.push(new Date(item.recordDate).pattern("yyyy-MM-dd"));
                    var num = nu_list.handNum(item[col]);
                    seriesData.push(isEmpty(num) ? 0 : num);
                }
                var chart = echarts.init(document.getElementById('body_measure_hisDialogChart'), '1');
                var option = {
                    tooltip : {
                        trigger : 'axis',
                        axisPointer : {
                            type : 'cross',
                            label : {
                                backgroundColor : '#6a7985'
                            }
                        }
                    },
                    grid : {
                        left : '3%',
                        right : '8%',
                        bottom : '10px',
                        top : '30px',
                        containLabel : true
                    },
                    xAxis : [ {
                        type : 'category',
                        boundaryGap : false,
                        data : xData
                    } ],
                    yAxis : [ {
                        type : 'value',
                    } ],
                    series : [ {
                        name : name,
                        type : 'line',
                        stack : '总量',
                        areaStyle : {
                            normal : {}
                        },
                        data : seriesData
                    } ]
                };
                chart.setOption(option);
            };
            if (isShow) {// 如果是显示弹框
                popDialog("#body_measure_hisDialog", fun());
            } else {
                fun();
            }
        });
    },
    /**
     * 获取数据
     * 
     * @param divId
     * @param callback
     */
    getData : function(divId, callback) {
        var startDate = $("#" + divId).find("input[name='startDateStr']").val();
        var endDate = $("#" + divId).find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : nu_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate
        };
        $.ajax({
            url : ctx + "/nuBodyMeasure/getList.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    callback(result.rs);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });
    },
    /**
     * 编辑页面
     * 
     * @param id
     */
    edit : function(id) {
        var param = $.param({
            patientId : nu_list.patientId,
            id : convertEmpty(id)
        });
        var url = ctx + "/nuBodyMeasure/edit.shtml?" + param;
        showIframeDialog({
            title1 : "患者：" + nu_list.patientName,
            title : (isEmpty(id) ? "新增" : "编辑") + "人体测量数据",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.body_measure_edit.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    body_measure.getList();
                });
            }
        });
    },
    /**
     * 删除数据
     * 
     * @param id
     */
    del : function(id) {
        showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
            $.ajax({
                url : ctx + "/nuBodyMeasure/delete.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        body_measure.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};
/**
 * 评估
 */
var assessment = {
    init : function() {
        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#assessment_queryDiv").find('[datepicker]').each(function() {
            laydate.render({
                elem : this,
                value : $(this).attr("name") == "startDateStr" ? startDate : endDate,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });

    },
    /**
     * 显示营养评估
     */
    show : function() {
        $("#assessment_div,#assessment_queryDiv").removeClass("hide");
        this.getList();
    },
    getList : function() {
        var startDate = $("#assessment_queryDiv").find("input[name='startDateStr']").val();
        var endDate = $("#assessment_queryDiv").find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : nu_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate
        };
        $.ajax({
            url : ctx + "/nuAssessment/getList.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var xData = [];
                    var serieData = [];
                    var html = "";
                    var total = items.length;
                    for (var i = 0; i < total; i++) {
                        var item = items[i];
                        var score = item.score;
                        var tips = "营养正常";
                        if (score > 7 && score < 16) {
                            tips = "轻－中度营养不良";
                        } else if (score >= 16) {
                            tips = "重度营养不良";
                        }
                        html += '<tr>';
                        html += '  <td class="xtt-12">' + item.recordDateShow + '</td>';
                        html += '  <td class="xtt-10">' + score + '' + (score >= 16 ? '<span class="icon-upward fc-red u-float-r mt-4"></span>' : '')
                                        + '</td>';
                        html += '  <td>' + tips + '</td>';
                        html += '  <td class="xtt-10">';
                        html += '  <button type="button" class="u-btn-red" onclick="assessment.del(' + item.id + ')" text>删除</button>';
                        if (hasPermission("CM_nu_assessment_edit")) {
                            html += '  <button type="button" class="u-btn-blue" onclick="assessment.edit(' + item.id + ')" text>编辑</button>';
                        }
                        html += '  </td>';
                        html += '</tr>';
                        xData[total - i - 1] = item.recordDateShow;
                        serieData[total - i - 1] = score;
                    }
                    $("#assessment_tbody").html(html);
                    var chart = echarts.init(document.getElementById('assessment_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ 'SGA' ]
                        },
                        grid : {
                            left : '3%',
                            right : '4%',
                            bottom : '5%',
                            containLabel : true
                        },
                        xAxis : {
                            type : 'category',
                            boundaryGap : false,
                            data : xData
                        },
                        yAxis : {
                            type : 'value'
                        },
                        series : [ {
                            name : 'SGA',
                            type : 'line',
                            stack : '总量',
                            data : serieData
                        } ]
                    };
                    chart.setOption(option);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });
    },
    /**
     * 编辑页面
     * 
     * @param id
     */
    edit : function(id) {
        var param = $.param({
            patientId : nu_list.patientId,
            id : convertEmpty(id)
        });
        var url = ctx + "/nuAssessment/edit.shtml?" + param;
        showIframeDialog({
            title1 : "患者：" + nu_list.patientName,
            title : (isEmpty(id) ? "新增" : "编辑") + "营养评估",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.assessment_edit.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    assessment.getList();
                });
            }
        });
    },
    /**
     * 删除数据
     * 
     * @param id
     */
    del : function(id) {
        showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
            $.ajax({
                url : ctx + "/nuAssessment/delete.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        assessment.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};
/**
 * 饮食记录
 */
var food_record = {
    init : function() {
        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#food_record_queryDiv").find('[datepicker]').each(function() {
            laydate.render({
                elem : this,
                value : $(this).attr("name") == "startDateStr" ? startDate : endDate,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });
    },
    /**
     * 显示营养评估
     */
    show : function() {
        $("#food_record_div,#food_record_queryDiv").removeClass("hide");
        this.getList();
    },
    getList : function() {
        var startDate = $("#food_record_queryDiv").find("input[name='startDateStr']").val();
        var endDate = $("#food_record_queryDiv").find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : nu_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate,
            pid : 0
        };
        $.ajax({
            url : ctx + "/nuFoodRec/getList.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var xData = [];
                    var serieDataDei = [];
                    var serieDataDpi = [];
                    var serieDataRecomDei = [];
                    var serieDataRecomDpi = [];
                    var html = "";
                    var total = items.length;
                    for (var i = 0; i < total; i++) {
                        var item = items[i];
                        xData[total - i - 1] = item.recordDateShow;
                        serieDataDei[total - i - 1] = item.deiShow;
                        serieDataDpi[total - i - 1] = item.dpiShow;
                        serieDataRecomDei[total - i - 1] = item.recomDeiShow;
                        serieDataRecomDpi[total - i - 1] = item.recomDpiShow;
                        html += '<tr>';
                        html += '  <td>' + convertEmpty(item.recordDateShow) + '</td>';
                        html += '  <td>' + convertEmpty(item.dpiShow) + '</td>';
                        html += '  <td>' + convertEmpty(item.deiShow) + '</td>';
                        html += '  <td>' + convertEmpty(item.recomDpiShow) + '</td>';
                        html += '  <td>' + convertEmpty(item.recomDeiShow) + '</td>';
                        html += '  <td>';
                        html += '    <button type="buton" text class="u-btn-red" onclick="food_record.del(' + item.id + ')">删除</button>';
                        if (hasPermission("CM_nu_food_rec_edit")) {
                            html += '    <button type="buton" text class="u-btn-blue" onclick="food_record.edit(' + item.id + ')">编辑</button>';
                        }
                        html += '  </td>';
                        html += '</tr>';
                    }
                    $("#food_record_tbody").html(html);
                    var chart = echarts.init(document.getElementById('food_record_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ '实际DEI', '实际DPI', '推荐DEI', '推荐DPI' ]
                        },
                        grid : {
                            left : '3%',
                            right : '4%',
                            bottom : '5%',
                            containLabel : true
                        },
                        xAxis : {
                            type : 'category',
                            boundaryGap : false,
                            data : xData
                        },
                        yAxis : {
                            type : 'value'
                        },
                        series : [ {
                            name : '实际DEI',
                            type : 'line',                            
                            data : serieDataDei
                        }, {
                            name : '实际DPI',
                            type : 'line',                            
                            data : serieDataDpi
                        }, {
                            name : '推荐DEI',
                            type : 'line',                            
                            data : serieDataRecomDei
                        }, {
                            name : '推荐DPI',
                            type : 'line',                           
                            data : serieDataRecomDpi
                        } ]
                    };
                    chart.setOption(option);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });
    },
    /**
     * 编辑页面
     * 
     * @param id
     */
    edit : function(id) {
        var param = $.param({
            patientId : nu_list.patientId,
            id : convertEmpty(id)
        });
        var url = ctx + "/nuFoodRec/edit.shtml?" + param;
        showIframeDialog({
            title1 : "患者：" + nu_list.patientName,
            title : (isEmpty(id) ? "新增" : "编辑") + "饮食记录",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.food_rec.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    food_record.getList();
                });
            }
        });
    },
    /**
     * 删除数据
     * 
     * @param id
     */
    del : function(id) {
        showWarn("数据删除后不能恢复，您确定要删除吗？", function() {
            $.ajax({
                url : ctx + "/nuFoodRec/delete.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        food_record.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};