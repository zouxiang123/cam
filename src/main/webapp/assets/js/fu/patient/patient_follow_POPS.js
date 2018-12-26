var patient_follow_extend = {
    /** 患者电子病历url */
    patient_emr_url : "/patientHome/view.shtml",
    /** 获取患者列表数据对应的url */
    patient_list_url : "/popsPatientEmr/getFuPatients.shtml",
    /**
     * 获取操作按钮
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     * @return [{event,title } ]
     */
    getBtns : function(id, name, scheduleId) {
        var btns = [];
        // 首次术前、首次术后、再次术前、再次术后
        btns.push({
            event : "patient_follow_extend.showPostOperation(" + id + ",'" + name + "'," + scheduleId + ",true)",
            title : "首次术前"
        });
        btns.push({
            event : "patient_follow_extend.showOperation(" + id + ",'" + name + "'," + scheduleId + ",true)",
            title : "首次术后"
        });
        btns.push({
            event : "patient_follow_extend.showPostOperation(" + id + ",'" + name + "'," + scheduleId + ",false)",
            title : "再次术前"
        });
        btns.push({
            event : "patient_follow_extend.showOperation(" + id + ",'" + name + "'," + scheduleId + ",false)",
            title : "再次术后"
        });
        return btns;
    },
    /**
     * 显示术前记录
     * 
     * @param patientId
     * @param patientName
     * @param scheduleId
     *            计划id
     * @param isFirst
     *            是否首次
     */
    showPostOperation : function(patientId, patientName, scheduleId, isFirst) {
        var pops_addr = $("#pops_addr").val();
        showIframeDialog({
            title : isFirst ? "首次术前" : "再次术前",
            title1 : "患者：" + patientName,
            url : pops_addr + "/popsOperationRecord/postView.shtml?patientId=" + patientId + "&isFirst=" + isFirst,
            saveCall : function(iframeWin) {
                iframeWin.post_record.save(function(id) {
                    hiddenMe("#iframeDialog");
                    showConfirm("术前信息已保存，是否录入术后信息？", function() {
                        patient_follow_extend.showOperation(patientId, patientName, scheduleId, isFirst, id);
                    }, function() {
                        follow_obj.getPatients();
                    });
                });
            }
        });
    },
    /**
     * 显示术后记录
     * 
     * @param patientId
     * @param patientName
     * @param scheduleId
     *            计划id
     * @param isFirst
     * @param postId
     */
    showOperation : function(patientId, patientName, scheduleId, isFirst, postId) {
        var pops_addr = $("#pops_addr").val();
        showIframeDialog({
            title : isFirst ? "首次术后" : "再次术后",
            title1 : "患者：" + patientName,
            url : pops_addr + "/popsOperationRecord/view.shtml?patientId=" + patientId + "&isFirst=" + isFirst
                            + (isEmpty(postId) ? "" : ("&postId=" + postId)),
            saveCall : function(iframeWin) {
                iframeWin.operation_record.save(function(id) {
                    hiddenMe("#iframeDialog");
                    if (!isEmpty(scheduleId)) {
                        showConfirm("术后信息已保存，是否录入随访信息？", function() {
                            follow_obj.openFollow(null, patientName, scheduleId);
                        }, function() {
                            follow_obj.getPatients();
                        });
                    }
                });
            }
        });
    },
};