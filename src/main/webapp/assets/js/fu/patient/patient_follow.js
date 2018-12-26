var follow_obj = {
    type : null,
    currentPageParam : null,
    defaultPageParam : {
        pageNo : 1,
        pageSize : 25,
    },
    // 患者对应的更多按钮缓存
    moreBtns : {},
    /**
     * 初始化
     * 
     * @param type
     *            默认类别
     */
    init : function(type) {
        if (!isEmpty(type))
            this.type = type;
        follow_obj.getPatients();
        follow_obj.addEvents();
    },
    /**
     * 事件注册
     */
    addEvents : function() {
        $('#queryDiv').find("[data-type]").on("click", function() {
            $(this).addClass("active").siblings().removeClass("active");
            follow_obj.getPatients();
        });
        $("#patientSearch").on("change", function() {
            follow_obj.getPatients();
        });
        $("html").on("click", function(e) {
            $("#moreListDiv").hide();
            $(".bg-halfgray").removeClass();
        });

        $("#patientList").on("click", "[data-more]", function(e) {
            e.stopPropagation();
            var btns = follow_obj.moreBtns[$(this).data("more")];
            $("#moreListDiv").find("ul").empty();
            for (var i = 0; i < btns.length; i++) {
                $("#moreListDiv").find("ul").append('<li onclick="' + btns[i].event + '">' + btns[i].title + '</li>');
            }
            dynamicDialog2('#tableBodyDiv', '#moreListDiv', $(this), true);
            $(this).parent().parent().addClass("bg-halfgray");
            $(this).parent().parent().siblings().removeClass("bg-halfgray");
        });
    },
    /**
     * 获取患者列表
     */
    getPatients : function() {
        var btnType = isEmpty(this.type) ? $("#queryDiv").find("[data-type].active").data("type") : this.type;
        var param = {
            sysOwner : $("#sysOwner").val(),
            type : btnType
        };
        var name = $("#patientSearch").val();
        if (!isEmpty(name)) {
            param.searchStr = name;
        }
        if (!isEmpty(this.type)) {
            var followType = $("#queryDiv").find("[data-type].active").data("type");
            if (!isEmpty(followType)) {
                param.followType = followType;
            }
        }
        $.extend(param, isEmptyObject(follow_obj.currentPageParam) ? this.defaultPageParam : follow_obj.currentPageParam);
        var url = patient_follow_extend.patient_list_url;
        if (isEmpty(url)) {
            url = "/fuPatientFollow/getPatients.shtml";
        }
        $.ajax({
            url : ctx + url,
            type : "post",
            data : param,
            dataType : "json",
            loading : true,
            success : function(data) {
                follow_obj.moreBtns = {}; // clear Cache
                var html = "";
                var totalRecord = 0;
                var pageNo = 0;
                if (data.status == "1" && !isEmptyObject(data.rs)) {
                    totalRecord = data.rs.totalRecord;
                    pageNo = data.rs.pageNo;
                    var items = data.rs.results;
                    for (var i = 0; i < items.length; i++) {
                        var item = items[i];
                        html += follow_obj.getPatientHtml(item, i);
                    }
                }
                $("#patientList").html(html);
                layui.use('laypage', function() {
                    var laypage = layui.laypage;
                    laypage.render({
                        elem : 'pagingDiv', // id
                        count : totalRecord, // 数据总数
                        limit : param.pageSize,
                        curr : pageNo,
                        layout : [ 'prev', 'page', 'next', 'count' ],
                        // groups : 4,
                        theme : '#31AAFF',
                        jump : function(obj, first) {
                            if (!first) {
                                follow_obj.currentPageParam = {
                                    pageNo : obj.curr,
                                    pageSize : obj.limit
                                };
                                follow_obj.getPatients();
                            }
                        }
                    });
                });
            }
        });
    },
    /**
     * 获取单条记录的html
     * 
     * @param item
     * @param index
     */
    getPatientHtml : function(item, index) {
        var type = $("#queryDiv").find("[data-type].active").data("type");
        var html = '';
        html += '<tr data-patient="' + item.id + '" data-recordid="' + item.recordId + '" style="border: none;border-bottom: 1px solid #D9E0E6;">';
        html += '<td class="xtt-5">' + ((index + 1) < 10 ? ("0" + (index + 1)) : (index + 1)) + '</td>';
        html += '<td class="xtt-10">';
        html += '<button type="button" class="u-btn-blue" onclick="follow_obj.openPatientEmr(' + item.id + ',\'' + item.name + '\');" text>'
                        + item.name + '</button>';
        html += '</td>';
        html += '<td class="xtt-5">' + item.sexShow + '</td>';
        html += '<td class="xtt-5">' + convertEmpty(item.age) + '</td>';
        html += '<td>' + convertEmpty(item.diagnosisStr) + '</td>';
        html += '<td class="xtt-11">' + convertEmpty(item.latestOperationTimeShow) + '</td>';

        html += '<td class="xtt-14">';
        if (isEmpty(item.followDate)) {
            html += '<button type="button" class="u-btn-blue" onclick="follow_obj.showBatchSet(' + item.id + ');" text>设定随访计划</button>';
        } else {
            html += new Date(item.followDate).pattern("yyyy-MM-dd");
            if (hasPermission("FU_patient_schedule")) {
                html += '<button type="button" class="u-btn-blue" style="margin-left:15px;" onclick=\'follow_obj.showPlan(' + item.id + ',"'
                                + item.name + '");\' text="">编辑</button>';
            }
        }
        html += '</td>';
        html += '<td class="xtt-42">';
        var btns = follow_obj.getBtns(item);
        if (btns.length > 0) {
            var btnLength = btns.length;
            for (var t = 0; t < btnLength; t++) {
                var btn = btns[t];
                if (t == 4) { // 如果按钮数大于5个，则第5个按钮显示为更多
                    if (btnLength > 5) {
                        html += '<button type="button" class="u-btn-blue text-ellipsis" data-more="' + item.id
                                        + '" title="更多" style="width: 30px" text>更多</button>';
                    } else {
                        html += '<button type="button" class="u-btn-blue text-ellipsis" style="width: 52px" title="' + btn.title + '" onclick="'
                                        + btn.event + '" text>' + btn.title + '</button>';
                    }
                    break;
                }
                html += '<button type="button" class="u-btn-blue text-ellipsis" title="' + btn.title + '" onclick="' + btn.event + '" text>'
                                + btn.title + '</button>';
            }
            if (btnLength > 5) {
                follow_obj.moreBtns[item.id] = btns.slice(4);
            }
        }
        html += '</td>';
        html += '</tr>';
        return html;
    },
    /**
     * 获取按钮列表
     */
    getBtns : function(item) {
        var btns = [];
        var id = item.id;
        var name = item.name;
        var sysOwner = $("#sysOwner").val();
        btns = patient_follow_extend.getBtns(id, name, item.scheduleId);
        if (!isEmpty(item.scheduleId)) {
            btns.push({
                event : "follow_obj.openFollow('" + item.recordId + "','" + name + "','" + item.scheduleId + "')",
                title : "随访单"
            });
        }
        return btns;
    },
    /**
     * 显示患者随访计划
     */
    showPlan : function(patientId, patientName) {
        var url = getPermissionUrlByKey("FU_patient_schedule");
        url = ctx + "/" + url + ".shtml?patientId=" + patientId + "&sysOwner=" + $("#sysOwner").val();
        showIframeDialog({
            title1 : "患者：" + patientName,
            title : "随访计划",
            url : url,
            saveCall : function(iframeWin) {
                iframeWin.patient_schedule.save(function(id) {
                    hiddenMe($("#iframeDialog"));
                    follow_obj.getPatients();
                });
            }
        });
    },
    /**
     * 显示批量设定dialog
     * 
     * @param id
     */
    showBatchSet : function(id) {
        apply_schedule_dialog.show(id, $("#ownerId").val(), $("#sysOwner").val(), function() {
            follow_obj.getPatients();
        });
    },
    /**
     * 打开随访记录id
     * 
     * @param id
     *            随访记录id
     * @param patientName
     *            患者名称
     * @param scheduleId
     *            计划id
     */
    openFollow : function(id, patientName, scheduleId) {
        $.ajax({
            url : ctx + "/fuPatientSchedule/getById.shtml",
            type : "post",
            data : "id=" + scheduleId,
            dataType : "json",
            loading : true,
            success : function(data) {
                if (data.status == 1) {
                    if (data.record == null) {
                        showWarn("计划已被修改，请刷新后重试");
                    } else {
                        var sysOwner = $("#sysOwner").val();
                        showIframeDialog({
                            title : "随访单",
                            title1 : "患者：" + patientName,
                            url : ctx + "/fuRecord/view.shtml?scheduleId=" + scheduleId + "&sysOwner=" + sysOwner
                                            + (isEmpty(id) ? "" : ("&id=" + id)),
                            saveCall : function(iframeWin) {
                                // 表单编号
                                var formCode = data.record.followFormCode;
                                // 回调函数
                                var callback = function(id) {
                                    hiddenMe("#iframeDialog");
                                    follow_obj.getPatients();
                                };
                                if (formCode == "POPS_form") {
                                    iframeWin.fu_record_pops.save(callback);
                                } else if (formCode == "PD_form") {
                                    iframeWin.fu_record_pd.save(callback);
                                } else if (formCode == "CKD_form") {
                                    iframeWin.fu_record_ckd.save(callback);
                                } else if (formCode == "template_form") {
                                    iframeWin.fu_record_template.save(callback);
                                } else if (formCode == "PD_form_01") {
                                    iframeWin.fu_record_detail_pd_whzx_edit.save(callback);
                                }
                            }
                        });
                    }
                }
            }
        });
    },
    /**
     * 打开电子病历
     * 
     * @param id
     * @param name
     */
    openPatientEmr : function(id, name) {
        var sysOwner = $("#sysOwner").val();
        var pd_addr = $("#pd_addr").val();
        var pops_addr = $("#pops_addr").val();
        var url = ctx + patient_follow_extend.patient_emr_url + "?id=" + id;
        this.openUrl(id, name, url, '0');
    },
    /**
     * 打开页面
     */
    openUrl : function(id, name, url, refresh) {
        if (existsFunction("parent.addTab")) {
            parent.addTab({
                id : id,
                name : name,
                url : url,
                refresh : isEmpty(refresh) ? "1" : refresh
            });
        } else {
            window.location.href = url;
        }
    }
};

var hisDialog;
function dynamicDialog2(ancestor, theName, ev, con) {
    if (hisDialog) {
        $(hisDialog).hide();
    }
    $(theName).show();
    var location = $(ev).position();
    var l = location.left + "px";
    var t = location.top + $(ev).height() - 27 + "px";
    if (con) {
        if ($(ancestor).height() - (location.top - $(ancestor).scrollTop() + $(ev).height() + 10) < $(theName).height()) {
            t = location.top - $(theName).height() + 26 + "px";
        }
        var w = $(ancestor).width() - (location.left - $(ancestor).scrollLeft());
        if (w < $(theName).width()) {
            var l = location.left - ($(theName).width() - w) - 86 + "px";
        }
    }
    $(theName).css({
        "left" : l,
        "top" : t
    });
}