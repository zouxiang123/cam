function addEvents(reportId) {
    $("#" + reportId + " #download").click(
        function() {
           if (reportId == 'person_report_assay') {
                var data = "startDate=" + $("#" + reportId + " #startDate").val() + "&endDate=" + $("#" + reportId + " #endDate").val()
                                + "&patientId=" + $("#id").val() + "&itemCode=" + $("#" + reportId + " #itemCode").val() + "&assayName="
                                + $("#" + reportId + " #itemCode").find("option:selected").text();
                window.location.href = ctx + "/patient/personReport/reportPatienAssayDownload.shtml?" + data;
           }
        });
    if (reportId == 'person_report_assay') {
        // 选中类型
        $("#" + reportId + " #groupId").change(function() {
            getAssayitem(reportId, function() {
                $("#" + reportId + " #itemCode").change();
            });
        });

        // 选中化验项
        $("#" + reportId + " #itemCode").change(function() {
            var itemCode = $(this).val();
            $("#" + reportId + " #assayTopDiv").find("div[data-itemcode]").each(function() {
                if ($(this).attr("data-itemcode") == itemCode) {
                    $(this).addClass("active");
                } else {
                    $(this).removeClass("active");
                }
            })
            personReportData(reportId);
        });

        // 选择模板
        $("#" + reportId + " #assayTopDiv").on("click", "li[data-itemcode]", function() {
            $(this).addClass("active").siblings().removeClass("active");
            var groupId = $(this).attr("data-groupid");
            var itemcode = $(this).attr("data-itemcode");
            $("#" + reportId + " #groupId").val(groupId);

            // 加载化验项列表
            getAssayitem(reportId, function() {
                // 选中列表
                $("#" + reportId + " #itemCode").val(itemcode);
                // 加载相关数据
                personReportData(reportId);
            });

        });
    } else if (reportId == 'person_report_assess') {
        // 选中化验项
        $("#" + reportId + " #assessId").change(function() {
            personReportData(reportId);
        });

    }
    $("#" + reportId + " #shownum").change(function() {
        personReportData(reportId);
    });

    $("#" + reportId + " input[type='radio']").change(function() {
        var section = $("#" + reportId + " input[type='radio']:checked").val();
        var startDate;
        if ("3m" == section) {// 3月
            startDate = moment().subtract(3, 'month').add(1, 'days');
        } else if ("6m" == section) {// 6月
            startDate = moment().subtract(6, 'month').add(1, 'days');
        } else if ("y" == section) {// 年
            startDate = moment().subtract(1, 'year').add(1, 'days');
        }
        var startPicker = $("#" + reportId + " #startDate").data("daterangepicker");
        startPicker.setStartDate(startDate);
        startPicker.setEndDate(startDate);
    });

};

/** 获取报表数据 */
function personReportData(reportId) {
    var isshow = $("#" + reportId + " #shownum").is(':checked');
     if (reportId == 'person_report_assay') {
        var ssFromSource = $("#ssFromSource").val();
        var itemCode = $("#" + reportId + " #itemCode").val();
        if (!isEmpty(ssFromSource)) {
            itemCode = $("#ssItemCode").val() + "&fromSource=" + ssFromSource;
        }
        $.ajax({
            url : ctx + "/patient/personReport/reportPatienAssay.shtml",
            type : "post",
            data : "startDate=" + $("#" + reportId + " #startDate").val() + "&endDate=" + $("#" + reportId + " #endDate").val() + "&patientId="
                            + $("#id").val() + "&itemCode=" + itemCode,
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    showChartReport(reportId, data.items, "assayChart", isshow);
                    showTableReport(reportId, data.items);
                }
            }
        });
    } 
}

