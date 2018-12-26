var record_list = {
    patientId : null,
    sysOwner : null,
    init : function(patientId, sysOwner) {
        this.patientId = $("#patientId").val();
        this.sysOwner = $("#sysOwner").val();
        this.getList();
    },
    /**
     * 获取数据列表
     */
    getList : function() {
        $.ajax({
            url : ctx + "/fuRecord/getList.shtml",
            data : {
                patientId : record_list.patientId,
                sysOwner : record_list.sysOwner
            },
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                var html = "";
                if (data.status == "1") {
                    var items = data.rs;
                    if (!isEmptyObject(items)) {
                        for (var i = 0; i < items.length; i++) {
                            html += record_list.getItemHtml(items[i]);
                        }
                    }
                    $("#recordList").html(html);
                }
            }
        });
    },
    /**
     * 单条记录html
     */
    getItemHtml : function(item) {
        var html = "";
        if (item.followFormCode == "POPS_form") {// 手术随访单
            if (!isEmptyObject(item.details)) {
                var detail = item.details;
                html += '<div class="line-vertical"></div>';
                html += '<div class="border-gray ml-12 mr-12 p-12 position-relative" style="top: 22px;">';
                html += '  <div class="bb-dashed pb-10">';
                html += '     <span class="fw-bold mr-40">随访日期：' + new Date(item.startDate).pattern("yyyy-MM-dd") + '</span>';
                html += '     <span class="fw-bold">随访通路：' + convertEmpty(detail.operationRecordShow) + '</span>';
                html += '     <button type="button" class="u-btn-blue u-float-r ml-16" onclick="record_list.edit(' + item.id + ','
                                + item.fkPatientScheduleId + ',\'' + item.followFormCode + '\')" text>编辑</button>';
                html += '     <button type="button" class="u-btn-red u-float-r" onclick="record_list.del(' + item.id + ',\'' + item.followFormCode
                                + '\')" text>删除</button>';
                html += '  </div>';
                html += '  <div class="pt-12 u-xt-12 bb-dashed pb-12">';
                html += '    <div class="u-xt-3">震颤：' + convertEmpty(detail.tremorShow) + '</div>';
                html += '    <div class="u-xt-3">抬举塌陷实验：' + convertEmpty(detail.liftingCollapseTestShow) + '</div>';
                html += '    <div class="u-xt-3">搏动增强实验：' + convertEmpty(detail.pulseEnhancementTestShow) + '</div>';
                html += '  </div>';
                html += '  <div class="pt-12 u-xt-12">';
                html += '    <div class="u-xt-3">肱动脉内径：' + convertEmpty(detail.brachialArteryIdShow) + '<span class="opacity-5 ml-6">mm</span></div>';
                html += '    <div class="u-xt-3">血流量：' + convertEmpty(detail.bloodFlowShow) + '<span class="opacity-5 ml-6">ml/min</span></div>';
                html += '    <div class="u-xt-3">RI:' + convertEmpty(detail.ri) + '</div>';
                html += '    <div class="u-xt-3">近吻合口动脉内径：' + convertEmpty(detail.nearStomaArteryIdShow)
                                + '<span class="opacity-5 ml-6">mm</span></div>';
                html += '  </div>';
                html += '  <div class="pt-12 u-xt-12">';
                html += '    <div class="u-xt-3">动脉穿刺点内径：' + convertEmpty(detail.arteryPuncturePointIdShow)
                                + '<span class="opacity-5 ml-6">mm</span></div>';
                html += '    <div class="u-xt-3">静脉穿刺点内径：' + convertEmpty(detail.veinPuncturePointIdShow)
                                + '<span class="opacity-5 ml-6">mm</span></div>';
                html += '    <div class="u-xt-3">穿刺点间内径：' + convertEmpty(detail.puncturePointIdShow) + '<span class="opacity-5 ml-6">mm</span></div>';
                html += '  </div>';
                html += '  <div class="pt-12 u-xt-12">其他：' + convertEmpty(detail.other) + '</div>';
                html += '</div>';
            }
        } else if (item.followFormCode == "PD_form") {// 手术随访单
            if (!isEmptyObject(item.details)) {
                html += '<div class="line-vertical"></div>';
                html += '<div class="border-gray ml-12 mr-12 p-12 position-relative" style="top: 22px;">';
                html += '  <div class="bb-dashed pb-10">';
                html += '     <span class="fw-bold mr-40">随访日期：' + new Date(item.startDate).pattern("yyyy-MM-dd") + '</span>';
                html += '     <button type="button" class="u-btn-blue u-float-r ml-16" onclick="record_list.edit(' + item.id + ','
                                + item.fkPatientScheduleId + ',\'' + item.followFormCode + '\')" text>编辑</button>';
                html += '     <button type="button" class="u-btn-red u-float-r" onclick="record_list.del(' + item.id + ',\'' + item.followFormCode
                                + '\')" text>删除</button>';
                html += '  </div>';
                html += '  <div class="pt-12 u-xt-12 bb-dashed pb-12">存在问题：' + convertEmpty(item.summary) + '</div>';
                html += '  <div class="pt-12 u-xt-12">改善计划：' + convertEmpty(item.nextPlan) + '</div>';
                html += '</div>';
            }
        } else if (item.followFormCode == "template_form") {// 模板表单
            if (!isEmptyObject(item.details)) {
                html += '<div class="line-vertical"></div>';
                html += '<div class="border-gray ml-12 mr-12 p-12 position-relative" style="top: 22px;">';
                html += '  <div class="bb-dashed pb-10">';
                html += '     <span class="fw-bold mr-40">随访日期：' + new Date(item.startDate).pattern("yyyy-MM-dd") + '</span>';
                html += '     <button type="button" class="u-btn-blue u-float-r ml-16" onclick="record_list.edit(' + item.id + ','
                                + item.fkPatientScheduleId + ',\'' + item.followFormCode + '\')" text>编辑</button>';
                html += '     <button type="button" class="u-btn-red u-float-r" onclick="record_list.del(' + item.id + ',\'' + item.followFormCode
                                + '\')" text>删除</button>';
                html += '  </div>';
                html += '</div>';
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
            url : ctx + "/fuRecord/view.shtml?id=" + id + "&scheduleId=" + scheduleId + "&sysOwner=" + record_list.sysOwner,
            saveCall : function(iframeWin) {
                if (followFormCode == "POPS_form") {// 手术随访单
                    iframeWin.fu_record_pops.save(function(id) {
                        hiddenMe($("#iframeDialog"));
                        record_list.getList();
                    });
                } else if (followFormCode == "PD_form") {
                    iframeWin.fu_record_pd.save(function(id) {
                        hiddenMe($("#iframeDialog"));
                        record_list.getList();
                    });
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
                url : ctx + "/fuRecord/deleteRecord.shtml",
                data : {
                    id : id,
                    formCode : formCode
                },
                type : "post",
                dataType : "json",
                success : function(data) { // ajax返回的数据
                    if (data.status == "1") {
                        showTips("删除成功");
                        record_list.getList();
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
                        record_list.edit("", item.id, item.followFormCode);
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
        url = ctx + "/" + url + ".shtml?patientId=" + record_list.patientId + "&sysOwner=" + record_list.sysOwner;
        showIframeDialog({
            title1 : "患者：" + $("#patientName").val(),
            title : "随访计划",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.patient_schedule.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    record_list.getList();
                });
            }
        });
    }
};