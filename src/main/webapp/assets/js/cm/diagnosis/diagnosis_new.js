$(document).ready(function() {
    delFlag = $('#delFlag').val();
    // 初始化全部诊断数据
    loadDiagnosisData('', '');
    addDiagnosisEvents();
    // 初始化icd数据
    loadIcdData();
});
/**
 * 添加诊断事件
 */
function addDiagnosisEvents() {
    $("body").click(function() {
        if (!$("#addMedicalHistoryDialog").is(":hidden")) {
            $("#addMedicalHistoryDialog").hide();
        }
    });
    $("#addMe").click(function(event) {
        $("#addMedicalHistoryDialog").toggle();
        stopEventBubble(event); // 组织事件冒泡
    });
    /**
     * tab 切换事件
     */
    $(".diagnosis-btns").on("click", "button", function() {
        $(this).addClass("u-btn-blue").siblings().removeClass("u-btn-blue");
        var permission = $(this).data("permission-key");
        $(".diagnosis-content > div#" + permission).show().siblings().hide();
    });
    /**
     * 删除tab事件
     */
    $(".diagnosis-btns").on("click", ".icon-close", function(event) {
        var itemCode = $(this).parent().data('item-code');
        $(this).parent().remove();
        $(".diagnosis-btns > button[data-item-code='" + itemCode + "']").click();
        stopEventBubble(event);
    });
}

var diagnosis_types = [ {
    type : '',
    value : 0
}, {
    type : 'hist_first_dialysis',
    value : 1
}, {
    type : 'hist_surgery',
    value : 2
}, {
    type : 'hist_hd',
    value : 3
}, {
    type : 'hist_pd',
    value : 4
}, {
    type : 'hist_kt',
    value : 5
}, {
    type : 'hist_allergy',
    value : 6
}, {
    type : 'hist_pestilence',
    value : 7
}, {
    type : 'diagnosis_entity',
    value : 8
}, {
    type : 'hist_tumour',
    value : 9
} ];
var permission_keys = [ 'medical_history', 'clinical_diagnosis', 'pathologic_diagnosis', 'ckd_aki', 'cure_complication', 'other_diagnosis' ];
// 对应的显示名称
var dialogMapper = {
    "diagnosisHistFirstDialysis" : "showDiagnosisHistFirstDialysisDialog",
    "diagnosisHistSurgery" : "showDiagnosisHistSurgeryDialog",
    "diagnosisHistHd" : "showDiagnosisHistHdDialog",
    "diagnosisHistPd" : "showDiagnosisHistPdDialog",
    "diagnosisHistKt" : "showDiagnosisHistKtDialog",
    "diagnosisHistAllergy" : "showDiagnosisHistAllergyDialog",
    "diagnosisHistPestilence" : "showDiagnosisHistPestilenceDialog",
    "diagnosisHistTumour" : "showDiagnosisHistTumourDialog"
};
// 病史新增操作菜单项
var diagnosis_hist_actions = [ {
    itemCode : 'SCTX',
    itemName : '首次透析',
    dialogType : 'diagnosisHistFirstDialysis',
    background : '#e87b92',
    diagnosisType : 'hist_first_dialysis'
}, {
    itemCode : 'SS',
    itemName : '手术史',
    dialogType : 'diagnosisHistSurgery',
    background : '#eb9b18',
    diagnosisType : 'hist_surgery'
}, {
    itemCode : 'XT',
    itemName : '血透史',
    dialogType : 'diagnosisHistHd',
    background : '#82929d',
    diagnosisType : 'hist_hd'
}, {
    itemCode : 'FT',
    itemName : '腹透史',
    dialogType : 'diagnosisHistPd',
    background : '#71bfe8',
    diagnosisType : 'hist_pd'
}, {
    itemCode : 'SYZ',
    itemName : '肾移植史',
    dialogType : 'diagnosisHistKt',
    background : '#31d57d',
    diagnosisType : 'hist_kt'
}, {
    itemCode : 'GM',
    itemName : '过敏史',
    dialogType : 'diagnosisHistAllergy',
    background : '#8f6dac',
    diagnosisType : 'hist_allergy'
}, {
    itemCode : 'CRB',
    itemName : '传染病史',
    dialogType : 'diagnosisHistPestilence',
    background : '#cc52f1',
    diagnosisType : 'hist_pestilence'
}, {
    itemCode : 'TUMOUR',
    itemName : '肿瘤史',
    dialogType : 'diagnosisHistTumour',
    background : '#7FABCA',
    diagnosisType : 'hist_tumour'
} ];
var dictDiagnosisList = [];
/**
 * 初始化数据
 * 
 * @param diagnosisType
 */
