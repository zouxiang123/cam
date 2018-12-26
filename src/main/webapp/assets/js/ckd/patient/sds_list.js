var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        sds_list.init();
    });
});

var sds_list = {
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
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#sds_list_queryDiv").find('[datepicker]').each(function() {
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
        var startDate = $("#sds_list_queryDiv").find("input[name='startDateStr']").val();
        var endDate = $("#sds_list_queryDiv").find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : sds_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate
        };
        $.ajax({
            url : ctx + "/ckdSds/getList.shtml",
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
                        // SDS标准分的分界值为53分，其中53—62分为轻度抑郁，63—72分为中度抑郁，72分以上为重度抑郁
                        var tips = "正常";
                        if (score >= 53 && score <= 62) {
                            tips = "轻度抑郁";
                        } else if (score >= 63 && score <= 72) {
                            tips = "中度抑郁";
                        } else if (score > 72) {
                            tips = "重度抑郁";
                        }
                        html += '<tr>';
                        html += '  <td class="xtt-12">' + item.recordDateShow + '</td>';
                        html += '  <td class="xtt-10">' + score + '' + (score >= 53 ? '<span class="icon-upward fc-red u-float-r mt-4"></span>' : '')
                                        + '</td>';
                        html += '  <td>' + tips + '</td>';
                        html += '  <td class="xtt-10">';
                        html += '  <button type="button" class="u-btn-red" onclick="sds_list.del(' + item.id + ')" text>删除</button>';
                        if (hasPermission("CKD_sds_edit")) {
                            html += '  <button type="button" class="u-btn-blue" onclick="sds_list.edit(' + item.id + ')" text>编辑</button>';
                        }
                        html += '  </td>';
                        html += '</tr>';
                        xData[total - i - 1] = item.recordDateShow;
                        serieData[total - i - 1] = score;
                    }
                    $("#sds_list_tbody").html(html);
                    var chart = echarts.init(document.getElementById('sds_list_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ 'SDS' ]
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
                            name : 'SDS',
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
            patientId : sds_list.patientId,
            id : convertEmpty(id)
        });
        var url = ctx + "/ckdSds/editView.shtml?" + param;
        parent.showIframeDialog({
            title1 : "患者：" + sds_list.patientName,
            title : (isEmpty(id) ? "新增" : "编辑") + "抑郁自评量表(SDS)",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.sds_edit.save(function() {
                    parent.hiddenMe("#iframeDialog");
                    sds_list.getList();
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
                url : ctx + "/ckdSds/deleteById.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        sds_list.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};
