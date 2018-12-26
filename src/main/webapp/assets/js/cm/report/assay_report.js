var isshow1 = true;// 达标率统计
var myBarData;// 达标率统计
var isshow2 = true;// 组装均值和标准差
var myLineData;// 组装均值和标准差
var isshow3 = true;// 组装达标率饼图数据
var myPieData;// 组装达标率饼图数据
var isshow4 = true;// 组装分组达标率报表饼图
var myOkPieData;// 组装分组达标率报表饼图
var isshow5 = true;// 组装分组饼图
var myGroupPie;// 组装分组饼图
// 达标率统计
function setDbBar(barData, isshow1) {
    var dbbarChart = echarts.init(document.getElementById('dbbarChart'));
    var option = {
        title : {
            text : '月达标率统计',
            padding : 20,
            textStyle : {
                fontSize : 16,
                fontFamily : 'MicrosoftYaHei',
                fontWeight : 'normal'
            },
        },
        tooltip : {
            trigger : 'axis'
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
            top : '5%',
            right : '2%'
        },
        legend : {
            data : barData.title,
            top : '5%'
        },
        grid : {
            left : '10%',
            right : '15%',
            bottom : '5%',
            top : '30%',
            containLabel : true,
        },
        xAxis : [ {
            type : 'category',
            data : barData.xAxis
        } ],
        yAxis : [ {
            type : 'value',
            name : '数量（例）',
            axisLabel : {
                formatter : '{value}'
            }
        }, {
            type : 'value',
            name : '达标率',
            axisLabel : {
                formatter : '{value} %'
            },
            splitLine : {
                show : false
            }
        } ]
    };

    var series = [];
    for (var i = 0; i < barData.title.length; i++) {
        var item = {};
        item.name = barData.title[i];
        item.data = barData.data[i];
        if (i == barData.title.length - 1) {
            item.type = 'line';
            item.yAxisIndex = 1;
            item.itemStyle = {
                normal : {
                    label : {
                        show : isshow1,
                    }
                }
            };
        } else {
            item.type = 'bar';
            item.itemStyle = {
                normal : {
                    label : {
                        show : isshow1,
                        position : 'top'
                    }
                }
            };
        }
        series.push(item);
    }
    option.series = series;
    dbbarChart.setOption(option);
}

// 组装均值和标准差
function setAvgAndPop(lineData, isshow2) {
    var zwsLineChart = echarts.init(document.getElementById('zwsLineChart'));
    var option = {
        title : {
            text : '均值标准差统计',
            padding : 20,
            textStyle : {
                fontSize : 16,
                fontFamily : 'MicrosoftYaHei',
                fontWeight : 'normal'
            },
        },
        tooltip : {
            trigger : 'axis'
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
            top : '5%',
            right : '2%'
        },
        legend : {
            data : lineData.title,
            top : '6%'
        },
        grid : {
            left : '10%',
            right : '15%',
            bottom : '5%',
            top : '30%',
            containLabel : true,
        },
        xAxis : [ {
            type : 'category',
            data : lineData.xAxis
        } ],
        yAxis : [ {
            type : 'value',
            name : '平均值',
            axisLabel : {
                formatter : '{value} ' + lineData.yUnit
            }
        }, {
            type : 'value',
            name : '标准差',
            axisLabel : {
                formatter : '{value}'
            },
            splitLine : {
                show : false
            }
        } ],
        series : [ {
            name : lineData.title[0],
            type : 'line',
            itemStyle : {
                normal : {
                    label : {
                        show : isshow2,
                        position : 'top'
                    }
                }
            },
            data : lineData.avgData
        }, {
            name : lineData.title[1],
            type : 'line',
            yAxisIndex : 1,
            itemStyle : {
                normal : {
                    label : {
                        show : isshow2,
                        position : 'top'
                    }
                }
            },
            data : lineData.popData
        } ]
    };
    zwsLineChart.setOption(option);
}

