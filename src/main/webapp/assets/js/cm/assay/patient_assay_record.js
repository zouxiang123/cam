var paginationObject = null;
$(function() {
    $("#assaycardScroll").height($(window).height() - ($("#assaycardScroll").offset().top + 10));
    // 注册事件
    addEvents();
    // 初始化分页
    paginationObject = pagination.addPaging({
        bodyId : "assaycard",
        scrollEl : $("#assaycardScroll"),
        callback : function() {
            getAssayDateData(false);
        },
        pageSize : 20
    });
    // 默认加载当天前的30天内
    var date = new Date();
    date.setFullYear(date.getFullYear() - 1);
    date.setDate(date.getDate() + 1);
    $("#searchForm #startDate").val(date.pattern("yyyy-MM-dd"));
    $("#searchForm #endtDate").val(new Date().pattern("yyyy-MM-dd"));
    // 获取化验数据
    getAssayDateData(true);
});

/** 事件注册 */
function addEvents() {
    // 初始化时间控件(带时间段选择)
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        // 初始化时间控件(不带时间段选择)
        $("#searchForm #startDate,#searchForm #endtDate").each(function() {
            laydate.render({
                elem : this,
                theme : '#31AAFF',
                btns : [ "now", "confirm" ]
            });
        });
    });
    /**
     * 选择化验单
     */
    $('#assaycard').on("click", ".card", function() {
        $(this).addClass("active").siblings().removeClass("active");
        getAssayRecord();
    });
}

function assayRecordMouseOver(element) {
    $("#assayRecord .datagrid").addClass("hide");
    if ($(element).attr("data-valueType") == 1)
        $(element).find(".datagrid").removeClass("hide");
}
function assayRecordMouseOut() {
    $("#assayRecord .datagrid").addClass("hide");
}
/** 获取所有化验时间数据 */
function getAssayDateData(needResetPage) {
    if (needResetPage) {// 是否需要重置分页数据
        paginationObject.resetPaging();
    }
    var param = {
        fkPatientId : $("#patientId").val()
    };
    $.extend(param, $("#searchForm").serializeJson(), paginationObject.getPagingData());
    delete param.str;// 删除分页数据的str属性
    $.ajax({
        url : ctx + "/assay/patientAssayRecord/getAssayDateRecord.shtml",
        data : param,
        type : "post",
        loading : true,
        dataType : "json",
        success : function(data) {// ajax返回的数据
            var assayTimesRecordHtml = "";
            var assayRecordHtml = "";
            if (data.status == 1) {
                var labTimeFlag = data.labTimeFlag;
                if (!isEmpty(data.items)) {
                    for (var i = 0; i < data.items.length; i++) {
                        var item = data.items[i];
                        assayTimesRecordHtml += '<div class="card">';
                        assayTimesRecordHtml += '<div class="bb-line pl-14 pr-14 carditem pb-26 mt-10">';
                        assayTimesRecordHtml += '<span class="u-float-l text-ellipsis width-60pre fw-bold" title="' + convertEmpty(item.groupName)
                                        + '">' + convertEmpty(item.groupName) + '</span>';
                        assayTimesRecordHtml += '<span class="u-float-r text-ellipsis width-40pre"  title="' + convertEmpty(item.reqId) + '">'
                                        + convertEmpty(item.reqId) + '</span>';
                        assayTimesRecordHtml += '</div>';
                        assayTimesRecordHtml += '<input type="hidden" value="' + item.reqId + '" id="data_reqId">';
                        if (labTimeFlag == 1 || labTimeFlag == 3) {
                            assayTimesRecordHtml += '<div class="pl-14 pr-14 carditem">';
                            assayTimesRecordHtml += '<span class="mr-10">采集时间：</span>';
                            assayTimesRecordHtml += '<span>' + item.strSampleTime + '</span>';
                            assayTimesRecordHtml += '</div>';
                        }
                        if (labTimeFlag == 2 || labTimeFlag == 3) {
                            assayTimesRecordHtml += '<div class="pl-14 pr-14 carditem">';
                            assayTimesRecordHtml += '<span class="mr-10">报告时间：</span>';
                            assayTimesRecordHtml += '<span>' + item.strReportTime + '</span>';
                            assayTimesRecordHtml += '</div>';
                        }
                        assayTimesRecordHtml += '</div>';
                    }
                }
                // 如果左边化验单没数据时候，删除化验详单
                if (data.items.length == 0) {
                    $("#assayRecord").html('');
                }
                if (!isEmpty(data.records) && (data.records).length > 0 && (data.record.pageNo) == 1) {
                    assayRecordHtml = getAssayRecordListHtml(data.records);
                    $("#assayRecord").html(assayRecordHtml);
                }
            }
            $("#assaycard").append(assayTimesRecordHtml);
            paginationObject.setTotalPage(data.record.totalPage);
            // 默认选中第一个
            if (data.items.length > 0) {
                $("#assaycard .card:first").addClass("active").siblings().removeClass("active");
            }
        }
    });
}

/** 显示某个批次的数据 */
function getAssayRecord() {
    var reqId = $("#assaycard .card.active #data_reqId").val();
    $.ajax({
        url : ctx + "/assay/patientAssayRecord/getAssayRecord.shtml",
        data : {
            fkPatientId : $("#patientId").val(),
            reqId : reqId
        },
        type : "post",
        dataType : "json",
        loading : true,
        success : function(data) {// ajax返回的数据
            var assayRecordHtml = "";
            if (data.status == 1) {
                assayRecordHtml = getAssayRecordListHtml(data.records);
            }
            $("#assayRecord").html(assayRecordHtml);
        }
    });
}

