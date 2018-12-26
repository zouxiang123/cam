var laydate = null;
$(function() {
    // 日历查询
    layui.use('laydate', function() {
        laydate = layui.laydate;
        rec_list_ckd.init();
    });
});

var rec_list_ckd = {
    patientId : null,
    sysOwner : null,
    init : function() {
        this.patientId = $("#patientId").val();
        this.sysOwner = $("#sysOwner").val();

        var date = new Date();
        var endDate = date.pattern("yyyy-MM-dd");
        date.setFullYear(date.getFullYear() - 1);
        date.setDate(date.getDate() + 1);
        var startDate = date.pattern("yyyy-MM-dd");
        $("#queryDialog").find('[datepicker]').each(function() {
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
        var startDate = $("#queryDialog").find("input[name='startDateStr']").val();
        var endDate = $("#queryDialog").find("input[name='endDateStr']").val();
        $.ajax({
            url : ctx + "/fuRecordCkd/getList.shtml",
            data : {
                patientId : rec_list_ckd.patientId,
                startDateStr : startDate,
                endDateStr : endDate,
                sysOwner : rec_list_ckd.sysOwner
            },
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                var html = "";
                if (data.status == "1") {
                    var items = data.rs;
                    if (!isEmptyObject(items)) {
                        for (var i = 0; i < items.length; i++) {
                            html += rec_list_ckd.getItemHtml(items[i]);
                        }
                    }
                    $("#tableBody").find("tbody").html(html);
                }
            }
        });
    },
    /**
     * 单条记录html
     */
    getItemHtml : function(item) {
        var html = "";
        if (item.followFormCode == "PD_form_01") { // 腹透随访模板1
            if (!isEmptyObject(item.details)) {
                html += '<tr>';
                html += '<td class="xtt-10">' + item.details.recordDateStr + '</td>';
                html += '<td class="xtt-8"></td>';
                html += '<td class="xtt-8"></td>';
                html += '<td></td>';
                html += '<td class="xtt-9">';
                html += '<button type="button" class="u-btn-red" onclick="rec_list_ckd.del(' + item.details.fkRecordId + ')" text>删除</button>';
                html += '<button type="button" class="u-btn-blue" onclick="rec_list_ckd.edit(' + item.details.fkRecordId + ','
                                + item.details.patientScheduleId + ',\'' + item.details.followFormCode + '\')" text>编辑</button>';
                html += '</td>';
                html += '</tr>';
            }

        } else {
            if (!isEmptyObject(item.details)) {
                html += '<tr>';
                html += '<td class="xtt-10">' + convertEmpty(item.details.recordDateShow) + '</td>';
                html += '<td class="xtt-8">' + convertEmpty(item.details.nurseName) + '</td>';
                html += '<td class="xtt-8">' + convertEmpty(item.details.doctorName) + '</td>';
                html += '<td>' + convertEmpty(item.details.announcements) + '</td>';
                html += '<td class="xtt-9">';
                html += '<button type="button" class="u-btn-red" onclick="rec_list_ckd.del(' + item.details.fkRecordId + ')" text>删除</button>';
                html += '<button type="button" class="u-btn-blue" onclick="rec_list_ckd.edit(' + item.details.fkRecordId + ','
                                + item.details.patientScheduleId + ',\'' + item.details.followFormCode + '\')" text>编辑</button>';
                html += '</td>';
                html += '</tr>';
            }
        }
        return html;
    },
    /**
     * 编辑随访单
     * 
     * @param id
     * @param scheduleId
     */
    edit : function(id, scheduleId, followFormCode) {
        showIframeDialog({
            title1 : "患者：" + $("#patientName").val(),
            title : "随访单",
            url : ctx + "/fuRecord/view.shtml?id=" + id + "&scheduleId=" + scheduleId + "&sysOwner=" + rec_list_ckd.sysOwner,
            saveCall : function(iframeWin) {
                if (followFormCode == "PD_form_01") {
                    iframeWin.fu_record_detail_pd_whzx_edit.save(function(id) {
                        hiddenMe($("#iframeDialog"));
                        rec_list_ckd.getList();
                    });
                } else {
                    var callback = function(id) {
                        hiddenMe($("#iframeDialog"));
                        rec_list_ckd.getList();
                    };
                    iframeWin.fu_record_ckd.save(callback);
                }
            }
        });
    },
    /**
     * 删除随访记录
     * 
     * @param id
     * @param formCode
     */
    del : function(id, formCode) {
        showWarn("您确定要删除随访记录吗？", function() {
            $.ajax({
                url : ctx + "/fuRecordCkd/deleteByFkRecordId.shtml",
                data : {
                    id : id
                },
                type : "post",
                dataType : "json",
                success : function(data) { // ajax返回的数据
                    if (data.status == "1") {
                        showTips("删除成功");
                        rec_list_ckd.getList();
                    }
                }
            });
        });
    },
    /**
     * 添加随访单
     */
    add : function() {
        $.ajax({
            url : ctx + "/fuPatientSchedule/getNextSchedule.shtml",
            data : {
                patientId : this.patientId,
                sysOwner : this.sysOwner
            },
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                if (data.status == "1") {
                    if (!isEmptyObject(data.rs)) {
                        var item = data.rs;
                        rec_list_ckd.edit("", item.id, item.followFormCode);
                    } else {
                        showWarn("请先设定患者的随访计划");
                    }
                }
            }
        });
    },
    /**
     * 显示随访计划
     */
    showPlan : function(el) {
        var url = getPermissionUrlByKey($(el).attr("data-permission-key"));
        url = ctx + "/" + url + ".shtml?patientId=" + rec_list_ckd.patientId + "&sysOwner=" + rec_list_ckd.sysOwner;
        showIframeDialog({
            title1 : "患者：" + $("#patientName").val(),
            title : "随访计划",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.patient_schedule.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    rec_list_ckd.getList();
                });
            }
        });
    }
};