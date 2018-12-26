var batch_apply_dialog = {
    /**
     * 所有患者缓存
     */
    items : {},
    /**
     * 初始化批量应用dialog
     */
    init : function() {
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            laydate.render({
                min : new Date().pattern("yyyy-MM-dd"),
                elem : "#batchSetForm input[name='dateStr']",
                theme : '#31AAFF',
                btns : [ 'now', 'confirm' ]
            });
        });
        this.addEvents();
        this.addValidate();
    },
    /**
     * 注册事件
     */
    addEvents : function() {
        // 选择患者事件
        $("#batchApplyDailog_leftPatientList").on("click", ":checkbox", function() {
            var idStr = "";
            $("#batchApplyDailog_rightPatientList").empty();
            var checkedEl = $("#batchApplyDailog_leftPatientList").find(":checkbox:checked");
            var trHtml = "";
            checkedEl.each(function() {
                idStr += $(this).val() + ",";
                var item = batch_apply_dialog.items[$(this).val()];
                trHtml += '<tr data-item="' + item.id + '">';
                trHtml += '<td>' + item.name + '</td>';
                trHtml += '<td><div><span>' + item.sexShow + '</span><span>' + convertEmpty(item.age) + '岁</span></div></td>';
                trHtml += '<td><div class="table-div" title="' + convertEmpty(item.diagnosisStr) + '">';
                trHtml += convertEmpty(item.diagnosisStr) + '</div></td>';
                trHtml += '<td>';
                trHtml += '<button type="button" class="u-btn-red" onclick="batch_apply_dialog.delEl(' + item.id + ')" text>删除</button>';
                trHtml += '</td>';
                trHtml += '</tr>';
            });
            $("#batchApplyDailog_rightPatientList").html(trHtml);
            if (idStr.length > 0) {
                idStr = idStr.substring(0, idStr.length - 1);
            }
            $("#batchSetForm").find("input[name='idStr']").val(idStr);
        });
    },
    /**
     * 删除已选中患者
     * 
     * @param id
     */
    delEl : function(id) {
        $("#batchApplyDailog_leftPatientList").find(":checkbox[value='" + id + "']").prop("checked", false);
        $("#batchApplyDailog_rightPatientList").find("[data-item='" + id + "']").remove();
    },
    /**
     * 显示dialog
     * 
     * @param id
     *            模板id
     * @param name
     *            模板名称
     * @param sysOwner
     *            所属系统
     */
    show : function(id, name, sysOwner) {
        $("#batchApplyDailog_rightPatientList").empty();
        $("#batchSetForm").find("input[name='id']").val(convertEmpty(id));
        // 默认当前时间
        $("#batchSetForm").find("input[name='dateStr']").val(new Date().pattern("yyyy-MM-dd"));
        $("#batchApplyDailog").find("[data-title]").text(name + "使用");
        $.ajax({
            url : ctx + "/fuPatientSchedule/getUnUseTemplatePatients.shtml",
            type : "post",
            data : {
                sysOwner : sysOwner
            },
            dataType : "json",
            success : function(data) {
                batch_apply_dialog.items = {};
                var html = "";
                if (data.status == 1 && !isEmptyObject(data.items)) {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        batch_apply_dialog.items[item.id] = item;
                        html += '<tr data-item="' + item.id + '">';
                        html += '<td data-name><label class="u-checkbox"><input type="checkbox" name="patientId" value="' + item.id
                                        + '"/><span class="icon-checkbox" ></span>' + item.name + '</label></td>';
                        html += '<td><div><span>' + item.sexShow + '</span><span>' + convertEmpty(item.age) + '岁</span></div>';
                        html += '<span class="hide" >' + convertEmpty(item.spellInitials) + '</span>';
                        html += '</td>';
                        html += '<td><div class="table-div" title="' + convertEmpty(item.diagnosisStr) + '">' + convertEmpty(item.diagnosisStr)
                                        + '</div></td>';
                        html += '</tr>';
                    }
                }
                $("#batchApplyDailog_leftPatientList").html(html);
                $('#batchApplyDailog_leftSearchDiv').fastLiveFilter('#batchApplyDailog_leftPatientList', {
                    timeout : 300
                });
                popDialog("#batchApplyDailog");
            }
        });
    },
    /**
     * 保存
     */
    save : function() {
        if (!$("#batchSetForm").valid())
            return false;
        $.ajax({
            url : ctx + "/fuScheduleTemplate/batchSet.shtml",
            type : "post",
            data : $("#batchSetForm").serialize(),
            dataType : "json",
            loadingMsg : "正在使用，请稍等",
            success : function(data) {
                if (data.status == 1) {
                    showTips("使用成功");
                    hiddenMe($("#batchApplyDailog"));
                } else {
                    showWarn("请选择应用患者");
                }
            }
        });
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#batchSetForm').validate({
            rules : {
                dateStr : {
                    required : [ "随访开始时间" ]
                }
            },
            showErrors : function(errorMap, errorList) {
                if (errorList.length > 0) {
                    $(errorList[0].element).focus();
                }
                this.defaultShowErrors();
            },
            errorPlacement : function(error, element) {
                var obj = getValidateErrorDisplayEl($(element));
                $(error).css("display", "block");
                obj.find("[data-error]").append(error);
            }
        });
    }
};