/** 显示透析统计数据 */
function showTableReport(reportId, data) {
    $("#" + reportId + " #tableBody").data("items", data);
    var bodyHtml = "";
    if (reportId == 'person_report_assay') {
        var assayName = $("#" + reportId + " #itemCode").find("option:selected").text();
        var ssFromSource = $("#ssFromSource").val();
        if (!isEmpty(ssFromSource)) {
            $("#" + reportId + " #assayChart_itemName").text($("#ssItemName").val());
        } else {
            $("#" + reportId + " #assayChart_itemName").text(isEmpty(assayName) ? "化验项名称" : assayName);
        }

        for (var i = data.length - 1; i >= 0; i--) {
            var item = data[i];
            bodyHtml += "<tr >" + "<td>" + (new Date(item.time)).pattern("yyyy-MM-dd") + "</td>" + "<td >" + convertEmpty(item.value) + "</td>"
                            + "</tr>";
        }

    } 
    $("#" + reportId + " #tableBody").html(bodyHtml);
    if (reportId != "person_report_assay") {
        // 列表排序
        htmlSort(reportId, "tableBody");
    }
}

// 组装饼图数据
function showChartReport(reportId, data, elementId, isshow) {
    if (reportId == 'person_report_assay') {
        // chart报表生成
        buildAssayChart(data, elementId, reportId, isshow);
    } 
}

/**
 * 患者化验项 图
 * 
 * @param data
 * @param elementId
 */
function buildAssayChart(data, elementId, reportId, isshow) {
    var assayName = $("#" + reportId + " #itemCode").find("option:selected").text();
    var patientIndexChart = echarts.init(document.getElementById(elementId), "1");
    patientIndexChart.clear();
    if (isEmpty(data))
        return;
    patientIndexChart = echarts.init(document.getElementById(elementId));
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
    var seriesWeightData = new Array();

    // 显示化验项范围
    var itemCode = $("#" + reportId + " #itemCode").find("option:selected");
    var rangeFlag = false;
    // 图表最小值数据
    var minRangeData = new Array();
    var minRange = 0;

    // 图表最大值数据
    var maxRangeData = new Array();
    var maxRange = 0;

    // 初始化化验项范围数据
    if (itemCode) {
        minRange = $(itemCode).attr("data-minvalue");
        maxRange = $(itemCode).attr("data-maxvalue");
    }

    // 刻度最大值，最小值
    var maxVerticalCoordinate = ((isEmpty(maxRange) || maxRange == 0) ? 0 : maxRange), minVerticalCoordinate = ((isEmpty(minRange) || minRange == 0) ? 1000
                    : minRange);

    // 绑定图表数据
    for (var i = 0; i < data.length; i++) {
        var item = data[i];
        // 判断后台传入的值不为空，或者不等于0，就在页面上显示，否则不显示
        if (!isEmpty(item.value) && item.value != 0) {
            // var value = item.value || "";
            var value = item.value;
            seriesWeightData.push(value);
            xAxis_data.push((new Date(item.time)).pattern("yyyy-MM-dd"));

            // 范围计算
            if (!isEmpty(minRange) && !isEmpty(maxRange) && maxRange > 0) {
                minRangeData.push(minRange);
                maxRangeData.push(maxRange);
                rangeFlag = true;
            }

            // 计算最大值，最小值
            if (value > maxVerticalCoordinate) {
                maxVerticalCoordinate = value;
            }
            if (value < minVerticalCoordinate) {
                minVerticalCoordinate = value;
            }
        }
    }

    // 最小，最大范围操作
    if (rangeFlag) {
        var min_data = {
            name : "最小值",
            type : 'line',
            itemStyle : {
                normal : {
                    label : {
                        show : isshow,
                        position : 'top'
                    }
                }
            },
            symbolSize : 8,
            hoverAnimation : false,
            data : minRangeData
        };
        legend_data.push("最小值");
        series.push(min_data);

    }

    // 化验数据
    var series_data = {
        name : assayName,
        type : 'line',
        itemStyle : {
            normal : {
                label : {
                    show : isshow,
                    position : 'top'
                }
            }
        },
        symbolSize : 8,
        hoverAnimation : false,
        data : seriesWeightData
    };
    legend_data.push(assayName);
    series.push(series_data);

    // 最大范围操作
    if (rangeFlag) {
        var max_data = {
            name : "最大值",
            type : 'line',
            itemStyle : {
                normal : {
                    label : {
                        show : isshow,
                        position : 'top'
                    }
                }
            },
            symbolSize : 8,
            hoverAnimation : false,
            data : maxRangeData
        };

        legend_data.push("最大值");
        series.push(max_data);
    }

    // 最大值，最小值相同，图表纵坐标不能出现刻度
    maxVerticalCoordinate = Math.ceil(maxVerticalCoordinate);
    minVerticalCoordinate = Math.floor(minVerticalCoordinate);
    if (maxVerticalCoordinate == minVerticalCoordinate) {
        maxVerticalCoordinate = maxVerticalCoordinate + 1;
    }
    // 调整Y轴最小值，Y坐标最小值大于化验值，化验值不能显示在坐标上；
    if (minVerticalCoordinate >= 20) {
        minVerticalCoordinate = minVerticalCoordinate - (minVerticalCoordinate % 20);
    }

    var option = {
        tooltip : {
            trigger : 'axis',
            axisPointer : {
                animation : true
            }
        },
        legend : {
            data : legend_data,
            top : 40
        },
        toolbox : {
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存为图片"
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
                }
            },
            top : '5%',
            right : '1%'
        },
        grid : [ {
            left : '10%',
            right : '15%',
            bottom : '20%',
            top : '25%',
        } ],
        xAxis : [ {
            type : 'category',
            boundaryGap : true,
            axisLine : {
                onZero : true
            },
            data : xAxis_data
        } ],
        yAxis : [ {
            type : 'value',
            // 如果最大值和最小值刻度相同图表会出现空白，看不到图表显示,
            max : maxVerticalCoordinate,
            min : minVerticalCoordinate,
            axisLabel : {
                formatter : function(value, index) {
                    if ((typeof value === 'number') && (value % 1 === 0)) {
                        return value;
                    } else {
                        return value.toFixed(2);
                    }
                }
            }
        } ],
        series : series
    };

    patientIndexChart.setOption(option);
}







