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
            url : ctx + "/ckdGfr/getList.shtml",
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
                        html += '<tr>';
                        html += '  <td class="xtt-12">' + item.recDateShow + '</td>';
                        html += '  <td class="xtt-10">' + item.recValShow + '</td>';
                        html += '  <td class="xtt-10">';
                        html += '  <button type="button" class="u-btn-red" onclick="gfr_list.del(' + item.id + ')" text>删除</button>';
                        html += '  <button type="button" class="u-btn-blue" onclick="gfr_list.edit(' + item.id + ')" text>编辑</button>';
                        html += '  </td>';
                        html += '</tr>';
                        xData[total - i - 1] = item.recordDateShow;
                        serieData[total - i - 1] = item.recValShow;
                    }
                    $("#gfr_list_tbody").html(html);
                    var chart = echarts.init(document.getElementById('gfr_list_chart'), '1');
                    var option = {
                        tooltip : {
                            trigger : 'axis'
                        },
                        legend : {
                            data : [ 'GFR' ]
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
                            name : 'GFR',
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
        ckd_gfr.show(id, gfr_list.patientId, function() {
            gfr_list.getList();
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
                url : ctx + "/ckdGfr/deleteById.shtml",
                data : {
                    id : id
                },
                type : "post",
                dateType : "json",
                success : function(result) {
                    if (result.status == "1") {
                        showTips("删除成功");
                        gfr_list.getList();
                    } else {
                        showWarn(result.errmsg);
                    }
                }
            });
        });
    }
};
