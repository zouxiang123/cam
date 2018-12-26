var laydate = null;
var isShow = true; // 是否展示echart详情
var pieData;
var pieTitle;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        ckd_patient_filter_report.init();
    });
    // 表格高度
    $(".static-head-er1 ul li").click(function(event) {
        /* Act on the event */
        $(this).addClass('active');
        $(this).siblings().removeClass('active');
        if ($(this).text() == "筛选病患分类") {
            $("#page1").show();
            $("#page2").hide();
            $("#outComeListQuery").hide();
            $("#reportListQuery").show();
        } else if ($(this).text() == "转入统计") {
            $("#page2").show();
            $("#page1").hide();
            $("#outComeListQuery").show();
            $("#reportListQuery").hide();
            ckd_patient_filter_report.listOutCome();
        }
    });

});

var ckd_patient_filter_report = {
    /**
     * 初始化页面
     */
    init : function() {
        // 初始化日期
        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        var year = date.pattern("yyyy");
        date.setMonth(date.getMonth() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("input[name='startDateStr']").val(startDate)
        $("input[name='endDateStr']").val(endDate);
        $("input[name='yearStr']").val(year);
        laydate.render({
            elem : "#startDateStr",
            value : startDate,
            theme : '#31AAFF',
            btns : [ "now", "confirm" ]
        });
        laydate.render({
            elem : "#endDateStr",
            value : endDate,
            theme : '#31AAFF',
            btns : [ "now", "confirm" ]
        });
        laydate.render({
            elem : "#yearStr",
            value : year,
            theme : '#31AAFF',
            btns : [ "now", "confirm" ],
            format : "yyyy"
        });
        // 初始化疾病名称下拉
        $.ajax({
            url : ctx + "/ckdPatientFilter/listDisgnosisName.shtml",
            data : "",
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var html = '<select class="w-100-imp" id="disgnosisName">';
                    html += '<option value=""></option>';
                    var items = result.rs;
                    if (items != null) {
                        for (var i = 0; i < items.length; i++) {
                            html += '<option value="' + items[i].disgnosisName + '">' + items[i].disgnosisName + '</option>';
                        }
                    }
                    html += '</select>';
                    $("#select_disgnosis").html(html);
                }
            }
        })
        ckd_patient_filter_report.addEvents();
        ckd_patient_filter_report.listReport();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $("#queryInfo").on("click", function() {
            var code = $(".static-head-er1 .active").attr("data-code");
            if (code == "1") {// 筛选病患分类
                ckd_patient_filter_report.listReport();
            } else if (code == "2") {// 转入统计
                ckd_patient_filter_report.listOutCome();
            }
        });

        // 报表下载
        $("#download").on("click", function() {
            var code = $(".static-head-er1 .active").attr("data-code");
            var startDateStr = $("#startDateStr").val();
            var endDateStr = $("#endDateStr").val();
            var data = "startDateStr=" + startDateStr + "&endDateStr=" + endDateStr;
            if (code == "1") {// 筛选病患分类统计下载
                window.location.href = ctx + "/ckdPatientFilter/reportListDownload.shtml?" + encodeURI(data);
            } else if (code == "2") {// 转入统计下载
                var disgnosisName = $("#disgnosisName").val();
                var yearStr = $("#yearStr").val();
                var date = new Date(yearStr);
                var startDateStr = date.pattern("yyyy-MM-dd");
                date.setFullYear(date.getFullYear() + 1);
                var endDateStr = date.pattern("yyyy-MM-dd");
                var data = "disgnosisName=" + disgnosisName + "&startDateStr=" + startDateStr + "&endDateStr=" + endDateStr;
                window.location.href = ctx + "/ckdPatientFilter/downLoadOutComeList.shtml?" + encodeURI(data);
            }
        });

        $("#showData").change(function() {
            if ($(this).is(':checked')) {
                isShow = true;
                ckd_patient_filter_report.setReportListOption(isShow, pieData, pieTitle);
            } else {
                isShow = false;
                ckd_patient_filter_report.setReportListOption(isShow, pieData, pieTitle);
            }
        });
    },
    /**
     * 筛选病患分类统计
     */
    listReport : function() {
        var startDateStr = $("#startDateStr").val();
        var endDateStr = $("#endDateStr").val();
        var param = {
            startDateStr : startDateStr,
            endDateStr : endDateStr
        };
        $.ajax({
            url : ctx + "/ckdPatientFilter/listReport.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var xData = [];
                    var serieData = [];
                    var html = "";
                    pieTitle = new Array();
                    pieData = new Array();
                    if (items != null) {
                        var total = items.length;
                        for (var i = 0; i < total; i++) {
                            var item = items[i];
                            html += '<tr>';
                            html += '  <td class="xt-5">' + item.disgnosisName + '</td>';
                            html += '  <td>' + item.count + '</td>';
                            html += '  <td class="xt-5">' + item.countPer + '%</td>';
                            html += '</tr>';
                            pieTitle.push(item.disgnosisName);
                            pieData.push(item.countPer);
                        }
                    }
                    $("#report_list").html(html);
                    ckd_patient_filter_report.setReportListOption(true, pieData, pieData);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });
    },
    setReportListOption : function(isShow, pieData, pieTitle) {
        var chart = echarts.init(document.getElementById('qualitybar'));
        var option = {
            tooltip : {
                trigger : 'item',
                formatter : "{b} : {c}人 ({d}%)"
            },
            toolbox : {
                show : true,
                feature : {
                    saveAsImage : {
                        show : true,
                        title : "保存为图片"
                    }
                }
            },
            legend : {
                orient : 'vertical',
                x : '65%',
                y : 'center',
                data : pieTitle
            },
            calculable : false,
            series : [ {
                name : '筛选病患分类统计',
                type : 'pie',
                radius : '55%',
                center : [ '38%', '50%' ],
                data : pieData,
                itemStyle : {
                    normal : {
                        label : {
                            show : isShow,
                            formatter : '{b} : {c}人 ({d}%)'
                        },
                        labelLine : {
                            show : isShow
                        }
                    }
                }
            } ]
        };
        chart.setOption(option);
    },
    /**
     * 转入统计统计
     */
    listOutCome : function() {
        var yearStr = $("#yearStr").val();
        var date = new Date(yearStr);
        var startDateStr = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() + 1);
        var endDateStr = date.pattern("yyyy-MM-dd");
        var disgnosisName = $("#disgnosisName").val();
        var param = {
            startDateStr : startDateStr,
            endDateStr : endDateStr,
            disgnosisName : disgnosisName
        };
        // 列表
        $.ajax({
            url : ctx + "/ckdPatientFilter/listReport.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var html = "";
                    if (items != null) {
                        var total = items.length;
                        for (var i = 0; i < total; i++) {
                            var item = items[i];
                            html += '<tr>';
                            html += '  <td class="xt-4">' + item.disgnosisName + '</td>';
                            html += '  <td class="xt-4">' + item.count + '</td>';
                            html += '  <td class="xt-4">' + item.attentionCount + '</td>';
                            html += '  <td class="xt-4">' + item.outComeCount + '</td>';
                            html += '  <td>' + item.outComeCountPer + '%</td>';
                            html += '</tr>';
                        }
                    }
                    $("#outComeList").html(html);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });
        // 折现图
        param = {
            yearStr : yearStr,
            disgnosisName : disgnosisName
        };
        $.ajax({
            url : ctx + "/ckdPatientFilter/listOutCome.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var xData = [];
                    var serieData = [];
                    var serieData1 = [];
                    var serieData2 = [];
                    if (items != null) {
                        var total = items.length;
                        for (var i = 0; i < total; i++) {
                            var item = items[i];
                            xData[i] = item.yearMonth;
                            serieData[i] = item.count;
                            serieData1[i] = item.attentionCount;
                            serieData2[i] = item.outComeCount;
                        }
                    }

                    var chart = echarts.init(document.getElementById('qualitybar1'));
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ '筛查人数', '关注人数', '转入人数' ]
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
                            name : '筛查人数',
                            type : 'line',
                            data : serieData
                        }, {
                            name : '关注人数',
                            type : 'line',
                            data : serieData1
                        }, {
                            name : '转入人数',
                            type : 'line',
                            data : serieData2
                        } ]
                    };
                    chart.setOption(option);
                } else {
                    showWarn(result.errmsg);
                }
            }
        });

    }
};