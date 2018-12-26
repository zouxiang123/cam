var isshow = true;
var mydata;
$(function() {
    setReportDatePick($("#reportDateDiv"), {
        dateInputName : "reportDate",
        dateType : 'single',
        defaultValue : new Date().getFullYear(),
        dateFormat : 'yyyy',
        patientTemp : true,
        callback : function(d) {
            $("#reportDateDiv").data("reportDate", d);
            countHistoryByDateType();
        }
    });
    addEvents();

    $("#shownum").change(function() {
        if ($(this).is(':checked')) {
            isshow = true;
            setChartOption(mydata, isshow);
        } else {
            isshow = false;
            setChartOption(mydata, isshow);
        }
    });
});

// 关闭提示框
function closetip(ev) {
    $(ev).hide();
}

function addEvents() {
    $("#download").click(function() {
        var data = "year=" + $("#reportDate").val();
        var month = $("#download").data("month") || '';
        var type = $("#download").data("type") || '';
        data += "&month=" + month + "&type=" + type;
        data += getPatientTempValue();
        window.location.href = ctx + "/report/outcome/download.shtml?" + encodeURI(data);
    });
}

function countHistoryByDateType() {
    // 关闭所有的tabs
    $(".u-tabs .u-tab.hand").each(function() {
        tab_nav.removeActiveTab($(this));
    });
    $("#dateTitle [data-targettab='year'] span").html("年度报表(" + $("#reportDate").val() + ")");
    $.ajax({
        url : ctx + "/report/outcome/getReportData.shtml",
        type : "post",
        data : "year=" + $("#reportDate").val() + getPatientTempValue(),
        dataType : "json",
        success : function(data) {
            setChartOption(data, isshow);
            mydata = data;
            getTableHtml(data);
        }
    });
}
/** 获取年度报表tab数据 */
function getTableHtml(data) {
    var tableHtml = "";
    if (data.status == 1) {
        var cols = data.cols;
        var rows = data.rows;
        tableHtml = '<table class="u-table u-table-bordered">';
        var theadHtml = '<thead>';
        theadHtml += "<tr>";
        theadHtml += '<th style="width: 13%">' + cols[0] + '</th>';
        for ( var t in rows) {
            theadHtml += '<th style="width: 13%">' + rows[t][0].colValue + '</th>';
        }
        theadHtml += "</tr>";
        theadHtml += '</thead>';
        tableHtml += theadHtml;
        var tbodyHtml = '<tbody>';
        for (var i = 1; i < data.colCodes.length; i++) {
            tbodyHtml += '<tr data-month="' + data.colCodes[i] + '">';
            // 月份列;
            if (data.colCodes[i] == 'total') {// 合计
                tbodyHtml += '<td>' + cols[i] + '</td>';
            } else {// 月份
                tbodyHtml += '<td><a href="javascript:;" onclick="showOutComeDetailTab(\'' + data.colCodes[i] + '\', \'' + cols[i]
                                + '\')" data-targettab="' + data.colCodes[i] + '" data-month="' + data.colCodes[i]
                                + '"><button type="button" class="u-btn-text u-btn-blue importantdata" text="">' + cols[i] + '</button></a></td>';
            }
            for ( var t in rows) {
                var row = rows[t];
                var colValue = "0";// 默认显示0
                for (var n = 0; n < row.length; n++) {
                    var item = row[n];
                    if (item.itemCode == data.colCodes[i]) {
                        colValue = item.colValue;
                        break;
                    }
                }
                if ("total" == data.colCodes[i] && "total" != t) {// 是汇总行，但不是汇总列
                    if (!isEmpty(colValue) && colValue > 0) {
                        var total = rows["total"][rows["total"].length - 1].colValue;
                        colValue = colValue + "（" + (parseFloat(colValue / total * 100).toFixed(2)) + "%）";
                    }
                }
                var tdData = "";
                if ("total" != t)// 不是汇总列
                    tdData = 'data-name="' + rows[t][0].colValue + '" data-count="' + colValue + '"';
                var colCode = data.colCodes[i] == 'total' ? $("#reportDate").val() : data.colCodes[i];
                if (rows[t][0].colValue == '总计') {
                    tbodyHtml += '<td ' + tdData + '>' + colValue + '</td>';
                } else {
                    if (!isEmpty(colValue) && colValue != "0") {
                        tbodyHtml += '<td ' + tdData + '><a href="javascript:;" onclick="showOutComeDetailTab(\'' + colCode + '\', \'' + cols[i]
                                        + '\', \'' + rows[t][0].colValue + '\')" data-targettab="' + colCode + '" data-month="' + colCode
                                        + '" data-type="' + rows[t][0].colValue
                                        + '"><button type="button" class="u-btn-text u-btn-blue importantdata" text="">' + colValue
                                        + '</button></a></td>';
                    } else {
                        tbodyHtml += '<td ' + tdData + '>' + colValue + '</td>';
                    }
                }
            }
            tbodyHtml += '</tr>';
        }
        tbodyHtml += '</tbody>';
        tableHtml += tbodyHtml;
        tableHtml += '</table>';
    }
    $("#tableDiv").html(tableHtml);
}

