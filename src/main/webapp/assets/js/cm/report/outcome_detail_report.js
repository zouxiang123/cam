var isshow = true;
var myPieTitle;
var myDataArr;
$(function() {
    var year = $("#year").val();
    var month = $("#month").val();
    var type = $("#type").val();
    if (year != '' && type != '' && month == '') { // 该转归类型的年患者汇总
        getPatientData(year, '', type);
    } else if (year != '' && month != '' && type == '') { // 转归月患者汇总
        $("#monthChartDiv").show();
        showYearData();
    } else { // 该转归类型的月患者汇总
        getPatientData('', month, type);
    }

    $("#shownum2").change(function() {
        if ($(this).is(':checked')) {
            isshow = true;
            getMyChart(myPieTitle, myDataArr, isshow);
        } else {
            isshow = false;
            getMyChart(myPieTitle, myDataArr, isshow);
        }
    });
});
/** 获取患者数据 */
function getPatientData(year, month, type, isshow) {
    $.ajax({
        url : ctx + "/report/outcome/getPatients.shtml",
        type : "post",
        data : {
            year : year,
            month : month,
            type : type,
            patientTempValue : $("#patientTempValue").val()
        },
        dataType : "json",
        loading : true,
        success : function(data) {
            if (data.status == 1) {
                var headHtml = "";
                var bodyHtml = "";
                if (!isEmptyObject(data.items)) {
                    var headRow = data.headRow;
                    {// table thead
                        headHtml += "<tr>";
                        headHtml += "<th style='width: 15%'>姓名</th>";
                        headHtml += "<th style='width: 18%'>时间</th>";
                        headHtml += "<th style='width: 18%'>类别</th>";
                        headHtml += "<th style='width: 34%'>原因</th>";
                        headHtml += "</tr>";
                    }
                    {// table body
                        for (var i = 0; i < data.items.length; i++) {
                            var item = data.items[i];
                            bodyHtml += "<tr>";
                            bodyHtml += "<td style='width: 15%'>" + item.patientName + "</td>";
                            bodyHtml += "<td style='width: 18%'>" + item.recordDateShow + "</td>";
                            bodyHtml += "<td style='width: 18%'>" + convertEmpty(item.typeShow) + "</td>";
                            bodyHtml += "<td style='width: 34%'>" + item.reason + "</td>";
                            bodyHtml += "</tr>";
                        }
                    }
                }
                $("#patientTable thead").html(headHtml);
                $("#patientTable tbody").html(bodyHtml);
            } else {
                showError("发生异常，刷新后重试");
            }
        }
    });
}
function showYearData() {
    $.ajax({
        url : ctx + "/report/outcome/getReportData.shtml",
        type : "post",
        data : {
            year : $("#year").val(),
            patientTempValue : $("#patientTempValue").val()
        },
        dataType : "json",
        success : function(data) {
            // 这里只构建全年的转归类型的table统计，并且会隐藏起来，作为month的转归的汇总统计数据来源
            getTableHtml(data);
            showMonthData($("#month").val());
        }
    });
}
/** 显示月份数据 */
function showMonthData(month) {
    var trEl = $("#tableDiv tbody tr[data-month='" + month + "']");
    // 显示患者数据
    getPatientData('', month, '');

    var dataArr = new Array();
    var pieTitle = new Array();
    var total = 0;
    trEl.find("td[data-name]").each(function() {
        var value = parseInt($(this).data("count"));
        if (value > 0) {
            pieTitle.push($(this).data("name"));
            dataArr.push({
                name : $(this).data("name"),
                value : parseInt($(this).data("count"))
            });
            total += value;
        }
    });
    {// 月合计数据
        var bodyHtml = "";
        for (var i = 0; i < dataArr.length; i++) {
            var item = dataArr[i];
            bodyHtml += "<tr class='table-default'>";
            bodyHtml += "<td>" + item.name + "</td>";
            bodyHtml += "<td>" + item.value + "</td>";
            bodyHtml += "<td>" + (parseInt(item.value) / total).toPercent() + "</td>";
            bodyHtml += "</tr>";
        }
        if (dataArr.length > 0) {
            bodyHtml += "<tr class='table-default'>";
            bodyHtml += "<td>合计</td>";
            bodyHtml += "<td>" + total + "</td>";
            bodyHtml += "<td>100%</td>";
            bodyHtml += "</tr>";
        }
        $("#monthTableBody").html(bodyHtml);
    }

    getMyChart(pieTitle, dataArr, isshow);
    myPieTitle = pieTitle;
    myDataArr = dataArr;
}

function getMyChart(pieTitle, dataArr, isshow) {
    var myChart = echarts.init(document.getElementById("chart2"), parent.parent.statementSkin);
    var option = {
        tooltip : {
            trigger : 'item',
            formatter : "{a} <br/>{b} : {c}人 ({d}%)"
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
            x : '65%',
            y : 'center',
            data : pieTitle
        },
        calculable : false,
        series : [ {
            name : '转归患者统计',
            type : 'pie',
            radius : '55%',
            center : [ '40%', '50%' ],
            data : dataArr,
            itemStyle : {
                normal : {
                    label : {
                        show : isshow,
                        formatter : '{b} : {c} ({d}%)'
                    },
                    labelLine : {
                        show : isshow
                    }
                }
            }
        } ]
    };
    myChart.setOption(option);
}

/** 获取年度报表tab数据 */
function getTableHtml(data) {
    var tableHtml = "";
    if (data.status == 1) {
        var cols = data.cols;
        var rows = data.rows;
        tableHtml = '<table class="table table-border table-align-left-15" style="margin-bottom: 0px;">';
        var theadHtml = '<thead>';
        theadHtml += "<tr>";
        theadHtml += '<th>' + cols[0] + '</th>';
        for ( var t in rows) {
            theadHtml += '<th>' + rows[t][0].colValue + '</th>';
        }
        theadHtml += "</tr>";
        theadHtml += '</thead>';
        tableHtml += theadHtml;
        var tbodyHtml = '<tbody>';
        for (var i = 1; i < data.colCodes.length; i++) {
            tbodyHtml += '<tr data-month="' + data.colCodes[i] + '">';
            // 月份列;
            if (data.colCodes[i] == 'total') {
                tbodyHtml += '<td>' + cols[i] + '</td>';
            } else {
                tbodyHtml += '<td>' + cols[i] + '</td>';
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
                if ("total" != t) {
                    tdData = 'data-name="' + rows[t][0].colValue + '" data-count="' + colValue + '"';
                }
                if (rows[t][0].colValue == '总计') {
                    tbodyHtml += '<td ' + tdData + '>' + colValue + '</td>';
                } else {
                    tbodyHtml += '<td ' + tdData + '>' + colValue + '</td>';
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
