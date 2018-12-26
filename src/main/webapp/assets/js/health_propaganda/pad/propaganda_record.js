var commonPatientId = '';
var commonPatientName = '';
var commonFkDialysisCampaignId = '';
$(function() {
    commonPatientId = $("[name='patient-patientId']").val();
    commonPatientName = $("[name='patient-patientName']").val();
    commonFkDialysisCampaignId = $("[name='fk-Dialysis-CampaignId']").val();

    // 查询患者宣教记录和对应的详情
    loadPropagandaRecord("type=merge&fkPatientId=" + commonPatientId, 0);
    // 查询宣教字典上数据
    loadPropagandaDict("level=1", 0);
    // 日历控件初始化
    $("input[daterangepicker]").daterangepicker({
        "singleDatePicker" : true,
        "autoUpdateInput" : true,
        "showDropdowns" : true,
        "alwaysShowCalendars" : true,
        "locale" : {
            format : "YYYY-MM-DD",
            applyLabel : "确认",
            cancelLabel : "取消",
            daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
            monthNames : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ]
        }
    });
    if (isPC) {
        $("#propa-record-detail-main").css("margin-top", "50px");
        $("#propa-dict-record-main").css("margin-top", "50px");
    }
});

// 切换宣教评价和宣教记录
function changeTab(dom, type) {
    $(dom).addClass("active").siblings().removeClass("active");
    if (type == 0) {
        $("#propa-estimate-div").removeClass("hide");
        $("#propa-record-div").addClass("hide");
    }
    if (type == 1) {
        $("#propa-estimate-div").addClass("hide");
        $("#propa-record-div").removeClass("hide");
    }
}
// 根据搜索内容框输入的内容搜索数据
function findDictOnBlur(dom, type) {
    var searchVal = $(dom).val();
    $("#propagandaNav a:eq(0)").nextAll().html('');
    if (searchVal == "") {
        loadPropagandaDict("level=1", 0);
    } else {
        $("#propaganda-dict-list").html('');
        findDetailInDict('', commonPatientId, searchVal);
    }
}
// 根据患者查询宣教记录数据
function loadPropagandaRecord(search, type) {
    $.ajax({
        url : ctx + '/propagandaRecord/selectAllRecord.shtml',
        data : search,
        dataType : 'json',
        type : 'POST',
        success : function(result) {
            var PropagandaRecordPOData = result.PropagandaRecordPOList;
            var itemHtml = '';
            if (type == 0) {
                $("#patient-propa-record-div").html(createPropRecordList(itemHtml, PropagandaRecordPOData, type));
            } else if (type == 1) {
                $("#propa-record-div").html(createPropRecordList(itemHtml, PropagandaRecordPOData, type));
            }
        }
    });
}
// 创建宣教记录列表
function createPropRecordList(itemHtml, PropagandaRecordPOData, type) {
    for (var i = 0; i < PropagandaRecordPOData.length; i++) {
        var item = PropagandaRecordPOData[i];
        if (type == 0) {
            itemHtml += '<div class="xj-image-item2 clearfix border-bottom-line hand" onclick="getPropagandaDetailById(this,0);">';
        } else if (type == 1) {
            itemHtml += '<div class="xj-image-item2 clearfix border-bottom-line">';
        }
        itemHtml += '<input type="hidden" name="hidePropDetailCode" value="' + item.propagandaDetailCode + '">';
        itemHtml += '<input type="hidden" name="hidePatientId" value="' + item.fkSysUserId + '"/>';
        itemHtml += '<input type="hidden" name="patientName" value="' + item.patientName + '">';
        if (item.imagePath == null || item.imagePath == "") {
            itemHtml += '<img  src="' + ctx + '/assets/img/media-default.png">';
        } else {
            itemHtml += '<img  src="' + ctx + '/images/' + item.imagePath + '">';
        }
        itemHtml += '<div class="float-left m-l-14" style="max-width: 320px;">';
        itemHtml += '<p >' + item.title + '</p>';
        itemHtml += '<span>项目类别：<span>' + item.wholepCodeShow + '</span></span>';
        itemHtml += '<br/>';
        itemHtml += '<span>宣教对象：' + item.propagandaTarget + '</span>';
        itemHtml += '<span>宣教评估：' + item.estimate + '</span>';
        itemHtml += '<br/>';
        itemHtml += '<span name="record-right-list-remarks">备注：<label>' + item.remarks + '</label></span>';
        itemHtml += '<br/>';
        itemHtml += '<span name="record-right-list-propaName">宣教人：<label>' + item.propaName + '</label>&nbsp;&nbsp;&nbsp;&nbsp;<label>'
                        + item.propaTimeShow + '</label></span>';
        itemHtml += '</div></div>';
    }
    return itemHtml;
}