// 组装达标率饼图数据
function setdblPie(pieData, isshow3) {
    if (isEmpty(pieData)) {
        return;
    }
    var myChart2 = echarts.init(document.getElementById('chart2'));
    var option = {
        title : {
            text : '年累计达标率统计',
            padding : 20,
            textStyle : {
                fontSize : 16,
                fontFamily : 'MicrosoftYaHei',
                fontWeight : 'normal'
            },
        },
        tooltip : {
            trigger : 'item',
            formatter : "{a} <br/>{b} : {c}例 ({d}%)"
        },
        toolbox : {
            show : true,
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存图表为图片"
                }
            },
            top : '5%',
            right : '2%'
        },
        legend : {
            orient : 'horizontal',
            x : 'center',
            data : pieData.title
        },
        calculable : false,
        series : [ {
            name : '达标率统计',
            type : 'pie',
            radius : '50%',
            center : [ '50%', '60%' ],
            data : pieData.data,
            itemStyle : {
                normal : {
                    label : {
                        show : isshow3,
                        formatter : '{b} : {c} ({d}%)'
                    },
                    labelLine : {
                        show : isshow3
                    }
                }
            }
        } ]
    };
    // 为echarts对象加载数据
    myChart2.setOption(option);
}// setdblPie

// 组装分组饼图
function setGroupPie(pieData, isshow5) {
    if (isEmpty(pieData)) {
        return;
    }
    var groupPie = echarts.init(document.getElementById('groupPie'));
    var option = {
        /*
         * title : { text : '分组统计' },
         */
        tooltip : {
            trigger : 'item',
            formatter : "{a} <br/>{b} : {c}例({d}%)"
        },
        toolbox : {
            show : true,
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存图表为图片"
                }
            },
            top : '5%',
            right : '2%'
        },
        legend : {
            orient : 'vertical',
            x : '70%',
            y : 'center',
            data : pieData.title
        },
        calculable : false,
        series : [ {
            name : '分组统计',
            type : 'pie',
            radius : '50%',
            center : [ '40%', '50%' ],
            data : pieData.data,
            itemStyle : {
                normal : {
                    label : {
                        show : isshow5,
                        formatter : '{b} : {c} ({d}%)'
                    },
                    labelLine : {
                        show : isshow5
                    }
                }
            }
        } ]
    };
    // 为echarts对象加载数据
    groupPie.setOption(option);
}// setGroupPie

// 组装分组达标率报表饼图
function setMonthSeasonOkPie(pieData, isshow4) {
    if (isEmpty(pieData)) {
        return;
    }
    var groupPie = echarts.init(document.getElementById('monthSeasonOkPie'));
    var option = {
        title : {
            text : '分组达标率',
            padding : 16,
            textStyle : {
                fontSize : 16,
                fontFamily : 'MicrosoftYaHei',
                fontWeight : 'normal'
            },
        },
        tooltip : {
            trigger : 'item',
            formatter : "{a} <br/>{b} : {c}例({d}%)"
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
        legend : {
            orient : 'vertical',
            x : '70%',
            y : 'center',
            data : pieData.title
        },
        calculable : false,
        series : [ {
            name : '分组统计',
            type : 'pie',
            radius : '50%',
            center : [ '40%', '50%' ],
            data : pieData.data,
            itemStyle : {
                normal : {
                    label : {
                        show : isshow4,
                        formatter : '{b} : {c} ({d}%)'
                    },
                    labelLine : {
                        show : isshow4
                    }
                }
            }
        } ]
    };
    // 为echarts对象加载数据
    groupPie.setOption(option);
}// setGroupPie

/** 获取报表数据 */
function getReport() {
    getReportByCondition();
}

function getRuleList() {
    $.ajax({
        url : ctx + "/report/assay/getRuleList.shtml",
        type : "post",
        loading : true,
        data : $("#selectForm").serialize(),
        dataType : "json",
        async : false,
        success : function(result) {
            var list = result.list || [];
            var html = '';
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (i > 0) {
                    html += '<span> / </span>';
                }
                html += '<div class="u-display-inlineBlock position-relative">';
                html += ' <input type="text" class="mr-8" style="width: 75px" name="ruleList[' + i + ']" value="' + item.minValue + '" readonly>';
                html += ' <i class="icon-error closeinput" style="color:#484848" data-minValue="' + item.minValue + '"></i>';
                html += '</div>';
            }
            html += '<input type="text" class="mr-8" style="width: 75px" name="ruleList[' + list.length + ']" id="addRule">';
            $("#ruleListDiv").html(html);
            // 注册删除事件
            registerRuleBtnDelEvent();
            // itemcode 变更需要加载报表数据
            if ($(document).data("itemCodeChangeNeedData")) {
                getReportByCondition();
                $(document).removeData("itemCodeChangeNeedData");
            }
        }
    });
}

