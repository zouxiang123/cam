$(function() {
    /* 设置表头选中 */
    $("#overdue_head").addClass("active");
    pagination.addPaging({
        bodyId : "patientAssayNewstBody",
        callback : function() {
            load($("#patientName").val());
        },
        scrollEl : $("#scrollBody"),
        pageSize : 20
    });
    /** 加载数据 */
    load($("#patientName").val());

    /** 关闭报表设置* */
    reportConditionClose(true);
    $("#report_condition_tip").hide();
    // 动态规定表格的高度
    MaxAdaptive('#scrollBody', 100);

    $("#secondTabsDiv").on("click", "[data-url]", function() {
        $(this).addClass("active").siblings().removeClass("active");
    });
});

/** 点击tab显示不同类型下的报表数据 */
function showTab(dom, type) {
    if (type == 1) {// 化验逾期
        load($("#patientName").val());
        $("#div_assay_remind").show();
        $("#div_exception_assay_remind").hide();
        $("#report_condition_title").hide();
        $("#report_condition_tip").hide();
    }
    if (type == 2) {// 化验结果
        loadAssay();
        $("#div_assay_remind").hide();
        $("#div_exception_assay_remind").show();
        $("#report_condition_title").show();
        $("#report_condition_tip").show();
    }
}

function search() {
    pagination.resetPaging("patientAssayNewstBody");
    load($("#patientName").val());
}
/**
 * 中英文搜索
 */
function searchNameOrInitial() {
    // 进行判断你是英文还是中文
    var pattern = /^([\u4E00-\u9FA5]|[\uFE30-\uFFA0])*$/gi;
    if (pattern.test($("#patientName").val())) {// 汉字
        return true;
    } else {
        return false;
    }
}

// 获取患者逾期项内容
function load(patientName) {
    var ptNameOrInitial = "";// 中文或者是英文
    if (searchNameOrInitial()) {// 如果是汉字
        ptNameOrInitial = "name=" + patientName;
    } else {
        ptNameOrInitial = "initial=" + patientName;
    }
    $.ajax({
        url : ctx + '/report/patientAssayRemind/searchPatientOverdue.shtml',
        data : ptNameOrInitial + "&" + pagination.getPagingData("patientAssayNewstBody").str,
        dataType : 'json',
        type : 'POST',
        loading : true,
        success : function(result) {
            if (result.status == 1) {
                var data = result.rs;
                // 患者列表
                var patients = data.results;
                var tempRow = "";
                $(patients).each(
                                function(i, obj) {
                                    // 化验项逾期数据
                                    var newsts = obj.patientAssayNewstArrays;
                                    var overduesVal = "";
                                    $(newsts).each(function(i, obj) {
                                        if (obj.state != 0 && !isEmpty(obj.itemName)) {
                                            overduesVal += obj.itemName + "，";
                                        }
                                        // 省略号
                                        if (overduesVal.length > 200) {
                                            overduesVal = overduesVal.substr(0, 100) + "...";
                                            return false;
                                        }
                                    });
                                    if (!isEmpty(overduesVal) && overduesVal.length > 0) {
                                        overduesVal = overduesVal.substr(0, overduesVal.length - 1);
                                        tempRow += '<tr id="patient' + obj.id + '">';
                                        tempRow += '<td style="width: 15%;">';
                                        tempRow += '<button type="button" text class="u-btn-blue" onclick="beforeToFullScreenPatientPage(' + obj.id
                                                        + ',\'' + convertEmpty(obj.name) + '\')">' + convertEmpty(obj.name) + '</button>';
                                        tempRow += '</td>';
                                        tempRow += "<td  style='width: 75%'>" + overduesVal + "</td>";
                                        tempRow += '<td style="width: 10%">';
                                        tempRow += '<button type="button" text class="u-btn-blue" onclick="searchPatientAssayOverdue(\'' + obj.id
                                                        + '\',\'' + obj.name + '\')" data-popupId="#detailDialog">详情</button>';
                                        tempRow += '</td>';
                                        tempRow += '</tr>';
                                    }
                                });
                $("#patientAssayNewstBody").append(tempRow);
                pagination.setTotalPage(result.rs.totalPage, "patientAssayNewstBody");
            }
        }
    });
}
function beforeToFullScreenPatientPage(id, name) {
    var url = ctx + "/ckdPatientHome/view.shtml?id=" + id;
    openUrl(id, name, url, '0');
}

/**
 * 打开页面
 */
function openUrl(id, name, url, refresh) {
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
/**
 * 患者逾期项列表 id 患者ID name 患者名称
 */
function searchPatientAssayOverdue(id, name) {
    $("#patientAssayNewsOverdue").empty();
    $("#patientAssayRecord").empty();
    $("#patientAssayRecord").append(name + "患者化验项逾期详情");
    $.ajax({
        url : ctx + '/report/patientAssayRemind/searchByPatientOverdue.shtml',
        data : "patientId=" + id,
        dataType : 'json',
        type : 'POST',
        loading : true,
        success : function(result) {
            if (result.status == 1) {
                var tempRow = "";
                $(result.rs).each(function(i, obj) {

                    var state = obj.state;
                    if (state != 0) {
                        tempRow += '<tr>';
                        tempRow += '<td class="xtt-8">' + convertEmpty(obj.itemCodeShow) + '</td>';
                        tempRow += '<td>' + convertEmpty(obj.itemName) + '</td>';
                        if (state == -1) {
                            tempRow += '<td class="xtt-10"></td>';
                            tempRow += '<td class="xtt-8"></td>';
                            tempRow += '<td class="xtt-11">未化验</td>';
                            tempRow += '<td class="xtt-11"></td>';
                        } else {
                            tempRow += '<td class="xtt-10">' + convertEmpty(obj.assayTimeStr) + '</td>';
                            tempRow += '<td class="xtt-8">' + convertEmpty(obj.assayDay) + '</td>';
                            tempRow += '<td class="xtt-11">' + convertEmpty(obj.assayVal) + '</td>';
                            tempRow += '<td class="xtt-11">' + convertEmpty(obj.assayRange) + '</td>';
                        }
                        tempRow += '</tr>';
                    }
                });
                $("#patientAssayNewsOverdue").append(tempRow);
                popDialog("#detailDialog");
            }
        }
    });
}
