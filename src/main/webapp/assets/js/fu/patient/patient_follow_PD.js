var patient_follow_extend = {
    /** 患者电子病历url */
    patient_emr_url : "/patientHome/view.shtml",
    /** 获取患者列表数据对应的url */
    patient_list_url : "/pdPatientEHR/getFuPatients.shtml",
    /**
     * 获取操作按钮
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     * @return [{event,title } ]
     */
    getBtns : function(id, name) {
        var btns = [];
        if (hasPermission("PD_liquid_change_edit")) {
            btns.push({
                event : "patient_follow_extend.showLiquidChange(" + id + ",'" + name + "');",
                title : "记录换液"
            });
        }
        if (hasPermission("PD_adequacy_appraisal_edit")) {
            var event = "patient_follow_extend.showAdequacyAppraisal(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "充分性评估"
            });
        }
        if (hasPermission("PD_pet_edit")) {
            var event = "patient_follow_extend.showPet(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "PET"
            });
        }
        btns.push({
            event : "patient_follow_extend.showUrineVol(" + id + ",'" + name + "');",
            title : "记录24h尿量"
        });
        if (hasPermission("PD_catheter_edit")) {
            var event = "patient_follow_extend.showCatheter(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "新置管"
            });
        }
        if (hasPermission("PD_tube_change_edit")) {
            var event = "patient_follow_extend.showTubeChange(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "更换短管"
            });
        }
        if (hasPermission("PD_prescription_edit")) {
            var event = "patient_follow_extend.showPrescription(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "新增处方"
            });
        }
        if (hasPermission("PD_complication_edit")) {
            var event = "patient_follow_extend.showComplication(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "新增并发症"
            });
        }
        var event = "patient_follow_extend.showPropaganda(" + id + ",'" + name + "');";
        btns.push({
            event : event,
            title : "宣教"
        });
        if (hasPermission("CM_nu_body_measure_edit") || hasPermission("CM_nu_assessment_edit") || hasPermission("CM_nu_food_rec_edit")) {
            var event = "patient_follow_extend.showNu(" + id + ",'" + name + "');";
            btns.push({
                event : event,
                title : "营养评估"
            });
        }
        return btns;
    },
    /**
     * 记录换液
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showLiquidChange : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        showIframeDialog({
            title1 : "患者：" + name,
            title : "记录换液",
            url : pd_addr + getPermissionUrlByKey("PD_liquid_change_edit") + ".shtml?patientId=" + id,
            saveCall : function(iframeWin) {
                iframeWin.liquid_change.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
            }
        });

    },
    /**
     * 显示充分性评估
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showAdequacyAppraisal : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        var tabs = [ {
            title : "充分性评估",
            url : pd_addr + getPermissionUrlByKey("PD_adequacy_appraisal_edit") + ".shtml?patientId=" + id
        } ];
        if (hasPermission("PD_adequacy_appraisal_list")) {
            tabs.push({
                title : "评估历史",
                url : pd_addr + getPermissionUrlByKey("PD_adequacy_appraisal_list") + ".shtml?patientId=" + id + "&isPreview=1",
                hidebtn : 1
            });
        }
        showIframeDialog({
            title1 : "患者：" + name,
            tabs : tabs,
            saveCall : function(iframeWin) {
                iframeWin.adequacy_appraisal.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
            }
        });
    },
    /**
     * 显示PET
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showPet : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        showIframeDialog({
            title1 : "患者：" + name,
            title : "PET",
            url : pd_addr + getPermissionUrlByKey("PD_pet_edit") + ".shtml?patientId=" + id,
            saveCall : function(iframeWin) {
                iframeWin.pet.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
            }
        });
    },
    /**
     * 记录24h尿量
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showUrineVol : function(id, name) {
        urine_vol.show(id, name, function() {
            follow_obj.getPatients();
        });
    },
    /**
     * 新置管
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showCatheter : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        showIframeDialog({
            title1 : "患者：" + name,
            title : "新置管",
            url : pd_addr + getPermissionUrlByKey("PD_catheter_edit") + ".shtml?patientId=" + id,
            saveCall : function(iframeWin) {
                iframeWin.catheter_edit.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
            }
        });
    },
    /**
     * 更换短管
     * 
     * @param id
     *            患者id
     * @param name
     *            患者名称
     */
    showTubeChange : function(id, name) {
        tube_change.show(null, null, id, name, function() {
            follow_obj.getPatients();
        });
    },
    /**
     * 显示新增处方
     * 
     * @param id
     * @param name
     */
    showPrescription : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        showIframeDialog({
            title1 : "患者：" + name,
            title : "新建处方",
            url : pd_addr + getPermissionUrlByKey("PD_prescription_edit") + ".shtml?patientId=" + id,
            fullScreen : false,
            saveCall : function(iframeWin) {
                iframeWin.prescription_edit.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
            }
        });
    },
    /**
     * 显示并发症
     * 
     * @param id
     * @param name
     */
    showComplication : function(id, name) {
        var pd_addr = $("#pd_addr").val();
        showIframeDialog({
            title1 : "患者：" + name,
            title : "新增并发症",
            url : pd_addr + getPermissionUrlByKey("PD_complication_edit") + ".shtml?patientId=" + id,
            saveCall : function(iframeWin) {
                iframeWin.complication_edit.save(function(id) {
                    hiddenMe("#iframeDialog");
                    follow_obj.getPatients();
                });
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