// 重置分组
function resetRules() {
    $.ajax({
        url : ctx + "/report/assay/resetRules.shtml",
        type : "post",
        loading : true,
        data : $("#selectForm").serialize(),
        async : false,
        dataType : "json",
        success : function(result) {
            var list = result.list || [];
            var html = '';
            for (var i = 0; i < list.length; i++) {
                var item = list[i];
                if (i > 0) {
                    html += '  / ';
                }
                html += '<div class="u-display-inlineBlock position-relative">';
                html += ' <input type="text" class="mr-8" style="width: 75px" name="ruleList[' + i + ']" value="' + item + '" readonly>';
                html += ' <i class="icon-error closeinput" style="color:#484848" data-minValue="' + item + '"></i>';
                html += '</div>';
            }
            html += '<input type="text" class="mr-8" style="width: 75px" name="ruleList[' + list.length + ']" id="addRule">';
            $("#ruleListDiv").html(html);
            // 注册删除事件
            registerRuleBtnDelEvent();
        }
    });
}

// 查询报表数据
function getReportByCondition() {
    changeTab(0, "");
    // 没有选择化验项，不进行操作
    if (isEmpty($("#itemCode").val())) {
        return false;
    }
    $.ajax({
        url : ctx + "/report/assay/selectYearDatas.shtml",
        type : "post",
        loading : true,
        data : $("#selectForm").serialize(),
        dataType : "json",
        success : function(chartData) {
            setDbBar(chartData.bar, isshow1);
            myBarData = chartData.bar;
            setdblPie(chartData.pie, isshow3);
            myPieData = chartData.pie;
            setAvgAndPop(chartData.line, isshow2);
            myLineData = chartData.line;
            showMainTable(chartData);
        }
    });
}

/** 获取化验单类别数据 */
function getAssayCategory(callback) {
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
            $("#groupId").html(htmlSelect);
            if (!isEmpty(callback)) {
                callback();
            }
        }
    });
}

/** 获取table数据 */
function getAssayitem(selectCode) {
    var groupId = convertEmpty($("#groupId").val());
    $.ajax({
        url : ctx + "/assay/hospDict/getAssayList.shtml",
        type : "post",
        data : {
            groupId : groupId
        },
        dataType : "json",
        success : function(data) {
            var htmlSelect = '';
            if (data.status == 1) {
                for (var i = 0; i < data.items.length; i++) {
                    var item = data.items[i];
                    htmlSelect += '<option value="' + item.itemCode + '" data-minValue="' + convertEmpty(item.personalMinValue) + '" data-maxValue="'
                                    + convertEmpty(item.personalMaxValue) + '" data-dateType="' + item.dateType + '">' + item.itemName + '</option>';
                }
            }
            $("#itemCode").html(htmlSelect);
            if (!isEmpty(selectCode)) {
                $("#itemCode").val(selectCode);
            }
            $("#itemCode").change();
        }
    });
}

/** 根据检查类别获取检查项列表 */
function changeGroupId() {
    getAssayitem();
}

/** 获取置顶的化验项 */
function getAssayListByTop(callback) {
    $.ajax({
        url : ctx + "/assay/hospDict/listTop.shtml",
        type : "post",
        dataType : "json",
        loading : true,
        success : function(data) {
            var html = '';
            for (var i = 0; i < data.items.length; i++) {
                var item = data.items[i];
                html += '<span style="width:150px;display:inline-block;display:-moz-inline-box;" data-itemcode="' + item.itemCode
                                + '" data-groupid="' + item.groupId + '">' + item.itemName + '</span>';
            }
            $("#assayTopDiv").html(html);
            if (!isEmpty(callback)) {
                callback();
            }
        }
    });
}