function setChartOption(data, isshow) {
    var myChart = echarts.init(document.getElementById('chart1'),parent.statementSkin);
    var xAxis_data = new Array();// x轴数据
    var legend_data = new Array();
    var series = new Array();
    var formatter = function(params, ticket, callback) {
        var res = params[0].name;
        for (var i = 0, l = params.length; i < l; i++) {
            res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
        }
        return res;
    };
    var rows = data.rows;
    for ( var t in rows) {
        if (t == "total")
            continue;
        var row = rows[t];
        var series_data = {
            type : 'bar',
            stack : '总量',
            smooth : true,
            areaStyle : {
                normal : {}
            },
            itemStyle : {
                normal : {
                    label : {
                        show : isshow,
                        formatter : '{c}',
                        position : 'inside',
                    // color:'#31aaff',
                    }
                }
            },
        };
        var seriesData = [];// series数据集
        for (var i = 0; i < data.colCodes.length - 1; i++) {
            var colValue = 0;
            for (var n = 0; n < row.length; n++) {
                var item = row[n];
                if (item.itemCode == data.colCodes[i]) {
                    colValue = item.colValue;
                }
            }
            if (data.colCodes[i] == "typeCol") {
                legend_data.push(colValue);
                series_data.name = colValue;
            } else {
                seriesData.push(colValue);
            }
        }
        series_data.data = seriesData;
        series.push(series_data);
    }
    for (var i = 1; i < data.colCodes.length - 1; i++) {
        xAxis_data.push(data.colCodes[i]);
    }
    var option = {
        tooltip : {
            trigger : 'axis',
            formatter : formatter
        },
        toolbox : {
            show : true,
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存图表为图片"
                },
                restore : {
                    show : true,
                    title : "还原"
                },
                magicType : {
                    show : true,
                    type : [ 'line', 'bar' ],
                    title : {
                        line : "切换为折线图",
                        bar : "切换为柱状图"
                    }
                },
            },
            top:'5%',
            right:'2%'
        },
        grid: {
            top: '20%',
            bottom: '19%',
            left : '10%',
            right : '10%',
        },
        legend : {
            data : legend_data,
            top:'5%'
        },
        calculable : false,
        xAxis : [ {
            type : 'category',
            splitLine : {
                show : false
            },
            data : xAxis_data
        } ],
        yAxis : [ {
            type : 'value'
        } ],
        series : series
    };
    myChart.setOption(option);
}// setPieOption

// /////////////////////////////////// 点击月份和对应的转归查看转归明细 ///////////////////////////////////////////
/**
 * 显示对应的Tab统计
 * 
 * @param targettab
 * @param month
 * @param type
 */
function showOutComeDetailTab(targettab, month, type) {
    $("#reportDate").parent().hide();
    if (!type)
        type = '';
    var url = ctx + "/report/outcome/detailView.shtml";
    if (month == '合计' && type) { // 某种转归类型的合计统计
        url += "?year=" + $("#reportDate").val() + "&type=" + type
    } else if (!type) { // type不存在，则表示月统计
        url += "?year=" + $("#reportDate").val() + "&month=" + targettab;
    } else { // 某月的某转归类型的统计
        url += "?year=" + $("#reportDate").val() + "&month=" + targettab + "&type=" + type;
    }
    url += getPatientTempValue() + "&noStack=1";
    var tabId = targettab + '_' + type;
    var param = {
        id : tabId,
        name : targettab + type + '转归',
        url : url,
        refresh : "0"
    }
    if ($("#tabsDiv [data-target='" + tabId + "']").length > 0) {
        tab_nav.addTab(param);
        showOutComeData(false);
    } else {
        var tabsWidth = 180;
        $(".tab-header .u-tabs > .u-tab").each(function() {
            tabsWidth += $(this).outerWidth();
        });
        if (tabsMaxWidth - tabsWidth < 0) {
            showWarn("您打开的页面过多");
            return;
        }
        $(".tab-header .u-tabs").width(tabsWidth);
        tab_nav.addTab(param);
        showOutComeData(false);
    }
    $(".u-tab.hand.active").data("year", $("#reportDate").val());
    $(".u-tab.hand.active").data("month", targettab);
    $(".u-tab.hand.active").data("type", type);
    if (month == '合计' && type) { // 某种转归类型的合计统计
        $("#download").data("year", $("#reportDate").val());
        $("#download").removeData("month");
        $("#download").data("type", type);
    } else if (!type) { // type不存在，则表示月统计
        $("#download").data("year", $("#reportDate").val());
        $("#download").data("month", targettab);
        $("#download").removeData("type");
    } else { // 某月的某转归类型的统计
        $("#download").data("year", $("#reportDate").val());
        $("#download").data("month", targettab);
        $("#download").data("type", type);
    }
    $(".tab-header .tab-title").css("cursor", "pointer");
    var height = $(window).height() - ($("#tabsBodyDiv").offset().top + 10);
    $("iframe").height(height);
}

function reLayoutTabsWidth() {
    var tabsWidth = 0;
    $(".tab-header .u-tabs > .u-tab").each(function() {
        tabsWidth += $(this).outerWidth();
    });
    $(".tab-header .u-tabs").width(tabsWidth);
    if (tabsWidth == 0) {
        showOutComeData(true);
    }
}

function showOutComeData(open) {
    if (open) {
        $("#tablesetting").show();
        $("#tip").show();

        $('#outComeDiv').show();
        $('#tabsBodyDiv').hide();
        $("#reportDate").parent().show();
        if ($("#tabsDiv [data-url].active").length > 0) {
            $("#tabsDiv [data-url].active").removeClass("active");
        }
        $("#download").removeData("year");
        $("#download").removeData("month");
        $("#download").removeData("type");

        $("#home").addClass("myactive");
        // showOpenShow();
    } else {
        $("#tablesetting").hide();
        $("#tip").hide();

        $("#home").removeClass("myactive");
        $('#outComeDiv').hide();
        $('#tabsBodyDiv').show();
        $("#reportDate").parent().hide();
        var activeTab = $(".u-tab.hand.active");
        if (activeTab.data("year")) {
            $("#download").data("year", activeTab.data("year"));
            $("#download").data("month", activeTab.data("month"));
            $("#download").data("type", activeTab.data("type"));
        }
        // hideOpenShow();
    }
}