// 新增宣教记录
function savePropaRecord() {
    var propaEstimateForm = $("#propaEstimateForm").serialize() + "&remarks=" + $("#remarksShow").val();
    $.ajax({
        url : ctx + '/propagandaRecord/savePropaRecord.shtml',
        data : propaEstimateForm,
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            if (result.msg == "success") {
                showTips("保存成功！");
                window.location.href = ctx + '/propagandaRecord/view.shtml?patientId=' + commonPatientId + '&fkCampaignId='
                                + commonFkDialysisCampaignId;
            } else if (result.msg == "fail") {
                showWarn("保存失败!");
                window.location.href = ctx + '/propagandaRecord/view.shtml?patientId=' + commonPatientId + '&fkCampaignId='
                                + commonFkDialysisCampaignId;
            }
        }
    });
}

// 在宣教评价和宣教记录中切换
function changeTable(dom) {
    if (!$(dom).hasClass("active")) {
        $(dom).addClass("active")
    }
    if ($(dom).siblings("li").hasClass("active")) {
        $(dom).siblings("li").removeClass("active");
    }
    $("#propaEstimateTableDiv").toggleClass("hide");
    $("#propaRecordTableDiv").toggleClass("hide");
}
// 查询宣教字典数据
function loadPropagandaDict(search, grade) {
    $.ajax({
        url : ctx + '/propagandaRecord/selectPropagandaDict.shtml',
        data : search,
        dataType : 'json',
        type : 'POST',
        success : function(result) {
            var PropagandaDictionaryPOData = result.PropagandaDictionaryPOList;
            $("#propaganda-dict-list").html(createPropagandaDictHtml(PropagandaDictionaryPOData));
            // 顶级类别
            if (grade == 0) {
                $("#propaganda-dict-list").html(createPropagandaDictHtml(PropagandaDictionaryPOData));
            } else if (grade == 1) {// 子项
                // 拼接链接
                $("#propaganda-dict-list").html(createDictChildHtml(PropagandaDictionaryPOData));
            }
        }
    });
}
// 根据点击宣教项目类别 来查询此类别下面的所有宣教类别
function getPropagandaDictByCode(dom) {
    var code = $(dom).find("input").val();
    var search = ("pcode=" + code);
    $.ajax({
        url : ctx + '/propagandaRecord/selectPropagandaDict.shtml',
        data : search,
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            var PropagandaDictionaryPOData = result.PropagandaDictionaryPOList;
            // 宣教类别（大于第一级）
            $("#propaganda-dict-list").html(createDictChildHtml(PropagandaDictionaryPOData));
        }
    });

    // 每次点击 项目类别时，在顶部[全部宣教]后面追加链接
    var propagandaName = $(dom).find("p").html();
    var navHtml = '<a  href="javascript:void(0);" data-hrefCode=' + code + ' onclick="getDataByClickHref(this);">' + " > " + propagandaName + '</a>';
    $("#propagandaNav").append(navHtml);

    // 点击后，查询其对应的详情数据
    findDetailInDict(code, commonPatientId, '');
}