/** table显示 */
function showMainTable(chartData) {
    var xAxis = chartData.bar.xAxis;
    var monthSeason = chartData.bar.monthSeason;
    var titles = chartData.bar.title;
    var html_thead = '<tr><th style="width: 16%">时间</th><th style="width: 12%">总数</th>';
    for (var i = 0; i < titles.length; i++) {
        if (i == titles.length - 1) {
            html_thead += '<th style="width: 12%">达标率（%）</th>';
        } else {
            html_thead += '<th style="width: 12%">' + titles[i] + '数（例）</th>';
        }
    }
    html_thead += '<th style="width: 12%">平均值</th><th style="width: 12%">标准差</th></tr>';
    $("#mainThead").html(html_thead);

    var html_tbody = '';
    var datas = chartData.bar.data;
    var avgData = chartData.line.avgData;
    var popData = chartData.line.popData;
    var countData = chartData.line.countData;

    for (var i = 0; i < xAxis.length; i++) {
        html_tbody += '<tr data-value="' + monthSeason[i] + '" data-total="' + countData[i] + '">';
        html_tbody += '<td>' + xAxis[i] + '<button type="button" class="u-btn-text u-btn-blue u-float-r" text="">详情</button></td>';
        html_tbody += '<td>' + countData[i] + '</td>';
        for (var j = 0; j < datas.length; j++) {
            html_tbody += '<td>' + datas[j][i] + '</td>';
        }
        html_tbody += '<td>' + avgData[i] + '</td>';
        html_tbody += '<td>' + popData[i] + '</td>';
        html_tbody += '</tr>';
    }
    $("#mainTbody").html(html_tbody);
}

// 获取分组信息
function getGroupPie() {
    $.ajax({
        url : ctx + "/report/assay/countItem.shtml",
        type : "post",
        data : "dateValue=" + dateValue + "&" + $("#selectForm").serialize(),
        dataType : "json",
        loading : true,
        success : function(data) {
            recordList = data.recordList;
            var html_tbody = '';
            for (var i = 0; i < recordList.length; i++) {
                var item = recordList[i];
                html_tbody += '<tr data-okindex="' + item.okIndex + '" data-groupindex="' + item.groupIndex + '">';
                html_tbody += '<td>' + item.patientName + '</td>';
                html_tbody += '<td>' + item.result + '</td>';
                /* html_tbody += '<td>' + item.resultTipsShow + '</td>'; */
                html_tbody += '</tr>';
            }
            $("#itemTbody").html(html_tbody);

            if (data.groupMap.title.length != 0) {
                $("#grouped").show();
                $("#noGroup").hide();
                setGroupPie(data.groupMap, isshow5);// 分组报表
                myGroupPie = data.groupMap;
                setGroupTable(data.groupMap);// 分组表格
            } else {
                $("#grouped").hide();
                $("#noGroup").show();
            }
            setMonthSeasonOkPie(data.okRangePie, isshow4);// 达标率报表
            myOkPieData = data.okRangePie;
            setMonthSeasonOkTable(data.okRangePie);// 达标率表格
        }
    });
}

// 获取月度分组表格
function setGroupTable(groupMap) {
    var titles = groupMap.title;
    var datas = groupMap.data;
    var dataValues = [];
    var total = 0;
    for (var i = 0; i < datas.length; i++) {
        dataValues[i] = datas[i].value;
        total += datas[i].value;
    }
    var html = '';
    for (var i = 0; i < dataValues.length; i++) {
        html += '<tr data-index="' + i + '"><td>' + titles[i] + '</td>';
        html += '<td>' + dataValues[i] + '</td>';
        html += '<td>' + (dataValues[i] / total).toPercent() + '</td>';
        html += '<td><button type="button" class="u-btn-blue" text="">详情</button></td></tr>';
    }
    html += '<tr data-index=""><td>总计</td><td>' + total
                    + '</td><td>100%</td><td><button type="button" class="u-btn-blue" text="">详情</button></td></tr>';
    $("#groupTbody").html(html);
}

