var patient_follow_extend = {
    /** 患者电子病历url */
    patient_emr_url : "/ckdPatientHome/view.shtml",
    /** 获取患者列表数据对应的url */
    patient_list_url : "/ckdPatientEmr/getFuPatients.shtml",
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
        if (hasPermission("CKD_sds_edit") || hasPermission("CKD_sas_edit")) {
            var event = "patient_follow_extend.showPa(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "心理评估"
            });
        }
        btns.push({
            event : "patient_follow_extend.showPropaganda(" + id + ",'" + name + "');",
            title : "宣教"
        });
        if (hasPermission("CM_nu_body_measure_edit") || hasPermission("CM_nu_assessment_edit") || hasPermission("CM_nu_food_rec_edit")) {
            var event = "patient_follow_extend.showNu(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "营养评估"
            });
        }
        /*btns.push({
            event : "patient_follow_extend.showGfr(" + id + ",'" + name + "');",
            title : "GFR"
        });*/
        btns.push({
            event : "patient_follow_extend.showTreatment(" + id + ",'" + name + "');",
            title : "治疗分析"
        });
        if (hasPermission("CKD_drugs_record")) {
            var event = "patient_follow_extend.showDrugsRecord(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "药品观察记录"
            });
        }
        if (hasPermission("CKD_medical_record")) {
            var event = "patient_follow_extend.showMedicalRecord(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "用药记录"
            });
        }
        return btns;
    },
    /**
     * 显示心里评估
     * 
     * @param id
     * @param name
     */
    showPa : function(id, name) {
        var param = $.param({
            patientId : id
        });
        var tabs = [];
        if (hasPermission("CKD_sas_edit")) {
            tabs.push({
                title : "SAS",
                url : ctx + "/" + getPermissionUrlByKey("CKD_sas_edit") + ".shtml?" + param
            });
        }
        if (hasPermission("CKD_sds_edit")) {
            tabs.push({
                title : "SDS",
                url : ctx + "/" + getPermissionUrlByKey("CKD_sds_edit") + ".shtml?" + param
            });
        }
        showIframeDialog({
            title1 : "患者：" + name,
            tabs : tabs,
            saveCall : function(iframeWin) {
                if (!isEmpty(iframeWin.sas_edit)) {
                    iframeWin.sas_edit.save();
                } else if (!isEmpty(iframeWin.sds_edit)) {
                    iframeWin.sds_edit.save();
                }
            }
        });
    },
    /**
     * 显示宣教
     * 
     * @param id
     * @param name
     */
    showPropaganda : function(id, name) {
        var url = ctx + "/propaganda/resource/view.shtml?patientId=" + id;
        follow_obj.openUrl("propaganda_" + id, name + "宣教", url, 0);
    },
    /**
     * 显示Gfr
     * 
     * @param id
     * @param name
     */
    showGfr : function(id, name) {
        ckd_gfr.show(null, id, function() {
            follow_obj.getPatients();
        });
    },
    /**
     * 显示治疗分析
     * 
     * @param id
     * @param name
     */
    showTreatment : function(id, name) {
        var url = ctx + "/openUrl.shtml?baseUrl=&key=CKD_treatment&param=patientId=" + id;
        follow_obj.openUrl("treatment" + id, name + "治疗分析", url, 0);
    },
    /**
     * 药品观察记录
     * 
     * @param id
     * @param name
     */
    showDrugsRecord : function(id, name) {
        showIframeDialog({
            title1 : "患者：" + name,
            title : "药品观察记录",
            url : ctx + "/" + getPermissionUrlByKey("CKD_drugs_record") + ".shtml?fkPatientId=" + id,
            saveCall : function(iframeWin) {
                // 回调函数
                var callback = function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                };
                if (!isEmpty(iframeWin.ckd_drugs_record)) {
                    iframeWin.ckd_drugs_record.save(callback);
                }
            }
        });
    },
    /**
     * 用药记录
     * 
     * @param id
     * @param name
     */
    showMedicalRecord : function(id, name) {
        ckd_medical_record.show(id, name, function() {
            follow_obj.getPatients();
        });
    },
    /**
     * 显示营养评估
     * 
     * @param id
     * @param name
     */
    showNu : function(id, name) {
        var param = $.param({
            patientId : id
        });
        var tabs = [];
        if (hasPermission("CM_nu_body_measure_edit")) {
            tabs.push({
                title : "人体测量",
                url : ctx + "/" + getPermissionUrlByKey("CM_nu_body_measure_edit") + ".shtml?" + param
            });
        }
        if (hasPermission("CM_nu_assessment_edit")) {
            tabs.push({
                title : "营养评估",
                url : ctx + "/" + getPermissionUrlByKey("CM_nu_assessment_edit") + ".shtml?" + param
            });
        }
        if (hasPermission("CM_nu_food_rec_edit")) {
            tabs.push({
                title : "饮食记录",
                url : ctx + "/" + getPermissionUrlByKey("CM_nu_food_rec_edit") + ".shtml?" + param
            });
        }
        showIframeDialog({
            title1 : "患者：" + name,
            tabs : tabs,
            saveCall : function(iframeWin) {
                if (!isEmpty(iframeWin.assessment_edit)) {
                    iframeWin.assessment_edit.save();
                } else if (!isEmpty(iframeWin.body_measure_edit)) {
                    iframeWin.body_measure_edit.save();
                } else if (!isEmpty(iframeWin.food_rec)) {
                    iframeWin.food_rec.save();
                }
            }
        });
    }
};