function loadDiagnosisData(diagnosisType, itemCode) {
    var patientId = $("#patientId").val();
    $.ajax({
        url : ctx + "/patient/diagnosis/getDiagnosisData.shtml",
        data : {
            patientId : patientId,
            diagnosisType : diagnosisType,
            itemCode : itemCode
        },
        type : "post",
        dataType : "json",
        success : function(data) {// ajax返回的数据
            if (data) {
                buildDiagnosisView(data);
            }
        }
    });
}
// 生成诊断页面试图内容
function buildDiagnosisView(data) {
    data.diagnosisType = data.diagnosisType || '';
    var diagnosisTypeObj = {};
    $.each(diagnosis_types, function(i, v) {
        if (v.type == data.diagnosisType) {
            diagnosisTypeObj = v;
        }
    });
    switch (diagnosisTypeObj.value) {
    case 0: // 渲染所有诊断列表信息
        dictDiagnosisList = data.dictDiagnosisList; // 诊断字典数据结婚，树形结构，作为选项的数据源
        buildDictDiagnosisView(); // 渲染诊断字典结构数据
        buildDiagnosisHistFirstDialysisData(data);
        buildDiagnosisHistSurgeryData(data);
        buildDiagnosisHistHdData(data);
        buildDiagnosisHistPdData(data);
        buildDiagnosisHistKtData(data);
        buildDiagnosisHistAllergyData(data);
        buildDiagnosisHistPestilenceData(data);
        buildDiagnosisHistTumourData(data);
        buildDiagnosisDiagnosisEntityData(data);
        break;
    case 1: // 渲染'首次透析'内容
        buildDiagnosisHistFirstDialysisData(data);
        break;
    case 2: // 渲染'手术史'内容
        buildDiagnosisHistSurgeryData(data);
        break;
    case 3: // 渲染'血透史'内容
        buildDiagnosisHistHdData(data);
        break;
    case 4: // 渲染'腹透史'内容
        buildDiagnosisHistPdData(data);
        break;
    case 5: // 渲染'肾移植史'内容
        buildDiagnosisHistKtData(data);
        break;
    case 6: // 渲染'过敏史'内容
        buildDiagnosisHistAllergyData(data);
        break;
    case 7: // 渲染'传染病史'内容
        buildDiagnosisHistPestilenceData(data);
        break;
    case 8: // 渲染'诊断选项'内容
        buildDiagnosisDiagnosisEntityData(data);
        break;
    case 9: // 渲染'肿瘤史'内容
        buildDiagnosisHistTumourData(data);
        break;
    default:
        break;
    }
}
// 刷新首次透析数据
function refresh_hist_first_dialysis() {
    loadDiagnosisData('hist_first_dialysis', '');
}
// 刷新手术史数据
function refresh_hist_surgery() {
    loadDiagnosisData('hist_surgery', '');
}
// 刷新血透史数据
function refresh_hist_hd() {
    loadDiagnosisData('hist_hd', '');
}
// 刷新腹透史数据
function refresh_hist_pd() {
    loadDiagnosisData('hist_pd', '');
}
// 刷新肾移植史数据
function refresh_hist_kt() {
    loadDiagnosisData('hist_kt', '');
}
// 刷新过敏史数据
function refresh_hist_allergy() {
    loadDiagnosisData('hist_allergy', '');
}
// 刷新传染病史数据
function refresh_hist_pestilence() {
    loadDiagnosisData('hist_pestilence', '');
}

// 刷新传染病史数据
function refresh_hist_tumour() {
    loadDiagnosisData('hist_tumour', '');
}
/**
 * 渲染诊断字典结构数据
 */
function buildDictDiagnosisView() {
    // 诊断第一层btn项内容
    var html = '';
    var patientId = $("#patientId").val();
    $.each(dictDiagnosisList, function(i, dict) {
        var permission_key = permission_keys[i];
        html += '<button type="button" class="mr-10" data-permission-key="' + permission_key + '" data-item-code="' + dict.itemCode + '">'
                        + dict.itemName + '</button>';
        $(".add_" + permission_key).attr("data-item-code", dict.itemCode);
        // 初始化页面布局初始内容结构
        var diagnosis_content_html = '';
        if ($(".add_" + permission_key).parent().find(".diagnosis-hist-action").length > 0) {
            // 新增操作的menu内容
            var add_action_html = '';
            $.each(diagnosis_hist_actions, function(j, action) {
                // 先遍历获取固定的菜单项
                add_action_html += '<li data-item-code="' + action.itemCode + '" onclick="showDiagnosisDialog(\'\', ' + patientId + ', \''
                                + action.diagnosisType + '\', \'' + action.dialogType + '\')">' + action.itemName + '</li>';
                // 病史页面生成动态的内容布局结构
                diagnosis_content_html += '<div class="line-vertical" style="top: 0px;"></div>';
                diagnosis_content_html += '<div class="border-gray ml-12 mr-12 pb-12 pl-18 pr-18 position-relative data-view-' + action.itemCode
                                + '">';
                diagnosis_content_html += '<div class="dzblbutton" style="background: ' + action.background + ';">' + action.itemName + '</div>';
                diagnosis_content_html += '  <div class="data-view-' + action.itemCode + '">';
                diagnosis_content_html += '    <div class="pb-10"><span>暂无' + action.itemName + '数据</span></div>';
                diagnosis_content_html += '  </div>';
                diagnosis_content_html += '</div>';
            });
            // 增加动态的菜单项（病史有点特殊，itemCode动态，名称固定归为其他病史）
            add_action_html += '<li data-item-code="' + dict.itemCode + '" onclick="ShowDiagnosisEntityTab(\'\', ' + patientId + ', \''
                            + dict.itemCode + '\', \'其他病史\')">其他病史</li>';
            $(".add_" + permission_key).parent().find(".diagnosis-hist-action").html(add_action_html);
            // 添加动态的诊断选项的内容布局结构
            diagnosis_content_html += '<div class="line-vertical" style="top: 0px;"></div>';
            diagnosis_content_html += '<div class="border-gray ml-12 mr-12 pb-12 pl-18 pr-18 position-relative mb-10 data-view-' + dict.itemCode
                            + '">';
            diagnosis_content_html += '  <div class="dzblbutton" style="background: #44cfb0;">其他病史</div>';
            diagnosis_content_html += '  <div class="data-view-' + dict.itemCode + '">';
            diagnosis_content_html += '    <div class="pt-10"><span>暂无其他病史数据</span></div>';
            diagnosis_content_html += '  </div>';
            diagnosis_content_html += '</div>';
        } else {
            // 添加其他诊断Tab按钮的新增事件绑定
            $(".add_" + permission_key).off("click").on("click", function() {
                ShowDiagnosisEntityTab('', patientId, dict.itemCode, dict.itemName);
            });
            $(".add_" + permission_key).attr("data-item-code", dict.itemCode);
            // 添加动态的诊断选项的内容布局结构
            diagnosis_content_html += '<div class="line-vertical" style="top: 0px;"></div>';
            diagnosis_content_html += '<div class="border-gray ml-12 mr-12 pb-12 pl-18 pr-18 position-relative data-view-' + dict.itemCode + '">';
            diagnosis_content_html += '  <div class="pt-10"><span>暂无' + dict.itemName + '数据</span></div>';
            diagnosis_content_html += '</div>';
        }
        $("#list_" + permission_key).html(diagnosis_content_html);
    });
    $(".diagnosis-btns").html(html);
    // 默认第一个btn被激活
    $(".diagnosis-btns button:first").click();
}
/**
 * 展示病史dialog
 * 
 * @param id
 * @param patientId
 * @param diagnosisType
 * @param dialogType
 */
