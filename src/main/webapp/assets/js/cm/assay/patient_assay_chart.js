var assayName;
var assayUnit;

/** 获取数据 */
function showAssayHistoryReport(itemCode, name, unit) {
    var s = $("#reportDateDiv").data("startDate");
    var e = $("#reportDateDiv").data("endDate");
    var patientId = $("#patientId").val();
    if (!isEmpty(itemCode)) {
        $("body").data("itemCode", itemCode);
    }
    if (!isEmpty(name))
        assayName = name;
    if (!isEmpty(unit))
        assayUnit = unit;
    if (!isEmpty(itemCode)) {
        $("#assayHistoryDialog #reportDateDiv").data("reportDatePick").setReportDatePickType("y");
        return;
    }
    $.ajax({
        url : ctx + "/assay/patientAssayRecord/getAssayReport.shtml",
        type : "post",
        data : "startDateStr=" + s + "&endDateStr=" + e + "&patientId=" + patientId + "&itemCode=" + encodeURI($("body").data("itemCode")),
        dataType : "json",
        loading : true,
        success : function(data) {
            setLineOption(data);
        }
    });
}// 

function setLineOption(chartData) {
    if (isEmpty(chartData))
        return;
    var patientIndexChart = echarts.init(document.getElementById('assayHistoryChart'));
    var xAxis_data = new Array();
    var legend_data = new Array();
    var series = new Array();
    var formatter = "{b}<br/>{a}:{c}";
    legend_data.push(assayName);
    var seriesWeightData = new Array();
    for (var i = 0; i < chartData.length; i++) {
        var item = chartData[i];
        seriesWeightData.push(item.value);
        xAxis_data.push((new Date(item.time)).pattern("yyyy/MM/dd"));
    }
    var series_data = {
        name : assayName,
        type : 'line',
        smooth : true,
        itemStyle : {
            normal : {
                areaStyle : {
                    type : 'default'
                }
            }
        },
        data : seriesWeightData
    };
    series.push(series_data);

    var option1 = {
        tooltip : {
            trigger : 'axis',
            formatter : formatter
        },
        legend : {
            data : legend_data
        },
        toolbox : {
            show : false
        },
        calculable : false,
        xAxis : [ {
            type : 'category',
            boundaryGap : false,
            splitLine : {
                show : false
            },
            data : xAxis_data
        } ],
        yAxis : [ {
            boundaryGap : [ 0, 1 ],
            type : 'value'
        } ],
        series : series
    };

    patientIndexChart.setOption(option1);
}