/** 生成化验单列表数据 */
function getAssayRecordListHtml(items) {
    var assayRecordHtml = "";
    for (var t = 0; t < items.length; t++) {
        var item = items[t];
        if (!isEmpty(item.result)) {
            assayRecordHtml += '<tr data-valueType="' + convertEmpty(item.valueType)
                            + '" onmouseover="assayRecordMouseOver(this);" onmouseout="assayRecordMouseOut(this);">';
            assayRecordHtml += '<td style="width: 15%">' + convertEmpty(item.itemCode) + '</td>';
            assayRecordHtml += '<td style="width: 35%">' + convertEmpty(item.itemName) + '</td>';
            assayRecordHtml += '<td style="width: 13%">' + convertEmpty(item.result)
                            + '<i class="icon-statistics u-float-r mt-4 fc-blue datagrid hide" onclick=\'assay_hist_report.show(' + item.fkPatientId
                            + ',"' + convertEmpty(item.itemCode) + '","' + convertEmpty(item.itemName) + '","' + convertEmpty(item.unit)
                            + '")\' data-valueType="' + convertEmpty(item.valueType) + '"></i></td>';
            assayRecordHtml += '<td style="width: 8%">';
            if (item.resultTips == "3") {
                assayRecordHtml += '<div class="icon-upward fc-red"></div>';
            } else if (item.resultTips == "4") {
                assayRecordHtml += '<div class="icon-down fc-red"></div>';
            }
            assayRecordHtml += '</td>';
            assayRecordHtml += '<td style="width: 20%">' + convertEmpty(item.reference) + '</td>';
            assayRecordHtml += '<td style="width: 9%">' + convertEmpty(item.sampleClass) + '</td>';
            assayRecordHtml += '<td class="xtt-10">' + (item.diaAbFlag == '2' ? '是' : '否');
            if (!patientHasOutCome) {
                assayRecordHtml += '<button type="button" class="u-btn-blue u-float-r mt-4" text onclick=\'showAssayRecordDiaAbFlag("'
                                + item.diaAbFlag + '","' + item.reqId + '","' + item.inspectionId + '")\'>编辑</button>';
            }
            assayRecordHtml += '</td></tr>';
        }
    }
    if (items.length == 0) {
        $("#editAssayRecord").hide();
    } else {
        if (!items[0].flage) {// 手动添加的化验单
            $("#editAssayRecord").hide();
        } else {
            $("#editAssayRecord").show();
            $("#editAssayRecord").attr("onclick", "showAddDialog('" + item.reqId + "');");
        }
    }
    return assayRecordHtml;
}

/** 同步检查结果 */
function refreshAssayResult(element) {
    $.ajax({// 接口地址带租户id
        url : $("#url_if_lis").val() + "&downType=12&fkPatientId=" + $("#patientId").val(),
        type : "post",
        loading : true,
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data.status == 1) {
                showTips("同步成功");
                getAssayDateData(true);// 刷新检验数据
            }
        }
    });
}

/**
 * 显示添加dialog
 */
function showAddDialog(reqId) {
    if (isEmpty(reqId)) {
        assay_record_add.show($("#patientId").val(), function() {
            getAssayDateData(true);
        });
    } else {
        assay_record_add.edit(reqId, $("#patientId").val(), function() {
            getAssayDateData(true);
        });
    }
}
/**
 * 查询数据
 * 
 * @returns
 */
function searchSubmit() {
    var timeType = $('input:radio[name="dateType"]:checked').val();
    if (isEmpty(timeType)) {
        showWarn("请选择时间类型");
        return false;
    }
    getAssayDateData(true);
    hiddenMe("#searchDialog");
}

// 显示是否血透后弹框
function showAssayRecordDiaAbFlag(diaAbFlag, reqId, inspectionId) {
    $("#bakReqId").val(reqId);
    $("#bakDiaAbFlag").val(diaAbFlag);
    $("#bakInspectionId").val(inspectionId);
    $("#isAllToHDAfter").attr("checked", false);
    $("#diaAbFlagRadioDiv").find("input[name='diaAbFlag'][value='" + diaAbFlag + "']").prop("checked", true);
    popDialog("#assayRecordDiaAbFlag");
}
// 手动更新透前透后
function updateDiaAbFlag() {
    var diaAbFlag = $("#diaAbFlagRadioDiv").find('input[name=diaAbFlag]:checked').val();
    var bakDiaAbFlag = $("#bakDiaAbFlag").val();
    var isAllToHDAfter = $('input[name=isAllToHDAfter]:checked').val();
    if (diaAbFlag == bakDiaAbFlag && !isAllToHDAfter) {
        showTips("暂无修改内容");
        hiddenMe("#assayRecordDiaAbFlag");
        return;
    }
    var reqId = $("#bakReqId").val();
    var patientId = $("#patientId").val();
    var data = "diaAbFlag=" + diaAbFlag + "&reqId=" + reqId + "&fkPatientId=" + patientId;
    if (!isAllToHDAfter) {
        var inspectionId = $("#bakInspectionId").val();
        data += "&inspectionId=" + inspectionId;
    }
    $.ajax({
        url : ctx + "/assay/patientAssayRecord/updateHandDiaAbFlag.shtml",
        data : data,
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data.status) {
                getAssayRecord(true);
                showTips("编辑成功");
                hiddenMe("#assayRecordDiaAbFlag");
            }
        }
    });
}