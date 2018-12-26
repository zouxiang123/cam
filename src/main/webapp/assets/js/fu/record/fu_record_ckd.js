var fu_record_ckd = {
    init : function() {
        // 添加时间选择
        layui.use([ 'laydate' ], function() {
            var laydate = layui.laydate;
            $('#fuRecordCkdForm').find("[datepicker]").each(function() {
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", "confirm" ]
                });
            });
        });
        $.ajax({
            url : ctx + "/system/getDoctorAndNurse.shtml",
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                if (data.status == "1") {
                    var doctorList = data.rs.doctorList;
                    var nurseList = data.rs.nurseList;
                    for (var i = 0; i < doctorList.length; i++) {
                        $("#fuRecordCkdForm").find("[name='doctorId']").append(
                                        "<option value='" + doctorList[i].id + "'>" + doctorList[i].name + "</option>");
                    }
                    for (var i = 0; i < nurseList.length; i++) {
                        $("#fuRecordCkdForm").find("[name='nurseId']").append(
                                        "<option value='" + nurseList[i].id + "'>" + nurseList[i].name + "</option>");
                    }
                } else {
                    showWarn(data.errmsg);
                }
            }
        });
        this.addValidate();
    },
    /**
     * 添加药物治疗情况
     */
    addDrugTreatment : function() {
        var index = $("#drugTreatmentListDiv").find("[data-drug]").length;
        if (index >= 8) {
            showWarn("最多只能添加8条药物使用记录");
            return false;
        }
        var html = '';
        html += '<div class="u-list-text mt-4" data-drug>';
        html += '<div class="left text-left-imp">记录' + ++index + '：</div>';
        html += '<div class="right">';
        html += '  <input type="text" name="drugTreatmentList" style="width: calc(100% - 40px)" maxlength="128">';
        html += '  <button type="button" class="u-btn-red u-float-r mt-14" onclick="$(this).parents(\'[data-drug]\').remove()" text>删除</button>';
        html += '</div>';
        html += '</div>';
        $("#drugTreatmentListDiv").append(html);
    },
    /**
     * 添加校验
     */
    addValidate : function() {
        $('#fuRecordCkdForm').validate({
            rules : {
                recordDateShow : {
                    required : [ "记录日期" ]
                },
                sbpHome : {
                    isPInt : [ "收缩压(家)" ],
                    customRange : [ 1, 9999, "收缩压(家)" ]
                },
                dbpHome : {
                    isPInt : [ "舒张压(家)" ],
                    customRange : [ 1, 9999, "舒张压(家)" ]
                },
                sbpOp : {
                    isPInt : [ "收缩压(门)" ],
                    customRange : [ 1, 9999, "收缩压(门)" ]
                },
                dbpOp : {
                    isPInt : [ "舒张压(门)" ],
                    customRange : [ 1, 9999, "舒张压(门)" ]
                },
                hrHome : {
                    isPInt : [ "心率(家)" ],
                    customRange : [ 1, 9999, "心率(家)" ]
                },
                hrOp : {
                    isPInt : [ "心率(门)" ],
                    customRange : [ 1, 9999, "心率(门)" ]
                },
                weight : {
                    number : [ "体重" ],
                    customRange : [ 0.01, 999, "体重" ]
                },
                bmi : {
                    number : [ "BMI" ],
                    customRange : [ 0.01, 999, "BMI" ]
                },
                urineVol : {
                    isPInt : [ "尿量" ],
                    customRange : [ 1, 99999, "尿量" ]
                },
                shit : {
                    isPInt : [ "大便" ],
                    customRange : [ 1, 99999, "大便" ]
                },
                scr : {
                    number : [ "血肌酐" ],
                    customRange : [ 0.01, 99999, "血肌酐" ]
                },
                gfr : {
                    isPInt : [ "GFR" ],
                    customRange : [ 1, 99999, "GFR" ]
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
    },
    /**
     * 保存数据
     * 
     * @param callback
     *            保存成功回调
     */
    save : function(callback) {
        if (!$("#fuRecordCkdForm").valid())
            return;
        $.ajax({
            url : ctx + "/fuRecordCkd/save.shtml",
            data : $("#fuRecordCkdForm").serialize(),
            type : "post",
            dataType : "json",
            success : function(data) { // ajax返回的数据
                if (data.status == "1") {
                    if (!isEmpty(callback)) {
                        callback();
                    }
                    showTips();
                }
            }
        });
    }
};