// 获取月度达标率表格
function setMonthSeasonOkTable(okRangePie) {
    var titles = okRangePie.title;
    var datas = okRangePie.data;
    var dataValues = [];
    var total = 0;
    for (var i = 0; i < datas.length; i++) {
        dataValues[i] = datas[i].value;
        total += datas[i].value;
    }
    var html = '';
    for (var i = 0; i < dataValues.length; i++) {
        html += '<tr data-index="' + i + '"><td>' + titles[i] + '</td>';
        html += '<td>' + dataValues[i] + '</td>';
        html += '<td>' + (dataValues[i] / total).toPercent() + '</td>';
        html += '<td><button type="button" class="u-btn-blue" text="">详情</button></td></tr>';
    }
    html += '<tr data-index=""><td>总计</td><td>' + total
                    + '</td><td>100%</td><td><button type="button" class="u-btn-blue" text="">详情</button></td></tr>';
    $("#okTbody").html(html);
}

// 显示隐藏tab
function changeTab(index, dateShow) {
    $("#dateTitle span:eq(" + index + ")").addClass("active").siblings().removeClass("active");
    $("#contentDiv > div:eq(" + index + ")").show().siblings().hide();
    if (!isEmpty(dateShow)) {
        $("#dateTitle span:eq(" + index + ") > span > span ").text("(" + convertEmpty(dateShow) + ")");
    }
    if (index == 0) {
        $("#dateTitle span:eq(1)").hide();
    } else {
        var dateType = $("#dateType").val();
        var title = '';
        if (dateType == 'm') {
            title += '月度报表';
        } else {
            title += '季度报表';
        }
        title += "(" + convertEmpty(dateShow) + ")";
        $("#dateTitle span:eq(1)").html(title + '<i class="icon-close ml-6 opacity-5 fs-12" onclick="closeTab()"></i>');
        $("#dateTitle span:eq(1)").show();
    }
}

function closeTab() {
    // 显示年份表格下载按钮 隐藏月份表格下载按钮
    $("#downloadYear").parent().show();
    $("#downloadDetail").parent().hide();
    changeTab(0, "");
}

// 根据选中值隐藏显示名单详情
function showDetialTable(okIndex, groupIndex) {
    if (!isEmpty(okIndex)) {
        $("#itemTbody > tr").hide();
        $('#itemTbody > tr[data-okindex="' + okIndex + '"]').show();
    } else if (!isEmpty(groupIndex)) {
        $("#itemTbody > tr").hide();
        $('#itemTbody > tr[data-groupindex="' + groupIndex + '"]').show();
    } else {
        $("#itemTbody > tr").show();
    }
    $("body").animate({
        scrollTop : $("#patientDiv").offset().top - 10
    }, 1000);
}

/**
 * 化验项变更事件
 */
function changeItemCode() {
    // 非置顶项点击事件或者初始化显示，才需要移除置顶项active 效果
    if (!$(document).data("itemCodeChangeNeedData")) {
        $("#assayTopDiv span[data-itemcode]").removeClass("active");// 删除置顶项选中事件
    }
    var minValue = $("#itemCode option:selected").attr("data-minValue");
    var maxValue = $("#itemCode option:selected").attr("data-maxValue");
    $("#minValue").val(minValue);// 设置最大值
    $("#maxValue").val(maxValue);// 设置最小值
    getRuleList();// 查询化验项的分组规则
}

/**
 * 点击添加功能
 */
function addRuleBtnEvent() {
    resetRules();
    if ($("#contentDiv > div:eq(1)").is(":visible")) {
        getGroupPie();
    }
}

/**
 * 动态注册事件
 */
function registerRuleBtnDelEvent() {
    // 删除数值分组
    $("#ruleListDiv").on("click", "i.icon-error", function() {
        $(this).parent().remove();
        resetRules();
        if ($("#contentDiv > div:eq(1)").is(":visible")) {
            getGroupPie();
        }
    });
}