/**
 * 获取化验项数据
 * 
 * @param reportId
 *            报表ID
 * @param callback
 *            数据加载完毕后回调
 */
function getAssayitem(reportId, callback) {
    var groupId = convertEmpty($("#" + reportId + " #groupId").val());
    $("#" + reportId + " #itemCode").empty();
    $.ajax({
        url : ctx + "/assay/hospDict/getAssayList.shtml",
        type : "post",
        data : {
            groupId : groupId
        },
        dataType : "json",
        loading : true,
        success : function(data) {

            var htmlSelect = '';
            if (data.status == 1) {
                for (var i = 0; i < data.items.length; i++) {
                    var item = data.items[i];
                    htmlSelect += '<option value="' + item.itemCode + '" data-minValue="' + convertEmpty(item.personalMinValue) + '" data-maxValue="'
                                    + convertEmpty(item.personalMaxValue) + '" data-dateType="' + item.dateType + '">' + item.itemName + '</option>';
                }
            }
            $("#" + reportId + " #itemCode").html(htmlSelect);

            // 数据加载完毕后回调
            if (!isEmpty(callback)) {
                callback();
            }
        }
    });
}

// 获取置顶的化验项
function getAssayListByTop(reportId) {
    $("#" + reportId + " #assayTopDiv").empty();
    $.ajax({
        url : ctx + "/assay/hospDict/listTop.shtml",
        type : "post",
        dataType : "json",
        async : false,
        loading : true,
        success : function(data) {

            var html = '';
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<li  data-itemcode="' + item.itemCode + '" data-groupid="' + item.groupId + '">' + item.itemName + '</li>';
            }
            $("#" + reportId + " #assayTopDiv").html(html);
            if ($("#ssFromSource").length == 0) {
                // 默认选中第一个置顶项
                $("#" + reportId + " #assayTopDiv").find("[data-itemcode]:first").click();
            }
        }
    });
}

function rep(val) {
    var reg = new RegExp("-", "g");// g,表示全部替换。
    val = val.replace(reg, "");

    var reg = new RegExp("_", "g");// g,表示全部替换。
    val = val.replace(reg, "");
    return val;
}

/**
 * 表格tr排序，按照日期排序
 * 
 * @param reportId
 *            报表ID
 * @param tagId
 *            标签ID
 * @param sort
 *            排序 1 升序，-1降序
 */
