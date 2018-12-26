$(function() {
    assay_hist_report.init();
});
var assay_hist_report = {
    itemCode : "",
    itemName : "",
    itemUnit : "",
    patientId : "",
    /**
     * 初始化dialog
     */
    init : function() {
        this.addEvents();
    },
    /**
     * 注册事件
     */
    addEvents : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#assayHistReportDialog").find("[name='startDate'],[name='endDate']").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    done : function(value) {
                        $("#assayHistReportSearch").find(":radio").prop("checked", false);
                    }
                });
            });
        });
        // 初始化选中事件
        $("#assayHistReportSearch").on("change", ":radio", function() {
            var val = $(this).val();
            var startDate = new Date();
            if ("w" == val) {// 周
                startDate.setDate(startDate.getDate() - 7);
            } else if ("m" == val) {// 月
                startDate.setMonth(startDate.getMonth() - 1);
                startDate.setDate(startDate.getDate() + 1);
            } else if ("y" == val) {// 年
                startDate.setFullYear(startDate.getFullYear() - 1);
                startDate.setDate(startDate.getDate() + 1);
            }
            $("#assayHistReportSearch").find("[name='startDate']").val(startDate.pattern("yyyy-MM-dd"));
            $("#assayHistReportSearch").find("[name='endDate']").val(new Date().pattern("yyyy-MM-dd"));
        });

        // 注册检验结果中是否显示统计数据
        $("#assayHistChartShownum").change(function() {
            assay_hist_report.getData();
        });
    },
    /**
     * 显示histDialog
     * 
     * @param patientId
     * @param itemCode
     * @param name
     * @param unit
     * @param isshow
     */
    show : function(patientId, itemCode, name, unit) {
        this.patientId = patientId;
        this.itemCode = itemCode;
        this.itemName = name;
        this.itemUnit = unit;
        $("#assayHistDialogTitle").text(name + "历史数据");
        // 默认选中一年
        $("#assayHistReportSearch").find(":radio[value='y']").prop("checked", true);
        $("#assayHistReportSearch").find(":radio[value='y']").change();
        // 默认显示数字
        $("#assayHistChartShownum").prop("checked", true);
        popDialog("#assayHistReportDialog", function() {
            assay_hist_report.getData();
        });
    },
    /**
     * 获取数据
     */
    getData : function() {
        var s = $("#assayHistReportSearch").find("[name='startDate']").val();
        var e = $("#assayHistReportSearch").find("[name='endDate']").val();
        $.ajax({
            url : ctx + "/assay/patientAssayRecord/getAssayReport.shtml?tt=" + (new Date()).getTime(),
            type : "post",
            data : {
                patientId : assay_hist_report.patientId,
                startDateStr : s,
                endDateStr : e,
                itemCode : assay_hist_report.itemCode,
            },
            dataType : "json",
            loading : true,
            success : function(data) {
                assay_hist_report.setReportData(data);
            }
        });
    },
    /**
     * 查询数据
     */
    search : function() {
        this.getData();
        hiddenMe("#assayHistReportSearch");
    },
    /**
     * 显示报表数据
     */
    setReportData : function(chartData) {
        if (isEmpty(chartData))
            return;
        var assayName = this.itemName;
        var assayUnit = this.itemUnit;
        var patientIndexChart = echarts.init(document.getElementById('assayHistReportChart'));
        var xAxis_data = new Array();
        var legend_data = new Array();
        var series = new Array();
        var formatter = function(params, ticket, callback) {
            var res = params[0].name;
            for (var i = 0, l = params.length; i < l; i++) {
                res += '<br/>' + params[i].seriesName + ' : ' + params[i].value;
            }
            return res;
        };
        // "{b}<br/>{a}:{c}";
        legend_data.push(assayName);
        var seriesWeightData = new Array();
        var assayHistoryHtml = '';
        for (var i = 0; i < chartData.length; i++) {
            var item = chartData[chartData.length - i - 1];// 列表数据根据时间倒序
            var unitem = chartData[i];
            seriesWeightData.push(unitem.value);
            xAxis_data.push((new Date(unitem.time)).pattern("yyyy/MM/dd"));
            assayHistoryHtml += "<tr><td>" + (new Date(item.time)).pattern("yyyy/MM/dd") + "</td>";
            assayHistoryHtml += "<td>" + item.value + "</td></tr>";
        }
        $("#assayHistTable").html(assayHistoryHtml);
        var series_data = {
            name : assayName,
            type : 'line',
            smooth : true,
            itemStyle : {
                normal : {
                    label : {
                        show : $("#assayHistChartShownum").is(":checked"),
                        formatter : '{c}'
                    }
                }
            },
            data : seriesWeightData
        };
        series.push(series_data);
        var option = {
            tooltip : {
                trigger : 'axis',
                formatter : formatter
            },
            legend : {
                data : legend_data,
                top : '-4%'
            },
            grid : {
                left : '10%',
                right : '10%',
                top : '20%',
                containLabel : true
            },
            toolbox : {
                show : true,
                feature : {
                    saveAsImage : {
                        show : true,
                        title : "保存图表为图片"
                    }
                }
            },
            xAxis : [ {
                type : 'category',
                splitLine : {
                    show : false
                },
                boundaryGap : false,
                data : xAxis_data
            } ],
            yAxis : [ {
                boundaryGap : [ 0, 1 ],
                type : 'value',
                max : Math.ceil(Math.max.apply(null, seriesWeightData)),
                min : Math.floor(Math.min.apply(null, seriesWeightData) == Math.max.apply(null, seriesWeightData) ? 0 : Math.min.apply(null,
                                seriesWeightData)),
                axisLabel : {
                    formatter : function(value, index) {
                        return value.toFixed(2);
                    }
                }
            } ],
            series : series
        };
        patientIndexChart.setOption(option);
    }
};
