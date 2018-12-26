var patient_label = {
    pagingObj : null,
    isBatch : false,
    init : function() {
        this.pagingObj = pagination.addPaging({
            bodyId : "load_patient_label",
            callback : function() {
                patient_label.getPatient(false);
            },
            scrollEl : $(window),
            pageSize : 20
        });
        this.addEvents();
        this.getAllLabel(function() {
            patient_label.getPatient(true);
        });
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        // 查询标签点击事件
        $("#label_check").on("click", "[label-id]", function() {
            $(this).addClass("active").siblings().removeClass("active");
            patient_label.getPatient(true);
        });
        // 批量设定患者标签功能
        $("#label_batch_btn").on("click", function() {
            patient_label.isBatch = true;
            // 初始化总数
            $("#label_batch_option_count").text("全选(0人)");
            $("#checkbox").prop("checked", false);
            // 控制批量按钮和批量编辑操作
            $("#label_batch_option").show();
            $("#label_batch_btn").hide();
            $("#label_manage_btn").hide();
            // 取消患者编辑功能
            $("#load_patient_label").find("[label-patient-edit]").addClass("hide");
        });
        // 全选和全不选功能
        $("#label_batch_option_count").on("click", function() {
            var patientsDiv = $("#load_patient_label").find("[label-patient]");
            if ($(this).is(":checked")) {
                patientsDiv.addClass("bq_check");
            } else {
                patientsDiv.removeClass("bq_check");
            }
            $("#label_batch_option_count").html("全选(" + 0 + "人)");
        });
        // 删除标签
        $("#dialogLabel_context").on("click", "[data-delete]", function() {
            var labelEl = $(this).parents("[label-id]");
            $.ajax({
                url : ctx + "/patient/label/delete.shtml",
                data : {
                    id : labelEl.attr("label-id")
                },
                type : "post",
                loading : true,
                dataType : "json",
                success : function(data) {// ajax返回的数据
                    if (data.status == "1") {
                        showTips("删除成功");
                        labelEl.remove();
                        patient_label.getAllLabel();
                    } else {
                        showWarn(data.errmsg);
                    }
                }
            });
        });
        // 编辑患者标签或者批量选择患者标签
        $("#dialogPatient_label_check,#label_patient_batch_check_label").on("click", "[label-id]", function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
            } else {
                $(this).addClass("active");
            }
        });
        // 患者div点击事件
        $("#load_patient_label").on("click", "[label-patient]", function() {
            if (!patient_label.isBatch) {// 批量操作时，才需要此事件
                return false;
            }
            if ($(this).hasClass("bq_check")) {
                $(this).removeClass("bq_check");
            } else {
                $(this).addClass("bq_check");
            }
            var checkedPatients = $("#load_patient_label").find("[label-patient].bq_check");
            $("#label_batch_option_count").html("全选(" + checkedPatients.length + "人)");
        });
    },
    /**
     * 获取所有的标签
     */
    getAllLabel : function(callback) {
        $.ajax({
            url : ctx + "/patient/label/listAll.shtml",
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    var labels = data.rs;
                    // 标签选择html
                    var labelHtml = '<label class="xt-check-label2 active" label-id="">全部</label>';
                    // 标签编辑dialog
                    var editLabelHtml = "";
                    // 编辑患者标签html
                    var patientLabelHtml = "";
                    for (var i = 0; i < labels.length; i++) {
                        var label = labels[i];
                        labelHtml += '<label class="xt-check-label2" label-id="' + label.id + '">' + label.name + '</label>';

                        editLabelHtml += '<label class="xt-check-label2" label-id="' + label.id + '" no-repeat>' + label.name;
                        editLabelHtml += '  <div class="check-label-delete" data-delete></div>';
                        editLabelHtml += '</label>';

                        patientLabelHtml += '<label class="xt-check-label2" label-id="' + label.id + '">' + label.name + '</label>';
                    }
                    $("#label_check").html(labelHtml);
                    $("#dialogLabel_context").html(editLabelHtml);
                    $("#dialogPatient_label_check").html(patientLabelHtml);
                    $("#label_patient_batch_check_label").html(patientLabelHtml);
                    if (!isEmpty(callback)) {
                        callback();
                    }
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 获取患者列表
     * 
     * @param resetPage
     */
    getPatient : function(resetPage) {
        var paging = this.pagingObj;
        if (resetPage) {
            paging.resetPaging();
        }
        var param = {
            fkLabelId : $("#label_check").find("[label-id].active").attr("label-id"),
            patientSpellInitials : $("#search_result_span").text()
        };
        $.extend(param, paging.getPagingData());
        // 删除无需提交到后台的参数
        delete param.str;
        $.ajax({
            url : ctx + "/patient/label/listPatient.shtml",
            data : param,
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    var rs = data.rs;
                    var html = patient_label.getPatientHtml(rs.results);
                    $("#load_patient_label").append(html);
                    paging.setTotalPage(rs.totalPage);
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 生成患者Div选择框
     * 
     * @param isBatch
     */
    getPatientHtml : function(list) {
        var html = "";
        if (isEmptyObject(list)) {
            return html;
        }
        for (var i = 0; i < list.length; i++) {
            var item = list[i];
            html += '<div class="col-xt-4 p-5" label-patient="' + item.patientId + '">';
            html += '<input type="hidden" name="patientName" value="' + item.patientName + '" />';
            html += '<div class="xt-bq">';
            html += '<span class="u-image float-left hand" style="width:60px; height:60px" onclick="patient_label.showPatientEmr(\'' + item.patientId
                            + '\',\'' + item.patientName + '\');">' + getImageName(item.patientName) + '</span>';
            html += '<div class="bed-user-info margin-top-18">';
            html += '  <p class="bed-user-name">' + item.patientName + '<span class="hide">' + item.patientSpellInitials + '</span></p>';
            html += '</div>';
            html += '<label class="xt-check-label2 pull-right margin-top-10 ' + (patient_label.isBatch ? "hide" : "")
                            + '" label-patient-edit onclick="patient_label.editPatientLabel(' + item.patientId + ')">编辑</label>';

            html += '<div class="fill-parent float-left margin-top-10">';
            if (!isEmptyObject(item.labels)) {
                for (var a = 0; a < item.labels.length; a++) {
                    var label = item.labels[a];
                    if (a < 2) {
                        html += '<span class="tag clearfix" >' + label.name + '</span>';
                    } else {
                        html += '<span class="tag clearfix"  onclick="patient_label.editPatientLabel(' + item.patientId + ')">更多 </span>';
                    }
                }
            }
            html += '</div>';
            html += '</div>';
            html += '</div>';
        }
        return html;
    },
    /**
     * 取消批量设定功能
     */
    cancelBatch : function() {
        $("#label_batch_option").hide();
        $("#label_batch_btn").show();
        $("#label_manage_btn").show();
        $("#load_patient_label").find("[label-patient-edit]").removeClass("hide");
        $("#load_patient_label").find("[label-patient]").removeClass("bq_check");
        // 清空选中label
        $("#label_patient_batch_check_label").find("[label-id]").removeClass("active");
        this.isBatch = false;
    },
    /**
     * 批量设定
     */
    showBatchSet : function() {
        var checkedPatients = $("#load_patient_label").find("[label-patient].bq_check");
        if (checkedPatients.length == 0) {
            showWarn("请选择需要设定的患者");
            return false;
        }
        this.setDialogHeight("dialog");
        var patientIds = "";
        var patientName = "";
        checkedPatients.each(function() {
            patientIds += $(this).attr("label-patient") + ",";
            patientName += $(this).find("input[name='patientName']").val() + ",";
        });
        patientIds = patientIds.substring(0, patientIds.length - 1);
        patientName = patientName.substring(0, patientName.length - 1);
        $("#dialog").find("input[name='patientIds']").val(patientIds);
        $("#label_patient_batch_check_name").html(patientName);
        // 清空选中label
        $("#label_patient_batch_check_label").find("[label-id]").removeClass("active");
        $("#dialog").modal("show");
    },
    /**
     * 保存关联
     */
    saveRef : function(dialogId, labelId) {
        var labels = $("#" + labelId).find("[label-id].active");
        if (labels.length == 0) {
            showWarn("请选择关联的标签");
            return false;
        }
        var labelIds = "";
        labels.each(function() {
            labelIds += $(this).attr('label-id') + ",";
        });
        labelIds = labelIds.substring(0, labelIds.length - 1);
        var param = {
            labelIds : labelIds,
            patientIds : $("#" + dialogId).find("input[name='patientIds']").val()
        };
        $.ajax({
            url : ctx + "/patient/label/saveRef.shtml",
            data : param,
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    if (patient_label.isBatch) {
                        patient_label.cancelBatch();
                    }
                    showTips("保存成功");
                    patient_label.getPatient(true);
                    $("#" + dialogId).modal("hide");
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 编辑患者标签
     * 
     * @param patientId
     */
    editPatientLabel : function(patientId) {
        this.setDialogHeight("dialogPatient");
        $.ajax({
            url : ctx + "/patient/label/getByPatientId.shtml",
            data : {
                patientId : patientId
            },
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    $("#dialogPatient").find("input[name='patientIds']").val(patientId);
                    $("#dialogPatient_label_check").find("[label-id]").removeClass("active");
                    var labels = data.rs;
                    var labelName = "";
                    if (!isEmptyObject(labels)) {
                        $("#dialogPatient_label_check").find("[label-id]").each(function() {
                            var id = $(this).attr("label-id");
                            for (var i = 0; i < labels.length; i++) {
                                var label = labels[i];
                                if (label.id == id) {
                                    $(this).addClass("active");
                                    labelName += label.name + ",";
                                    break;
                                }
                            }
                        });
                    }
                    labelName = labelName.substring(0, labelName.length - 1);
                    $("#dialogPatient_label_name").text(labelName);
                    $("#dialogPatient").modal("show");
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 显示添加dialog
     */
    showAddDialog : function() {
        this.setDialogHeight("dialogLabel");
        $("#template_dialogLabel_label_name").val("");
        $("#errorMsg_spanId").html("");
        $("#dialogLabel").modal("show");
    },
    /**
     * 添加标签
     */
    saveLabel : function() {
        var name = $("#template_dialogLabel_label_name").val();
        if (isEmpty(name)) {
            $("#errorMsg_spanId").html("标签名称不能为空");
            return false;
        }
        // 不能添加默认项全部
        if (name == '全部') {
            $("#errorMsg_spanId").html("标签名\"全部\"为默认项 ,请重新输入.");
            return false;
        }
        $("#errorMsg_spanId").html("");
        $.ajax({
            url : ctx + "/patient/label/save.shtml",
            data : {
                name : name
            },
            type : "post",
            loading : true,
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    showTips("保存成功");
                    patient_label.getAllLabel();
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
    },
    /**
     * 设置弹框的高度
     * 
     * @param dialogId
     */
    setDialogHeight : function(dialogId) {
        // show dialog
        $("#" + dialogId).modal("show");
        // 设置dialog离顶部高度
        $("#" + dialogId).css("margin", "-30px auto");
        // 设置dialog宽度为80%
        $("#" + dialogId + " .modal-dialog").css("width", "800px");
        // 设置dialog 内容高度
        var dialog_height = 535;
        $("#" + dialogId + " .modal-content").css("height", dialog_height + "px");
        $("#" + dialogId + " .dialog-wrap .list-group").css("height", (dialog_height - 118) + "px");
    },
    /**
     * 显示患者电子病历
     */
    showPatientEmr : function(id, name) {
        var url = "";
        var sysOwner = $("#sysOwner").val();
        var pd_addr = $("#pd_addr").val();
        var pops_addr = $("#pops_addr").val();
        if (sysOwner == "PD") { // 跳转到腹透患者首页
            url = pd_addr + "/patientHome/view.shtml?id=" + id;
        } else if (sysOwner == "POPS") {
            url = pops_addr + "/patientHome/view.shtml?id=" + id;
        } else if (sysOwner == "CKD") {
            url = $("#ckd_addr").val() + "/ckdPatientHome/view.shtml?id=" + id;
        }
        if (existsFunction("parent.addTab")) {
            parent.addTab({
                id : id,
                name : name,
                url : url,
                refresh : "1"
            });
        } else {
            window.location.href = url;
        }
    }
};