function htmlSort(reportId, tagId) {
    var trs = $("#" + reportId + " #" + tagId + " tr");
    $.each(trs, function(i, obj) {
        var td = $(obj).find("td")[0];
        var date = htmlSortData(td);

        // 遍历行内容判断，调换位置
        $.each(trs, function(j, objAfter) {
            var tdAfter = $(objAfter).find("td")[0];
            var dateAfter = htmlSortData(tdAfter);
            if (date < dateAfter) {
                $(obj).insertAfter($(objAfter));
            }
        });
    });
}
/**
 * 获取单元格内容，日期转换数据
 * 
 * @param td
 *            单元格
 * @returns
 */
function htmlSortData(td) {
    var val = $(td).text();
    if (isEmpty(val)) {
        return 0;
    }
    val = val.replace("/", "").replace("/", "").replace("/", "");
    val = val.replace("-", "").replace("-", "").replace("-", "");
    return val;
}

/**
 * 图表零不展示，并且对应指定日期所有数据点都清楚掉
 * 
 * @dataPointArray 数据线数组
 * @dateArray 日期横坐标日期
 */
function echartHandlerZeroChart(dataPointArray, dateArray) {

    // 校验数据是否存在记录内容
    if (isEmpty(dataPointArray) || isEmpty(dateArray) || dataPointArray.length == 0 || dateArray.length == 0) {
        return;
    }

    // 记录为0的小标
    var recordIndex = [];

    // 处理标记 数据点为 0 的下标
    var dataPointLength = dataPointArray.length;
    for (var i = 0; i < dataPointLength; i++) {
        var dataPoint = dataPointArray[i];
        // 获取数据点值
        var datas = dataPoint.data;
        if (datas) {
            // 遍历数据内容，获取结果值为0 的下标
            for (var ii = 0; ii < datas.length; ii++) {
                var value = datas[ii];
                if (value == 0) {
                    recordIndex.push(ii);
                }
            }
        }
    }

    // 处理下标数据
    var newDataPointArray = [];
    var maxData = 0, minData = 1000;
    var maxBmi = 0, minBmi = 1000;
    for (var i = 0; i < dataPointLength; i++) {
        var dataPoint = dataPointArray[i];
        // 获取数据点值
        var datas = dataPoint.data;
        // 数据重新组合
        var newDatas = [];
        if (datas) {
            // 遍历数据内容，查找下标
            for (var ii = 0; ii < datas.length; ii++) {
                if ($.inArray(ii, recordIndex) == -1) {
                    var value = datas[ii];
                    newDatas.push(value);

                    // 重新计算最大值和最小值
                    value = parseFloat(value);
                    // 定义了一个 tempcode的属性 解决双Y轴 最大最小值计算问题
                    if (typeof dataPoint.tempCode != 'undefined' && (dataPoint.tempCode == 'pre_bmi' || dataPoint.tempCode == 'after_bmi')) {
                        if (value > maxBmi) {
                            maxBmi = value;
                        }
                        if (value < minBmi) {
                            minBmi = value;
                        }
                    } else {
                        if (value > maxData) {
                            maxData = value;
                        }
                        if (value < minData) {
                            minData = value;
                        }
                    }
                }
            }
        }
        // 重新组合数据
        dataPoint.data = newDatas;
        newDataPointArray.push(dataPoint);
    }

    // 横坐标日期判断
    var xAxis_data = [];
    for (var i = 0; i < dateArray.length; i++) {
        if ($.inArray(i, recordIndex) == -1) {
            xAxis_data.push(dateArray[i]);
        }
    }

    return {
        points : newDataPointArray,
        xAxis : xAxis_data,
        max : Math.ceil(maxData),
        min : Math.floor(minData),
        maxBmi : Math.ceil(maxBmi),
        minBmi : Math.floor(minBmi)
    }

}

/** 获取化验单类别数据 */
function getAssayCategory(reportId) {
    $("#" + reportId + " #groupId").empty();
    $.ajax({
        url : ctx + "/assay/hospDict/getAssayCategoryList.shtml",
        type : "post",
        dataType : "json",
        loading : true,
        success : function(data) {

            var htmlSelect = '';
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                htmlSelect += '<option value="' + item.groupId + '">' + item.groupName + '</option>';
            }
            $("#" + reportId + " #groupId").html(htmlSelect);
            // 获取到类别后，加载置顶项
            getAssayListByTop(reportId);
        }
    });
}