function showDiagnosisDialog(id, patientId, diagnosisType, dialogType) {
    var functionName = 'refresh_' + diagnosisType;
    if (isFromIframe()) {
        $(".modal[role='dialog']").css("margin-top", (parent.document.body.scrollTop - 30) + "px");
    }
    if (!isEmpty(functionName)) {
        $("body").data("dialogFunctionName", functionName);
    }
    for ( var key in dialogMapper) {
        if (key == dialogType) {
            eval(dialogMapper[key] + "('" + id + "','" + patientId + "','" + diagnosisType + "');");
            return;
        }
    }
}
/**
 * 渲染'首次透析'内容
 * 
 * @param data
 */
function buildDiagnosisHistFirstDialysisData(data) {

    var list = data.items.hist_first_dialysis || [];
    var actionObj = diagnosis_hist_actions[0];
    var diagnosis_content_html = '';
    if (list.length > 0) {
        // 首次透析数据只能有一条，隐藏 新增 首次透析 按钮
        $(".diagnosis-hist-action li").eq(0).hide();
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span>透析时间：' + v.firstTreatmentDateShow + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>透析方式：' + v.firstTreatmentTypeShow + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 渲染'手术史'内容
 * 
 * @param data
 */
function buildDiagnosisHistSurgeryData(data) {
    var list = data.items.hist_surgery || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[1];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-70">手术日期：' + v.surgeryDateShow + '</span>';
            diagnosis_content_html += '  <span>手术名称：' + v.surgeryName + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '  </div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
        $(".data-view-" + diagnosis_hist_actions[1].itemCode + ":eq(1)").html(diagnosis_content_html);
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * // 渲染'血透史'内容
 * 
 * @param data
 */
function buildDiagnosisHistHdData(data) {
    var list = data.items.hist_hd || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[2];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-14">开始时间：' + v.startDateShow + '  开始原因：' + v.startReasonShow
                            + (v.otherStartReason ? '：' + v.otherStartReason : '') + '</span>';
            diagnosis_content_html += '  <span>结束时间：' + v.endDateShow + '  结束原因：' + v.endReasonShow
                            + (v.otherEndReason ? '：' + v.otherEndReason : '') + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 渲染'腹透史'内容
 * 
 * @param data
 */
function buildDiagnosisHistPdData(data) {
    var list = data.items.hist_pd || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[3];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-14">开始时间：' + v.startDateShow + '  开始原因：' + v.startReasonShow
                            + (v.otherStartReason ? '：' + v.otherStartReason : '') + '</span>';
            diagnosis_content_html += '  <span>结束时间：' + v.endDateShow + '  结束原因：' + v.endReasonShow
                            + (v.otherEndReason ? '：' + v.otherEndReason : '') + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';

            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 渲染'肾移植史'内容
 * 
 * @param data
 */
function buildDiagnosisHistKtData(data) {
    var list = data.items.hist_kt || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[4];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-14">开始时间：' + v.startDateShow + '</span>';
            diagnosis_content_html += '  <span>结束时间：' + v.endDateShow + '  结束原因：' + v.endReasonShow
                            + (v.otherEndReason ? '：' + v.otherEndReason : '') + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 渲染'过敏史'内容
 * 
 * @param data
 */
function buildDiagnosisHistAllergyData(data) {
    var list = data.items.hist_allergy || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[5];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-14">录入日期：' + v.inputDateShow + '  过敏源：' + v.allergensShow
                            + (v.otherAllergens ? '：' + v.otherAllergens : '') + '</span>';
            diagnosis_content_html += '  <span>名        称：' + v.name + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 渲染'传染病史'内容
 * 
 * @param data
 */
function buildDiagnosisHistPestilenceData(data) {
    var list = data.items.hist_pestilence || [];
    var diagnosis_content_html = '';
    var actionObj = diagnosis_hist_actions[6];
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 u-xt-12 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '<span class="u-xt-3">诊断日期：' + v.diagnosticDateShow + '</span>';
            diagnosis_content_html += '<span class="u-xt-3">诊断名称：';
            if (!isEmpty(v.diagnosticNameShow)) {
                diagnosis_content_html += v.diagnosticNameShow.replace(/,/g, "、");
            }
            diagnosis_content_html += (v.otherDiagnosticName ? '：' + v.otherDiagnosticName : '');
            diagnosis_content_html += '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            diagnosis_content_html += '<div class="pb-10 u-xt-12">';
            diagnosis_content_html += '  <span class="u-xt-3">活动状态：' + v.activityStateShow + '</span>';
            diagnosis_content_html += '  <span class="u-xt-3">治疗情况：' + v.treatmentShow + (v.otherTreatment ? ('：' + v.otherTreatment) : '')
                            + '</span>';
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>备注：' + v.remark + '</span>';
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}

/**
 * 渲染“肿瘤史”
 * 
 * @param data
 */
function buildDiagnosisHistTumourData(data) {
    var list = data.items.hist_tumour || [];
    var actionObj = diagnosis_hist_actions[7];
    var diagnosis_content_html = '';
    if (list.length > 0) {
        $.each(list, function(i, v) {
            diagnosis_content_html += '<div class="pb-10 ' + (i == 0 ? "" : "mt-12") + '">';
            diagnosis_content_html += '  <span class="mr-14">录入日期：' + convertEmpty(v.recordDateShow) + '</span>';
            diagnosis_content_html += '  <span>诊断类型：' + convertEmpty(v.recordType) + '</span>';
            diagnosis_content_html += getDiagnosisHistBtnsHtml(v.id, v.fkPatientId, actionObj);
            diagnosis_content_html += '</div>';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div ' + (needLine ? "class='bb-dashed pb-12'" : "") + '>';
            diagnosis_content_html += '  <span>&nbsp;</span>';// 占行符
            diagnosis_content_html += '  <span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.createUserName + '</span>';
            diagnosis_content_html += '</div>';
        });
    } else {
        diagnosis_content_html += '<div class="pb-10"><span>暂无' + actionObj.itemName + '数据</span></div>';
    }
    $(".data-view-" + actionObj.itemCode + ":eq(1)").html(diagnosis_content_html);
}
/**
 * 获取病史操作按钮
 * 
 * @param id
 *            数据id
 * @param patientId
 *            患者id
 * @param obj
 *            diagnosis_hist_actions中的对象
 * 
 */
function getDiagnosisHistBtnsHtml(id, patientId, obj) {
    var html = "";
    if (!patientHasOutCome) {
        html += '<button type="button" class="u-float-r ml-16" text onclick="showDiagnosisDialog(' + id + ', ' + patientId + ', \''
                        + obj.diagnosisType + '\', \'' + obj.dialogType + '\')">编辑</button>';
        html += '<button type="button" class="u-btn-red u-float-r" text onclick="removeDiagnosis(' + id + ', ' + patientId + ', \''
                        + obj.diagnosisType + '\', \'' + obj.itemCode + '\', \'' + obj.itemName + '\')">删除</button>';
    }
    return html;
}
/**
 * 渲染'诊断选项'内容
 * 
 * @param data
 */
function buildDiagnosisDiagnosisEntityData(data) {
    var list = data.items.diagnosis_entity || [];
    if (list.length > 0) {
        if (data.itemCode) {
            var dictDiagnosis = {};
            $.each(dictDiagnosisList, function(i, dict) {
                if (dict.itemCode == data.itemCode) {
                    dictDiagnosis = dict;
                    return false;
                }
            });
            // 从当前诊断树结构中设置当前勾选的内容
            if (list.length > 0)
                buildDiagnosisChildrenView(dictDiagnosis, list);
        } else {
            $.each(dictDiagnosisList, function(i, dict) {
                var entities = [];
                $.each(list, function(j, entity) {
                    if (entity.itemCode == dict.itemCode) {
                        entities.push(entity);
                    }
                });
                if (entities.length > 0)
                    buildDiagnosisChildrenView(dict, entities);
            });
        }
    } else {
        if (data.itemCode) {
            $.each(dictDiagnosisList, function(i, dict) {
                if (dict.itemCode == data.itemCode) {
                    var diagnosis_content_html = '';
                    if (data.itemCode == 'BS') {
                        diagnosis_content_html += '<div class="pb-10"><span>暂无其他病史数据</span></div>';
                        $(".data-view-" + data.itemCode + ":eq(1)").html(diagnosis_content_html);
                    } else {
                        diagnosis_content_html += '<div class="pb-10"><span>暂无' + dict.itemName + '数据</span></div>';
                        $(".data-view-" + data.itemCode + ":eq(0)").html(diagnosis_content_html);
                    }
                }
            });
        }
    }
}
/**
 * 获取其它诊断操作按钮
 * 
 * @param id
 *            数据id
 * @param patientId
 *            患者id
 * @param itemCode
 * @param itemName
 */
function getDiagnosisEntityBtnsHtml(id, patientId, itemCode, itemName) {
    var html = "";
    if (!patientHasOutCome) {
        html += '<button type="button" class="u-float-r ml-16" text onclick="ShowDiagnosisEntityTab(' + id + ', ' + patientId + ', \'' + itemCode
                        + '\', \'' + itemName + '\')">编辑</button>';
        html += '<button type="button" class="u-btn-red u-float-r" text onclick="removeDiagnosis(' + id + ', ' + patientId
                        + ', \'diagnosis_entity\', \'' + itemCode + '\', \'' + itemName + '\')">删除</button>';
    }
    return html;
}
function buildDiagnosisChildrenView(dict, list) {
    if (dict.itemCode == 'BS') {
        $(".data-view-" + dict.itemCode + ":eq(1)").html('');
        $.each(list, function(i, v) {
            var diagnosis_content_html = '';
            // 分割虚线
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div class="pb-10 ' + (needLine ? "bb-dashed mb-12" : "") + ' data-view-' + dict.itemCode + '-' + (i + 1)
                            + '">';
            diagnosis_content_html += '</div>';
            $(".data-view-" + dict.itemCode + ":eq(1)").append(diagnosis_content_html);
            if (!isEmptyObject(dict.childrens)) {
                var children_content_html = '';
                var node = $('<div data-root><div>');
                showChildrenContent(dict.childrens, node, v);
                var addedCnt = node.find("[data-sub]").length;// 添加的数目
                var create_info_html = '<span class="u-float-r opacity-5">记录：' + v.createTimeShow + '  ' + v.operatorName + '</span>';
                if (addedCnt > 1) {// 如果添加的数目大于1，在最后一行插入记录人数据
                    node.find("[data-sub]:last").append(create_info_html);
                } else if (addedCnt == 1) {// 如果只添加了一条，添加一条记录人行数据
                    var nodeHtml = '<div class="pb-10" data-level="root">';
                    nodeHtml += '  <span>&nbsp;</span>';// 占行符
                    nodeHtml += create_info_html;
                    nodeHtml += '</div>';
                    node.append(nodeHtml);
                }
                node.find("[data-sub]:first").append(getDiagnosisEntityBtnsHtml(v.id, v.fkPatientId, v.itemCode, v.itemName));
                $(".data-view-" + dict.itemCode + "-" + (i + 1)).append(node.html());
            }
        });
    } else {
        $(".data-view-" + dict.itemCode + ":eq(0)").html('');
        $.each(list, function(i, v) {
            var diagnosis_content_html = '';
            diagnosis_content_html += '<div class="pb-12 bb-dashed mt-16">';
            diagnosis_content_html += '  <span>' + v.createTimeShow + '</span>';
            diagnosis_content_html += '  <span>医生：' + v.operatorName + '</span>';
            diagnosis_content_html += getDiagnosisEntityBtnsHtml(v.id, v.fkPatientId, dict.itemCode, dict.itemName);
            diagnosis_content_html += '</div>';
            var needLine = list.length > 1 && i != list.length - 1;
            diagnosis_content_html += '<div class="' + (needLine ? "bb-dashed pb-12" : "") + ' data-view-' + dict.itemCode + '-' + (i + 1) + '">';
            $(".data-view-" + dict.itemCode + ":eq(0)").append(diagnosis_content_html);
            if (!isEmptyObject(dict.childrens)) {
                var children_content_html = '';
                $.each(dict.childrens, function(index, child) {
                    var node = $('<span><span>');
                    showChildrenContent([ child ], node, v);
                    if (!isEmpty(node.html())) {
                        var nodeHtml = '<div class="mt-12" data-item-level="root">';
                        nodeHtml += node.html();
                        nodeHtml += '</div>';
                        children_content_html += nodeHtml;
                    }
                });
                $(".data-view-" + dict.itemCode + "-" + (i + 1)).append(children_content_html);
            }
        });
    }
}

// dict_list为json数据
// parent为要组合成html的容器
function showChildrenContent(dict_list, rootNode, entity, pNode) {
    pNode = isEmpty(pNode) ? rootNode : pNode;
    $.each(dict_list, function(i, dict) {
        // 如果有子节点，则遍历该子节点
        if (!isEmptyObject(dict.childrens)) {
            var itemName = dict.itemName.replace('？', '') + '：';
            var node = $('<div class="mt-12" data-sub>' + itemName + '</div>');
            // 将空白的ul作为下一个递归遍历的父亲节点传入
            showChildrenContent(dict.childrens, rootNode, entity, node);
            pNode.append(node);
        }
        // 如果该节点没有子节点，则直接将该节点li以及文本创建好直接添加到父亲节点中
        else {
            if (entity.valueList && entity.valueList.length > 0) {
                var entityValue = null;
                $.each(entity.valueList, function(j, value) {
                    // 判断当前诊断中是否保存了当前的节点值
                    if (value.itemCode == dict.itemCode) {
                        entityValue = value;
                        return false;
                    }
                });
                if (entityValue != null) { // 如果匹配到了，则生成对应的li节点
                    var content = '';
                    if (entityValue.itemValue) {
                        content = entityValue.itemValue + (entityValue.content ? ' : ' + entityValue.content : '');
                    } else {
                        content = entityValue.content;
                    }
                    var childEl = $();
                    pNode.append("<span data-leaf>" + content + "；</span>");
                }
            }
        }
        if (i == dict_list.length - 1) {// 删除没有叶子节点的数据
            rootNode.find("[data-sub]").each(function() {
                if ($(this).find("[data-leaf]").length == 0) {
                    $(this).remove();
                }
            });
        }
    });
}
function removeDiagnosis(id, patientId, diagnosisType, itemCode, itemName) {
    var diagnosisTypeObj = {};
    $.each(diagnosis_types, function(i, v) {
        if (v.type == diagnosisType) {
            diagnosisTypeObj = v;
        }
    });
    var url = "";
    var data = "";
    switch (diagnosisTypeObj.value) {
    case 1: // 渲染'首次透析'内容
        url = ctx + "/patient/diagnosis/deleteMedicalHistory.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 2: // 渲染'手术史'内容
        url = ctx + "/patient/diagnosis/deleteHistSurgery.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 3: // 渲染'血透史'内容
        url = ctx + "/patient/diagnosis/deleteHistHd.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 4: // 渲染'腹透史'内容
        url = ctx + "/patient/diagnosis/deleteHistPd.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 5: // 渲染'肾移植史'内容
        url = ctx + "/patient/diagnosis/deleteHistKt.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 6: // 渲染'过敏史'内容
        url = ctx + "/patient/diagnosis/deleteHistAllergy.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 7: // 渲染'传染病史'内容
        url = ctx + "/patient/diagnosis/deleteHistPestilence.shtml";
        data = "id=" + id + "&patientId=" + patientId;
        break;
    case 8: // 渲染'诊断选项'内容
        url = ctx + "/patient/diagnosis/deleteDiagnosisEntity.shtml";
        data = "id=" + id + "&patientId=" + patientId + "&itemName=" + itemName;
        break;
    case 9: // 渲染'肿瘤史'内容
        url = ctx + "/patient/diagnosis/deleteHistTumour.shtml";
        data = "id=" + id + "&patientId=" + patientId + "&itemName=" + itemName;
        break;
    default:
        break;
    }

    showConfirm('确定要删除' + itemName + '诊断信息吗？', function() {
        $.ajax({
            url : url,
            data : data,
            type : "post",
            dataType : "json",
            loading : true,
            success : function(data) {// ajax返回的数据
                if (data) {
                    if (diagnosisTypeObj.value == 1) {
                        $(".diagnosis-hist-action li").eq(0).show();
                    }
                    loadDiagnosisData(diagnosisType, itemCode);
                }
            }
        });
    });
}
/* 设置时间 */
function addDate(laydate, dom, minDate, maxDate) {
    var config = {
        elem : dom,
        theme : '#31AAFF',
        show : true,
        trigger : 'click', // 采用click弹出
        btns : [ "clear", "now", "confirm" ]
    };
    if (!isEmpty(minDate)) {
        config["min"] = minDate;
    }
    if (!isEmpty(maxDate)) {
        config["max"] = maxDate;
    }
    console.log(config);
    laydate.render(config);
}

// //////////////////////////////////////////// 其他诊断选项内容的创建实现 /////////////////////////////////////////////
/**
 * 显示诊断对应的tab按钮内容
 * 
 * @param id
 * @param patientId
 * @param itemCode
 * @param itemName
 * @constructor
 */
function ShowDiagnosisEntityTab(id, patientId, itemCode, itemName, type) {
    $(".diagnosis-btns > button").removeClass("u-btn-blue");
    // 如果当前打开过diagnosis-entity-tab,先移除后追加
    if ($(".diagnosis-btns").find(".diagnosis-entity-tab").length > 0) {
        $(".diagnosis-btns").find(".diagnosis-entity-tab").remove();
    }
    // 追加该诊断模块的diagnosis-entity-tab按钮
    var html = '';
    html += '<button type="button" class="mr-10 u-btn-blue diagnosis-entity-tab" data-permission-key="diagnosis_tab" id="tab-' + itemCode
                    + '" data-item-code="' + itemCode + '">';
    html += '   ' + (id == '' ? '新增' : '编辑') + itemName + '<i class="icon-close ml-14 fs-12"></i>';
    html += '</button>';
    $(".diagnosis-btns").append(html);
    // 展示该诊断对应的tab形式的表单内容
    showDiagnosisTabView(id, patientId, itemCode, itemName, type);
    $(window.document.body).animate({
        scrollTop : 0
    }, 100);
}
/**
 * 加载itemCode对应的诊断信息的tab内容
 * 
 * @param id
 * @param patientId
 * @param itemCode
 * @param itemName
 */
function showDiagnosisTabView(id, patientId, itemCode, itemName, type) {
    // 显示当前tab布局，隐藏其他诊断的list布局
    $(".diagnosis-content > div#diagnosis_tab").show().siblings().hide();
    if (type == "icd") {
        $("#diagnosisEntityForm input[name='icdId']").val(id);
        $("#diagnosisEntityForm input[name='id']").val("");
    } else {
        $("#diagnosisEntityForm input[name='id']").val(id);
        $("#diagnosisEntityForm input[name='icdId']").val("");
    }
    // 新增重置表单
    if (id == "" && itemCode == "LC") {
        $("#diagnosisEntityForm").resetForm();
    }
    $("#diagnosisEntityForm input[name='fkPatientId']").val(patientId);
    $("#diagnosisEntityForm input[name='itemCode']").val(itemCode);
    $("#diagnosisEntityForm input[name='itemName']").val(itemName);
    $("#diagnosisEntityForm").data("item-code", itemCode);
    if (id != '') {
        $.ajax({
            url : ctx + "/patient/diagnosis/search.shtml",
            data : "patientId=" + patientId + "&diagnosisType=diagnosis_entity&id=" + id,
            type : "post",
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data) {
                    if (data.status == 1) {
                        buildTreeContent(itemCode, data.item);
                    }
                }
                if (type == "icd") {
                    $("#diagnosis_tab_tab_right input:checkbox").removeAttr("checked", false);
                } else {
                    $("#diagnosis_tab_icd_right input:checkbox").removeAttr("checked", false);
                }
                return false;
            }
        });
    } else {
        buildTreeContent(itemCode, null);
        // 新增清理选中内容
        $("#diagnosisEntityForm input:checkbox").removeAttr("checked", false);
    }
}
function buildTreeContent(itemCode, entity) {
    $("#diagnosis_tab_tab_left").html('');
    $("#diagnosis_tab_tab_right").html('');
    // 还原变更的值
    $.each(dictDiagnosisList, function(i, dict) {
        delete dict.name;
        delete dict.children;
        delete dict.content;
        delete dict.open;
        delete dict.hasChecked;
    });
    var nodes = [];
    $.each(dictDiagnosisList, function(i, dict) {
        if (dict.itemCode == itemCode) {
            convertToTreeNode(dict, entity);
            nodes.push(dict);
        }
    });
    // 一次生成右边所有项目的html，根据选中的项目隐藏不需要显示的
    $("#diagnosis_tab_tab_right").html(getRightContentHtml(nodes));
    var treeSettings = {
        view : {
            showLine : false
        },
        data : {
            simpleData : {
                enable : true,
                idKey : "itemCode",
                pIdKey : "pItemCode",
                rootPId : itemCode
            }
        },
        callback : {
            beforeClick : function(treeId, treeNode, clickFlag) {
                if (clickFlag == 1 && treeNode.isParent) {
                    return false;
                }
                return true;
            },
            onClick : function(event, treeId, treeNode) {
                if (!treeNode.isParent) {
                    $("#diagnosis_tab_tab_right").find("[data-code]").addClass("hide");
                    $("#diagnosis_tab_tab_right").find("[data-code='" + treeNode.itemCode + "']").removeClass("hide");
                }
            }
        }
    };
    $.fn.zTree.init($("#diagnosis_tab_tab_left"), treeSettings, nodes);
    // 选中第一个选中的节点
    var treeObj = $.fn.zTree.getZTreeObj("diagnosis_tab_tab_left");
    var nodes = treeObj.transformToArray(treeObj.getNodes());
    if (nodes.length > 0) {
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            if (!node.isParent && node.hasChecked) {
                treeObj.selectNode(node);
                $("#" + node.tId + "_a").click();
                break;
            }
        }
    }
    return;
}
/**
 * 初始化为树节点
 * 
 * @param item
 */
function convertToTreeNode(item, entity, index) {
    item.name = item.itemName;
    if (!isEmptyObject(item.childrens)) {
        if (!checkAllChildIsLeaf(item)) {// 叶子节点不显示在树上
            item.children = item.childrens;
            var hasChecked = false;
            for (var i = 0; i < item.childrens.length; i++) {
                var child = item.childrens[i];
                convertToTreeNode(child, entity, isEmpty(index) ? i : index);// 默认展开第一级节点数据
                if (!hasChecked && child.open) {
                    hasChecked = true;
                }
            }
            item.open = hasChecked;
            item.hasChecked = hasChecked;
        } else {
            var hasChecked = false;// 是否有选中的项目
            if (!isEmptyObject(entity) && !isEmptyObject(entity.valueList)) {
                for (var i = 0; i < item.childrens.length; i++) {
                    var child = item.childrens[i];
                    $.each(entity.valueList, function(j, value) {
                        // 判断当前诊断中是否保存了当前的节点值
                        if (value.itemCode == child.itemCode) {
                            child.checked = true;
                            child.content = convertEmpty(value.content);
                            hasChecked = true;
                            return false;
                        }
                    });
                }
            } else {
                // 默认展开第一个
                hasChecked = index == 0;
            }
            item.open = hasChecked;
            item.hasChecked = hasChecked;
        }
    }
}
/**
 * 判断所有子节点是否都是叶子节点
 */
function checkAllChildIsLeaf(item) {
    var children = item.childrens;
    if (!isEmptyObject(children)) {
        for (var i = 0; i < children.length; i++) {
            if (!isEmptyObject(children[i].childrens)) {
                return false;
            }
        }
    }
    return true;
}

/**
 * 获取entity_tab右边的html
 */
function getRightContentHtml(items, pNode) {
    var html = "";
    $.each(items, function(i, item) {
        if (!isEmptyObject(item.childrens)) {
            if (isEmptyObject(item.children)) {// 因为tree中不显示叶子节点，所以树为叶子节点时，显示对应的内容
                html += '<div class="hide" data-code="' + item.itemCode + '">';
                html += '<div class="bb-line pl-12 mt-14 pb-14 fw-bold">' + item.name + '</div>';
                html += '<div class="u-xt-12 pl-12 mt-6 pr-22">';
                html += getRightContentHtml(item.childrens, item);
                html += '</div>';
                html += '</div>';
            } else {
                html += getRightContentHtml(item.childrens, item);
            }
        } else {
            if (!isEmptyObject(pNode)) {
                var itemCode = pNode.itemCode;
                var len = pNode.childrens.length;
                if (item.itemType == "textarea") {
                    html += '<div class="mt-12">';
                    html += '<input type="hidden" name="valueMap[\'' + itemCode + '\'][' + i + '].itemCode" value="' + item.itemCode + '">';
                    html += '<textarea id="' + itemCode + '_' + i + '" name="valueMap[\'' + itemCode + '\'][' + i
                                    + '].content" maxlength="256" placeholder="备注" style="width: 100%">' + (item.content || '') + '</textarea>';
                    html += '</div>';
                } else {
                    html += '<div class="u-xt-3 text-ellipsis">';
                    html += '<label class="u-' + item.itemType + '" title="' + item.itemName + '">';
                    if (item.itemType == "radio") {
                        html += '<input id="' + itemCode + '_' + i + '" type="' + item.itemType + '" name="valueMap[\'' + itemCode
                                        + '\'][0].itemValue" ' + (item.checked ? 'checked' : '') + ' value="' + item.itemCode + '_' + item.itemName
                                        + '" data-item-code="' + itemCode + '" onclick="changeOptionValue(this, \'' + itemCode + '\', \''
                                        + item.itemName + '\', ' + len + ')">';
                    } else if (item.itemType == "checkbox") {
                        html += '<input id="' + itemCode + '_' + i + '" type="' + item.itemType + '" name="valueMap[\'' + itemCode + '\'][' + i
                                        + '].itemValue" ' + (item.checked ? 'checked' : '') + ' value="' + item.itemCode + '_' + item.itemName
                                        + '" data-item-code="' + itemCode + '" onclick="changeOptionValue(this, \'' + itemCode + '\', \''
                                        + item.itemName + '\', ' + len + ')">';
                    }
                    html += '  <span class="icon-' + item.itemType + '"></span>' + item.itemName;
                    html += '</label>';
                    html += '</div>';
                }
                if (item.itemName == '其他' && itemCode.indexOf('HBZ') == -1) {
                    var hasHide = item.checked ? '' : 'hide';
                    html += '<div class="mt-12">';
                    html += '  <textarea class="' + hasHide + '" id="' + itemCode + '_' + len + '" name="valueMap[\'' + itemCode + '\'][' + (len - 1)
                                    + '].content" maxlength="256" placeholder="' + item.itemName + '" style="width: 100%">' + (item.content || '')
                                    + '</textarea>';
                    html += '</div>';
                }
            }
        }
    });
    return html;
}
// 选项input框单击事件
function changeOptionValue(obj, itemCode, itemName, len) {
    if (itemName.indexOf('其他') >= 0 && itemCode.indexOf('HBZ') == -1) {
        $("#diagnosisEntityForm textarea[id='" + itemCode + "_" + len + "']").html('');
        if ($(obj).is(":checked")) {
            $("#diagnosisEntityForm textarea[id='" + itemCode + "_" + len + "']").attr("placeholder", itemName);
            $("#diagnosisEntityForm textarea[id='" + itemCode + "_" + len + "']").removeClass('hide').addClass('show');
        } else {
            $("#diagnosisEntityForm textarea[id='" + itemCode + "_" + len + "']").removeClass('show').addClass('hide');
        }
    } else if (itemCode.indexOf('CKDAKI') >= 0) { // CKD/AKI诊断，则执行联动处理，切换节点时取消其他节点的选中值
        $("#diagnosis_tab_tab_right").find("[type='radio'][data-item-code != '" + itemCode + "']").prop("checked", false);
    }
}
// 保存
function saveDiagnosisEntity() {
    if ($("#diagnosisEntityForm").valid()) {
        var options = {
            url : ctx + "/patient/diagnosis/saveDiagnosisEntity.shtml",
            dataType : "json",
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                if (data) {
                    if (data.status == 1) {
                        $(".diagnosis-btns").find(".icon-close").click();
                        var itemCode = $("#diagnosisEntityForm").data("item-code");
                        $("#diagnosis_tab_tab_left").html('');
                        $("#diagnosis_tab_tab_right").html('');
                        loadDiagnosisData('diagnosis_entity', itemCode);
                        loadIcdData();
                    } else {
                        showWarn(data.message);
                    }
                }
                return false;
            }
        };
        $("#diagnosisEntityForm").ajaxSubmit(options);
        return false;
    }
}

function loadIcdData() {
    var patientId = $("#patientId").val();
    $
                    .ajax({
                        url : ctx + "/dict/icd/getIcdData.shtml",
                        data : {
                            patientId : patientId
                        },
                        type : "post",
                        dataType : "json",
                        success : function(data) {// ajax返回的数据
                            if (data.status == "1") {
                                var html = '';
                                var items = data.rs;
                                for (var i = 0; i < items.length; i++) {
                                    html += '<div class="pb-12 bb-dashed mt-16">';
                                    html += '<span>' + new Date(items[i].createTime).pattern("yyyy/MM/dd") + '</span>';
                                    html += '<span>医生：' + items[i].name + '</span>';
                                    html += '<span style="margin-left:12px;">' + items[i].itemName + '</span>';
                                    html += '<button type="button" class="u-float-r ml-16" text="" onclick="ShowDiagnosisEntityTab(' + items[i].id
                                                    + ', ' + items[i].fkPatientId + ', \'LC\', \'临时诊断\', \'icd\')">编辑</button>';
                                    html += '<button type="button" class="u-btn-red u-float-r" text="" onclick="removeDiagnosisIcd(' + items[i].id
                                                    + ')">删除</button>';
                                    html += '</div></div>';
                                }
                                $("#list_clinical_diagnosis_icd").html(html);
                            }
                        }
                    });
}

function removeDiagnosisIcd(id) {
    if (!isEmpty(id)) {
        $.ajax({
            url : ctx + "/dict/icd/deleteByPrimaryKey.shtml",
            data : {
                id : id
            },
            type : "post",
            dataType : "json",
            success : function(data) {// ajax返回的数据
                if (data.status == "1") {
                    loadIcdData();
                }
            }
        });
    }
}
