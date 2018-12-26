$(function() {
    patient_schedule.init();
});
var patient_schedule = {
    followTypes : null,
    followForms : null,
    details : [],
    sysOwner : null,
    patientId : null,
    init : function() {
        this.sysOwner = $("#sysOwner").val();
        this.patientId = $("#patientId").val();
        this.addEvents();
        this.getList();
    },
    addEvents : function() {
        /**
         * 页面上编辑事件，同步更新数据到缓存中
         */
        $("#patientSchedulePlanList").on("change", "[data-change]", function() {            
            var key = $(this).data("change");
            var id = $(this).parents("[data-recordid]").data("recordid");
            var items = patient_schedule.details;
            for (var i = 0; i < items.length; i++) {
                if (items[i].id == id) {
                    items[i][key] = $(this).val();
                    if (key == "taskInterval") {// 如果是变更天数，同时变更当前记录及后面记录的随访日期
                        patient_schedule.updateFollowDate(i, items[i - 1].followDateShow);
                    }
                    break;
                }
            }
        });
    },
    /**
     * 获取计划列表
     */
    getList : function() {
        $.ajax({
            url : ctx + "/fuPatientSchedule/listNotUse.shtml",
            type : "post",
            data : {
                patientId : this.patientId,
                sysOwner : this.sysOwner
            },
            dataType : "json",
            loading : true,
            success : function(data) {
                patient_schedule.details = [];
                if (data.status == '1') {
                    patient_schedule.followTypes = data.followTypes;
                    patient_schedule.followForms = data.followForms;
                    for (var i = 0; i < data.items.length; i++) {
                        patient_schedule.details.push(data.items[i]);
                    }
                }
                patient_schedule.getContent();
            }
        });
    },

    /**
     * 获取单个模板的html
     * 
     * @param item
     * @returns {String}
     */
    getSingleHtml : function(item) {
        var html = "";
        var index = item.index;
        var isFirst = index == 0;
        var no = index < 9 ? ("0" + (index + 1)) : (index + 1);
        if (!isFirst) {
            html += '<div class="line-vertical" style="top: 0px;" data-recordid="' + item.id + '"></div>';
        }
        html += '<div class="border-gray p-12" data-recordid="' + item.id + '">';
        html += '<input type="hidden" name="details[' + index + '].fkPatientId" value="' + item.fkPatientId + '"/>';
        html += '<input type="hidden" name="details[' + index + '].intervalType" value="' + item.intervalType + '"/>';
        html += '<input type="hidden" name="details[' + index + '].sysOwner" value="' + item.sysOwner + '"/>';
        html += '<div class="bb-dashed pb-10">';
        html += '<span class="fs-16 fw-bold">NO:' + no + ' ' + item.followDateShow + '</span>';
        html += '<span class="fs-16 ml-8">' + patient_schedule.getWeekDay(item.followDateShow) + '</span>';
        html += '<button type="button" class="u-btn-red u-float-r" text onclick="patient_schedule.showDelDialog(this,' + item.id + ',' + index
                        + ');"">删除</button>';
        html += '</div>';
        if (isFirst) {
            html += '<input type="hidden" name="details[' + index + '].taskInterval" value="' + index + '" />';
            html += '<div class="mt-10">';
            html += '<span>随访时间：</span>';
            html += '<input type="text" name="details[' + index + '].followDateShow" value="' + item.followDateShow
                            + '" required data-msg-required="随访时间" data-firstdate readonly>';
            html += '</div>';
        } else {           
            html += '<div class="mt-10">';
            html += '<span>随访时间：</span>';
            html += '<input type="text" name="details[' + index + '].followDateShow" value="' + item.followDateShow
                            + '" required data-msg-required="随访时间" data-firstdate readonly>';
            html += '</div>';            
            html += '<div class="mt-10">';
            html += '<span>距离上次：</span>';
            html += '<input type="text" name="details[' + index + '].taskInterval" data-change="taskInterval" value="' + item.taskInterval
                            + '" required data-msg-required="天数不能为空" data-rule-isPInt="true" data-msg-isPInt="天数的值无效" maxlength="6">';
            html += '<span class="opacity-5 ml-8">天</span>';
            html += '</div>';
        }
        html += '<div class="mt-10">';
        html += '<span>随访类型：</span>';
        html += '<label class="u-select">';
        html += '<select name="details[' + index + '].followType" data-change="followType" data-followtype required data-msg-required="请选择随访类型">';
        var followTypes = patient_schedule.followTypes;
        for (var i = 0; i < followTypes.length; i++) {
            var type = followTypes[i];
            html += '<option value="' + type.itemCode + '" ' + (type.itemCode == item.followType ? "selected" : "") + '>' + type.itemName
                            + '</option>';
        }
        html += '</select>';
        html += '</label>';
        html += '</div>';

        html += '<div class="mt-10">';
        html += '<span>随访表单：</span>';
        html += '<label class="u-select">';
        html += '<select name="details[' + index + '].followFormCode" data-change="followFormCode" required data-msg-required="请选择随访表单">';
        var followForms = patient_schedule.followForms;
        for (var i = 0; i < followForms.length; i++) {
            var form = followForms[i];
            html += '<option value="' + form.itemCode + '" ' + (form.itemCode == item.followFormCode ? "selected" : "") + '>' + form.itemName
                            + '</option>';
        }
        html += '</select>';
        html += '</label>';
        html += '</div>';
        html += '</div>';
        return html;
    },
    /**
     * 更新计划的随访日期
     * 
     * @param index
     *            索引位置
     * @param dateStr
     *            开始日期的值
     */
    updateFollowDate : function(index, dateStr) {        
        var followDate = this.strToDate(dateStr);
        for (var i = index; i < this.details.length; i++) {
            var item = this.details[i];            
            followDate.setDate(followDate.getDate() + parseInt(item.taskInterval));
            item.followDateShow = followDate.pattern("yyyy-MM-dd");            
        }
        this.getContent();
    },
    /**
     * 生成内容
     */
    getContent : function() {
        var items = this.details;
        var html = "";
        for (var i = 0; i < items.length; i++) {
            var item = items[i];
            item.index = i;
            html += patient_schedule.getSingleHtml(item);
        }
        $("#patientSchedulePlanList").html(html);
        layui.use('laydate', function() {
            var laydate = layui.laydate;
            $("#patientSchedulePlanList").find("[data-firstdate]").each(function(index) {                
                laydate.render({
                    elem : this,
                    theme : '#31AAFF',
                    btns : [ "now", 'confirm' ],
                    done : function(date) {
                        var items = patient_schedule.details;
                        var preDate=date;
                        for (var i = 0; i < items.length; i++) {
                            if(i==index && i!=0){
                                preDate=items[i-1].followDateShow;
                                items[i].taskInterval=patient_schedule.daysBetween(preDate,date);
                            }
                        }                                                             
                        // 更新首次及以后的随访日期
                        patient_schedule.updateFollowDate(index, preDate);
                    }
                });
            });
        });
    },
    /**
     * 显示添加dialog
     */
    showAdd : function() {
        detail_add_dialog.show(this.followTypes, this.followForms, function(data) {
            patient_schedule.addElement(data);
        });
    },
    /**
     * 添加计划内容
     * 
     * @param data
     */
    addElement : function(data) {
        if (!isEmptyObject(data) && data.count > 0) {
            var index = this.details.length;
            var followDate = new Date();
            var id = new Date().getTime();
            if (index > 0) {// 如果不是添加第一个
                var latest = this.details[index - 1];
                followDate = this.strToDate(latest.followDateShow);
                id = latest.id + 1;
            }
            for (var i = 0; i < data.count; i++) {
                var item = {
                    id : id + i,
                    index : index + i,
                    sysOwner : this.sysOwner,
                    fkPatientId : this.patientId
                };
                $.extend(item, data);
                followDate.setDate(followDate.getDate() + parseInt(item.taskInterval));
                item.followDateShow = followDate.pattern("yyyy-MM-dd");                
                this.details.push(item);
            }
            this.getContent();
        }
    },
    /**
     * 显示删除dialog
     * 
     * @param id
     * @param index
     */
    showDelDialog : function(el, id, index) {
        var name = "";
        var followTypeName = $(el).parents("[data-recordid='" + id + "']").find("[data-followtype]").find("option:selected").text();
        var no = index < 9 ? ("0" + (index + 1)) : (index + 1);
        var tips = "您确定要删除编号为" + no + "的" + followTypeName + "吗？";
        system_dialog.show({
            content : "<span class='tipcontent'>" + tips + "</span>",
            confirmText : "删除",
            confirmCss : "u-btn-red",
            confirmCall : function() {
                patient_schedule.details.splice(index, 1);
                patient_schedule.getContent();
            }
        });
    },
    /**
     * 将字符串转换成日期支持（yyyy-MM-dd yyyy/MM/dd）
     * 
     * @param dateStr
     */
    strToDate : function(dateStr) {
        return new Date(Date.parse(dateStr.replace(/-/g, "/")));
    },
    /**
     * 保存计划
     */
    save : function(callback) {
        if (this.details.length == 0) {
            showAlert("随访计划不能为空");
            return false;
        }
        if (!$("#patientScheduleForm").valid()) {
            return false;
        }
        $.ajax({
            url : ctx + "/fuPatientSchedule/saveSchedule.shtml",
            type : "post",
            data : $("#patientScheduleForm").serialize(),
            dataType : "json",
            success : function(data) {
                if (data.status == 1) {
                    showTips("保存成功");
                    if (!isEmpty(callback)) {
                        callback();
                    }
                } else if (data.status == 2) {
                    showTips("患者计划不能为空");
                } else {
                    showTips("删除失败，请联系管理员");
                }
            }
        });
    },
    getWeekDay : function(dateStr) {
        if (isEmpty(dateStr)) {
            return "";
        }
        var date=this.strToDate(dateStr);
        var today = new Array('星期日', '星期一', '星期二', '星期三', '星期四', '星期五', '星期六');
        var curDate = new Date();
        curDate.setTime(date);
        var result = curDate.getDay();
        return today[result];
    },
    // 时间差
    daysBetween: function(sDate1,sDate2){
      // Date.parse() 解析一个日期时间字符串，并返回1970/1/1 午夜距离该日期时间的毫秒数
      var time1 = Date.parse(new Date(sDate1));
      var time2 = Date.parse(new Date(sDate2));
      var nDays = Math.abs(parseInt((time2 - time1)/1000/3600/24));
      return nDays;
      }
};