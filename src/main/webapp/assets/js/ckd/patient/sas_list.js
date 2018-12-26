var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        sas_list.init();
    });
});

var sas_list = {
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
        $("#sas_list_queryDiv").find('[datepicker]').each(function() {
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
        var startDate = $("#sas_list_queryDiv").find("input[name='startDateStr']").val();
        var endDate = $("#sas_list_queryDiv").find("input[name='endDateStr']").val();
        var param = {
            fkPatientId : sas_list.patientId,
            startDateStr : startDate,
            endDateStr : endDate
        };
        $.ajax({
            url : ctx + "/ckdSas/getList.shtml",
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
                        // SAS标准分的分界值为50分，其中50—59分为轻度焦虑，60—69分为中度焦虑，70分以上为重度焦虑
                        var tips = "正常";
                        if (score >= 50 && score <= 59) {
                            tips = "轻度焦虑";
                        } else if (score >= 60 && score <= 69) {
                            tips = "中度焦虑";
                        } else if (score > 70) {
                            tips = "重度焦虑";
                        }
                        html += '<tr>';
                        html += '  <td class="xtt-12">' + item.recordDateShow + '</td>';
                        html += '  <td class="xtt-10">' + score + '' + (score >= 50 ? '<span class="icon-upward fc-red u-float-r mt-4"></span>' : '')
                                        + '</td>';
                        html += '  <td>' + tips + '</td>';
                        html += '  <td class="xtt-10">';
                        html += '  <button type="button" class="u-btn-red" onclick="sas_list.del(' + item.id + ')" text>删除</button>';
                        if (hasPermission("CKD_sas_edit")) {
                            html += '  <button type="button" class="u-btn-blue" onclick="sas_list.edit(' + item.id + ')" text>编辑</button>';
                        }
                        html += '  </td>';
                        html += '</tr>';
                        xData[total - i - 1] = item.recordDateShow;
                        serieData[total - i - 1] = score;
                    }
                    $("#sas_list_tbody").html(html);
                    var chart = echarts.init(document.getElementById('sas_list_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ 'SAS' ]
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
                            name : 'SAS',
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
            patientId : sas_list.patientId,
            id : convertEmpty(id)
        });
        var url = ctx + "/ckdSas/editView.shtml?" + param;
        parent.showIframeDialog({
            title1 : "患者：" + sas_list.patientName,
            title : (isEmpty(id) ? "新增" : "编辑") + "焦虑自评量表(SAS)",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.sas_edit.save(function() {
                    parent.hiddenMe("#iframeDialog");
                    sas_list.getList();
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
                url : ctx + "/ckdSas/deleteById.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        sas_list.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};
