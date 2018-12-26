var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        gfr_list.init();
    });
});

var gfr_list = {
    patientId : null,
    patientName : null,
    /**
     * 页面初始化
     */
    init : function() {
        this.patientId = $("#patientId").val();
        this.patientName = $("#patientName").val();

        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() - 5);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#gfr_list_queryDiv").find('[datepicker]').each(function() {
            laydate.render({
                elem : this,
                value : $(this).attr("name") == "startDateStr" ? startDate : endDate,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });

        this.getList();
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        var startDate = $("#gfr_list_queryDiv").find("input[name='startDateStr']").val();
        var endDate = $("#gfr_list_queryDiv").find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : gfr_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate
        };
        $.ajax({
            url : ctx + "/ckdBw/getList.shtml",
            data : param,
            type : "post",
            dateType : "json",
            success : function(result) {
                if (result.status == "1") {
                    var items = result.rs;
                    var xData = [];
                    var SpWarn = $("input[name='sbpOp']").val();
                    var DpWarn = $("input[name='dbpOp']").val();
                    var serieDataSpWarn = [];// 预警值收缩压
                    var serieDataDpWarn = [];// 预警值舒张压
                    var serieDataSp = [];// 收缩压
                    var serieDataDp = [];// 舒张压
                    var serieDataW = [];// 体重
                    var html = "";
                    var total = items.length;
                    for (var i = 0; i < total; i++) {
                        var item = items[i];
                        html += '<tr>';
                        html += '  <td class="xtt-12">' + item.recordDateShow + '</td>';
                        html += '  <td class="xtt-10">' + convertEmpty(item.sbpOp) + '</td>';
                        html += '  <td class="xtt-10">' + convertEmpty(item.dbpOp) + '</td>';
                        html += '  <td class="xtt-10">' + convertEmpty(item.weight) + '</td>';
                        html += '</tr>';
                        xData[total - i - 1] = item.recordDateShow;
                        serieDataSp[total - i - 1] = convertEmpty(item.sbpOp);
                        serieDataDp[total - i - 1] = convertEmpty(item.dbpOp);
                        serieDataW[total - i - 1] = convertEmpty(item.weight);
                        serieDataSpWarn[total - i - 1] = SpWarn;
                        serieDataDpWarn[total - i - 1] = DpWarn;
                    }
                    $("#bw_list_tbody").html(html);
                    var chart = echarts.init(document.getElementById('bw_list_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ '预警值收缩压', '收缩压', '舒张压', '预警值舒张压', '体重' ]
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
                            name : '预警值收缩压',
                            type : 'line',
                            itemStyle : {
                                normal : {
                                    color : '#FF3EFF',
                                    lineStyle : {
                                        color : '#FF3EFF'
                                    }
                                }
                            },
                            data : serieDataSpWarn
                        }, {
                            name : '收缩压',
                            type : 'line',
                            itemStyle : {
                                normal : {
                                    color : '#00FF00',
                                    lineStyle : {
                                        color : '#00FF00'
                                    }
                                }
                            },
                            data : serieDataSp
                        }, {
                            name : '舒张压',
                            type : 'line',
                            itemStyle : {
                                normal : {
                                    color : '#000000',
                                    lineStyle : {
                                        color : '#000000'
                                    }
                                }
                            },
                            data : serieDataDp
                        }, {
                            name : '预警值舒张压',
                            type : 'line',
                            itemStyle : {
                                normal : {
                                    color : '#FF3EFF',
                                    lineStyle : {
                                        color : '#FF3EFF'
                                    }
                                }
                            },
                            data : serieDataDpWarn
                        }, {
                            name : '体重',
                            type : 'line',
                            itemStyle : {
                                normal : {
                                    color : '#003377',
                                    lineStyle : {
                                        color : '#003377'
                                    }
                                }
                            },
                            data : serieDataW
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