// 根据点击宣教项目类别 来查询此类别下面的所有 宣教详情内容
function getPropagandaDetailByCondition(search) {
    var PropagandaDetailPOData = '';
    $.ajax({
        url : ctx + '/propagandaRecord/selectPropagandaDetailByCondition.shtml',
        data : search,
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function(result) {
            PropagandaDetailPOData = result.PropagandaDetailPOList;
        }
    });
    return PropagandaDetailPOData;
}
// 根据code来联合record表+detail表查询
function getPropagandaDetailById(dom, type) {
    $("#propa-record-detail-main").removeClass("hide");
    $("#propa-dict-record-main").addClass("hide");
    var detailCode = '';
    var patientId;
    // 右边列表
    if (type == 0) {
        /** ***************record************ */
        // 关联code
        detailCode = $(dom).find("input[name='hidePropDetailCode']").val();
        $("[name='propagandaDetailCode']").val(detailCode);
        // 项目类别
        var propaType = $(dom).find("div:eq(0)>span:eq(0)>span:eq(0)").html();
        $("[name='propa-detail-inRecord-parentName']").html(propaType);
    } else {// 左边列表
        // 关联code
        detailCode = $(dom).find("input[name='data-code']").val();
        $("[name='propagandaDetailCode']").val(detailCode);
        // 项目类别
        var propaType = $(dom).find("div:eq(1)>p[name='data-parentName']").html();
        $("[name='propa-detail-inRecord-parentName']").html(propaType);
    }
    // 患者ID
    $("[name='fkSysUserId']").val(commonPatientId);
    // 患者姓名
    $("#propa-record-detail-main [name='propa-detail-inRecord-patientName']").html(commonPatientName);
    // 宣教详情
    getDetailByCode(detailCode);
    // 加载某个患者 对应此项宣教内容的记录
    loadPropagandaRecord("type=&fkPatientId=" + commonPatientId + "&detailCode=" + detailCode, 1);
}
// 加载详情数据
function getDetailByCode(detailCode) {
    $("[name='propa-detail-inRecord-image'],#propa-detail-inRecord-video").removeClass("hide");
    $.ajax({
        url : ctx + '/propagandaRecord/selectDetailAndRecordByCode.shtml',
        data : {
            "code" : detailCode
        },
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            var propagandaDetail = result.PropagandaRecordPOList;
            $("#propa-record-detail-main [name='propa-detail-inRecord-title']").html(propagandaDetail[0].title);// 标题
            $("#propa-record-detail-main [name='propa-detail-inRecord-propaContent']").html(propagandaDetail[0].content);// 内容
            $("#propa-record-detail-main [name='propa-detail-inRecord-releaseName']").html(propagandaDetail[0].releaseName);// 发布人
            $("#propa-record-detail-main [name='propa-detail-inRecord-releaseTime']").html(propagandaDetail[0].releaseTimeShow);// 发布时间
            $("#propa-detail-inRecord-video").attr("poster", ctx + "/images/" + propagandaDetail[0].realImagePath);// 封面
            $("[name='propa-detail-inRecord-image']").attr("src", ctx + "/images/" + propagandaDetail[0].realImagePath);// 图片
            $("#propa-detail-inRecord-video").attr("src", ctx + "/images/" + propagandaDetail[0].video);// 视频
            $("#propa-record-detail-main [name='prdm-tag']").siblings("label").remove();// 标签
            if (propagandaDetail[0].tag != null) {
                var tempHtml = '';
                var tagArr = propagandaDetail[0].tag.split(',');
                for (var j = 0; j < tagArr.length; j++) {
                    tempHtml += '<label class="xt-check-label2">' + tagArr[j] + '</label>';
                }
            }
            $("#propa-record-detail-main [name='prdm-tag']").after(tempHtml);
            // 视频显示隐藏
            if (propagandaDetail[0].video == "" || propagandaDetail[0].video == null) {
                $("#propa-detail-inRecord-video").addClass("hide");
                if (propagandaDetail[0].realImagePath == "" || propagandaDetail[0].realImagePath == null) {
                    $("[name='propa-detail-inRecord-image']").addClass("hide");
                }
            } else {
                $("[name='propa-detail-inRecord-image']").addClass("hide");
            }
        }
    });
}

// 创建宣教类别 的HTML (顶级)
function createPropagandaDictHtml(PropagandaDictionaryPOData) {
    var itemHtml = '';
    for (var i = 0; i < PropagandaDictionaryPOData.length; i++) {
        var item = PropagandaDictionaryPOData[i];
        itemHtml += '<div class="xj-image-item hand" onclick="getPropagandaDictByCode(this);">';
        itemHtml += '<input type="hidden" name="" value="' + item.code + '"/>';
        itemHtml += '<img  src="' + ctx + '/images/' + item.imagepath + '"/>';
        itemHtml += '<p>' + item.name + '</p>';
        itemHtml += '</div>';
    }
    return itemHtml;
}
// 创建大于第一级宣教类别的html
function createDictChildHtml(PropagandaDictionaryPOData) {
    var itemHtml = '';
    for (var i = 0; i < PropagandaDictionaryPOData.length; i++) {
        var item = PropagandaDictionaryPOData[i];
        itemHtml += '<div class="xj-image-item3" onclick="getPropagandaDictByCode(this)" style="background:';
        itemHtml += getBackgroundColor(item.id);
        itemHtml += '">';
        itemHtml += '<input type="hidden" name="" value="' + item.code + '">';
        itemHtml += '<div class="absolute-center"><p>' + item.name;
        itemHtml += '</p></div></div>';
    }
    return itemHtml;
}
// 获取背景颜色
function getBackgroundColor(id) {
    var lastIll = (('' + id + '').substring(('' + id + '').length - 2, ('' + id + '').length - 1)) * 1;
    if (lastIll >= 0 && lastIll <= 2) {
        return "#f0c213";
    } else if (lastIll > 2 && lastIll <= 4) {
        return "#6e829a";
    } else if (lastIll > 4 && lastIll <= 6) {
        return "#18c974";
    } else if (lastIll > 6 && lastIll <= 8) {
        return "#f87692";
    } else {
        return "#8e5aa0";
    }
}