$(function() {
    // 首次加载页面默认显示第一条化验项数据
    $(document).data("itemCodeChangeNeedData", true);
    // 选择模板
    $("#assayTopDiv").on("click", "span[data-itemcode]", function() {
        $(this).addClass("active").siblings().removeClass("active");
        var groupId = $(this).attr("data-groupid");
        // itemcode 变更需要加载报表数据
        $(document).data("itemCodeChangeNeedData", true);
        $("#groupId").val(groupId);
        getAssayitem($(this).attr("data-itemcode"));// 模拟化验类型修改
    });
    getAssayListByTop(function() {
        getAssayCategory(function() {
            // 如果存在常用项，默认选中第一个常用项
            if ($("#assayTopDiv").find("[data-itemcode]").length > 0) {
                $("#assayTopDiv").find("[data-itemcode]:first").click();
            } else {// 触发groupId的change事件，拉取组下面的子项目
                $("#groupId").change();
            }
        });
    });

    // 返回年度统计
    $("#yearTitle").click(function() {
        // 显示年份表格下载按钮 隐藏月份表格下载按钮
        $("#downloadYear").parent().show();
        $("#downloadDetail").parent().hide();
        changeTab(0, "");
    });

    // 达标范围最大值失焦事件
    $("#maxValue").blur(function() {
        getReportByCondition();
    });

    // 点击主表单行,显示当前时间段的明细
    $("#mainTbody").on("click", "tr button", function() {
        // 隐藏年份表格下载按钮 显示月份表格下载按钮
        $("#downloadYear").parent().hide();
        $("#downloadDetail").parent().show();

        var totalCount = $(this).parent().parent().attr("data-total");
        if (isEmpty(totalCount) || totalCount == 0) {
            return false;
        }
        dateValue = $(this).parent().parent().attr("data-value");
        changeTab(1, dateValue);
        getGroupPie();
    });

    // 点击分组列表的行
    $("#groupTbody").on("click", "tr button", function() {
        $(this).parent().parent().addClass("active").siblings().removeClass("active");
        $("#okTbody > tr").removeClass("active");
        var groupIndex = $(this).parent().parent().attr("data-index");
        showDetialTable("", groupIndex);
    });

    // 点击达标列表的行
    $("#okTbody").on("click", "tr button", function() {
        $(this).parent().parent().addClass("active").siblings().removeClass("active");
        $("#groupTbody > tr").removeClass("active");
        var okIndex = $(this).parent().parent().attr("data-index");
        showDetialTable(okIndex, "");
    });

    // 点击下载年度统计
    $("#downloadYear").click(function() {
        $("#errorShowInfor").css("display", "none");
        window.location.href = ctx + "/report/assay/downloadYear.shtml?" + $("#selectForm").serialize();
    });

    // 点击下载年度统计
    $("#downloadDetail").click(function() {
        window.location.href = ctx + "/report/assay/downloadDetail.shtml?" + $("#selectForm").serialize() + "&dateValue=" + dateValue;
    });

    // 监听显示统计数据按钮
    $("#shownum").change(function() {
        if ($(this).is(':checked')) {
            isshow1 = true;
            setDbBar(myBarData, isshow1);
        } else {
            isshow1 = false;
            setDbBar(myBarData, isshow1);
        }
    });

    // 监听显示统计数据按钮
    $("#shownum2").change(function() {
        if ($(this).is(':checked')) {
            isshow2 = true;
            setAvgAndPop(myLineData, isshow2);
        } else {
            isshow2 = false;
            setAvgAndPop(myLineData, isshow2);
        }
    });

    // 监听显示统计数据按钮
    $("#shownum3").change(function() {
        if ($(this).is(':checked')) {
            isshow3 = true;
            setdblPie(myPieData, isshow3);
        } else {
            isshow3 = false;
            setdblPie(myPieData, isshow3);
        }
    });

    // 监听显示统计数据按钮
    $("#shownum4").change(function() {
        if ($(this).is(':checked')) {
            isshow4 = true;
            setMonthSeasonOkPie(myOkPieData, isshow4);
        } else {
            isshow4 = false;
            setMonthSeasonOkPie(myOkPieData, isshow4);
        }
    });

    // 监听显示统计数据按钮
    $("#shownum5").change(function() {
        if ($(this).is(':checked')) {
            isshow5 = true;
            setGroupPie(myGroupPie, isshow5);
        } else {
            isshow5 = false;
            setGroupPie(myGroupPie, isshow5);
        }
    });
});