// 通过点击 顶部链接来查询数据
function getDataByClickHref(dom) {
    $(".xt-search-input").val('');
    // 将此链接后面的链接清空
    $(dom).nextAll().html('');
    var code = $(dom).attr("data-hrefCode");
    if (code == "") {
        // 点击全部
        $("#propaganda-detail-list-div").html('');
        loadPropagandaDict("level=1", 0);
        $("#propaganda-dict-main").removeClass("hide");
        $("#propaganda-dict-detail-main").addClass("hide");

    } else {
        // 根据条件查询宣教字典数据
        loadPropagandaDict("pcode=" + code, 1);
        // 点击此链接，查询对应其下面的详情内容
        findDetailInDict(code, commonPatientId, '');
    }

}
// 查询宣教字典对应其下面的宣教详情
function findDetailInDict(pCode, patientId, title) {
    $.ajax({
        url : ctx + '/propagandaDetail/findDetailInDict.shtml',
        data : {
            "pCode" : pCode,
            "patientId" : patientId,
            "title" : title,
            "isEnable" : "0",
            "delFlag" : "0"
        },
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            var PropagandaDetailPOData = result.PropagandaDetailPOList;
            var itemHtml = '';
            for (var i = 0; i < PropagandaDetailPOData.length; i++) {
                var item = PropagandaDetailPOData[i];
                itemHtml += '<div class="list-group-item border-bottom-line hand" style="height: 72px;" onclick="getPropagandaDetailById(this,1);">';
                itemHtml += '<input type="hidden" name="data-code" value="' + item.code + '" />';
                itemHtml += '<input type="hidden" name="data-patientName" value="' + item.patientName + '" />';
                itemHtml += '<input type="hidden" name="data-patientId"  value="' + item.patientId + '" />';
                itemHtml += '<input type="hidden" name="data-propaganda-time"  value="' + item.propagandaTime + '" />';
                itemHtml += '<input type="hidden" name="data-propaganda-name"  value="' + item.propagandaName + '" />';
                itemHtml += '<input type="hidden" name="data-propaganda-user-id"  value="' + item.propagandaUserId + '" />';
                itemHtml += '<input type="hidden" name="data-propaganda-Remarks"  value="' + item.propagandaRemarks + '" />';
                itemHtml += '<div class="float-left" >';
                if (item.imagePath == "" || item.imagePath == null) {
                    itemHtml += '<img class="xj-image m-t-8" src="' + ctx + '/assets/img/media-default.png"/></div>';
                } else {
                    itemHtml += '<img class="xj-image m-t-8" src="' + ctx + '/images/' + item.imagePath + '"/></div>';
                }

                itemHtml += '<div class="float-left" style="max-width: 400px;;white-space:nowrap;overflow:hidden;">';
                itemHtml += '<p class="xj-item-title m-t-10 m-l-12">' + item.title + '</p>';
                itemHtml += '<p class="xj-item-title2 m-l-12" name="data-parentName">' + item.parentName + '</p></div>';
                itemHtml += '<img src="' + ctx + '/assets/img/xj-arrow.png" class="float-right margin-top-25 m-l-16 m-r-16"/>';
                itemHtml += '<div class="float-right m-l-12 text-right">';
                itemHtml += '<div class="m-t-10 m-b-8">';
                existImageOrVideo(itemHtml, item.imagePath, item.video);
                itemHtml += '</div><span class="xj-item-title3">发布人：' + convertEmpty(item.releaseName) + '</span></div>';
                if (convertEmpty(item.propStatus) != "" && convertEmpty(item.propStatus) != null) {
                    itemHtml += '<div class="xj-label3 float-right">' + convertEmpty(item.propStatus) + '</div>';
                }
                itemHtml += '</div>';
            }
            $("#propaganda-detail-list-div").html(itemHtml);
        }
    });
}

// 判断图片或者视频是否为空
function existImageOrVideo(itemHtml, image, video) {
    if (image != null && image != "") {
        itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/image.png"/>';
    }
    if (video != null && video != "") {
        itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/audio.png"/>';
        itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/video.png"/>';
    }
}
/**
 * 返回
 */
function goBackInRecord() {
    if ($("#propa-record-detail-main").hasClass("hide")) {
        window.history.go(-1);
    } else {
        $("#propa-dict-record-main").removeClass("hide");
        $("#propa-record-detail-main").addClass("hide")
    }
}
