var dialogStatus = '';
var detailRecordCache;
$(function() {
    $("#detail-dialog").css("margin", "-30px auto");
    $("#detail-dialog .modal-dialog").css("width", "800px");
    var dialog_height = 535;
    $("#detail-dialog .modal-content").css("height", dialog_height + "px");
    $("#detail-dialog .dialog-wrap .list-group").css("height", (dialog_height - 118) + "px");
    // 加载宣教详情数据
    loadPropagandaDetail("delFlag=0&isEnable=false");
    // 加载宣教字典树形菜单数据
    loadPropagandaDictZtree();

    // 树形菜单
    $("[name='btnShowPropagandaDict']").click(function() {
        $("#propagandaDictDiv").toggleClass('hide');

    });

    $("[name='cancelChooseNodes'],[name='chooseType'],[name='confirmChooseNodes']").click(function() {
        $("#propagandaDictDialogDiv").toggleClass('hide');
    });

    $("[name='confirm-choose-dict-btn'],[name='close-choose-dict-btn']").click(function() {
        var treeObj = $.fn.zTree.getZTreeObj("propagandaDictionaryTree");
        var nodes = treeObj.getCheckedNodes(true);
        if (nodes.length > 0) {
            $("[name='btnShowPropagandaDict']").html("已选择(" + nodes.length + ")项");
        } else {
            $("[name='btnShowPropagandaDict']").html("选择");
        }
        searchPropagandaDetail();
        $("#propagandaDictDiv").addClass("hide");
    });

    // 表单重置
    $("[name='add-detail-btn']").click(function() {
        dialogStatus = 'add';
        $(".modal-header h4").html('健康宣教-新增');
        resetDialog();
    });
});

function resetDialog() {
    $("#propagandaDetailForm input").val('');
    $("[name='videoShowTitle']").html('');
    $("[name='videoShowTitle']").siblings("img").css("display", "none");
    $("[name='imageShowTitle']").html('');
    $("[name='imageShowTitle']").siblings("img").css("display", "none");
    var tempHtml = '';
    tempHtml += '<span class="form-span" style="min-width: 50px !important;margin-left:3px ">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;签:</span>';
    tempHtml += '<div class="add-result add-result-number"><input class="personal-input add-number" name="tag" type="text"/>';
    tempHtml += '<img class="delete-icon" onclick="delTagInput(this);" src="' + ctx + '/assets/img/delete.png"></div>';
    tempHtml += '<button type="button" onclick="addTagInput(this);" class="btn btn-default width-76">添加</button>';
    $("#addTagDiv").html(tempHtml);
    $("textarea[name='content']").html('');
}

function showDetailDiv() {
    var id = $("[name='sdr-detail-id']").attr("sdr-detail-id");
    $("[name='msd-video'],[name='msd-image']").removeClass("hide");
    for (var i = 0; i < propagandaListCache.length; i++) {
        var item = propagandaListCache[i];
        if (item.id == id) {
            $("#main-special-detail [name='updateDetailBtn']").attr("main-detail-id", id);
            $("#main-special-detail [name='delDetailBtn']").attr("main-detail-id", id);
            $("#main-special-detail [name='msd-title']").html(item.title);
            $("#main-special-detail [name='msd-releaseName']").html(item.releaseName);
            $("#main-special-detail [name='msd-releaseTime']").html(item.releaseTimeShow);
            $("#main-special-detail [name='msd-content']").html(item.content);
            $("#main-special-detail [name='msd-image']").html(item.realImagePath);
            $("#main-special-detail [name='msd-video']").attr("src", ctx + "/images/" + item.video);
            $("#main-special-detail [name='msd-video']").attr("poster", ctx + "/images/" + item.realImagePath);
            $("#main-special-detail [name='msd-image']").attr("src", ctx + "/images/" + item.realImagePath);
            if (item.video == "" || item.video == null) {
                $("[name='msd-video']").addClass("hide");
                if (item.realImagePath == null || item.realImagePath == "") {
                    $("[name='msd-image']").addClass("hide");
                }
            } else {
                $("[name='msd-image']").addClass("hide");
            }
            var tempHtml = '';
            $("#main-special-detail [name='msd-tag']").siblings("label").remove();
            $("#main-special-detail [name='msd-tag']").after(getTag(tempHtml, item));
            break;
        }
    }
    $("#main-home-page").addClass("hide");
    $("#main-special-detail").removeClass("hide");
}
function showHomePageDiv() {
    $("#main-home-page").removeClass("hide");
    $("#main-special-detail").addClass("hide");
}

// 在宣教详情页面中删除数据
function delFromDetail(dom) {
    var detailId = $(dom).attr("main-detail-id");
    // delRecycle("arrId[" + 0 + "]=" + detailId + "&isEnable=0");
    updatePropagandaDetail("arrId[" + 0 + "]=" + detailId + "&delFlag=1");
    window.location.href = ctx + "/propagandaDetail/view.shtml";
}

// 修改宣教详情
function updateDetail(dom) {
    dialogStatus = 'update';
    $(".modal-header h4").html('健康宣教-修改');
    resetDialog();
    var id = $(dom).attr("main-detail-id");
    for (var i = 0; i < propagandaListCache.length; i++) {
        var item = propagandaListCache[i];
        if (item.id == id) {
            $("#propagandaDetailForm").find("input[name='title']").val(item.title);
            $("#propagandaDetailForm").find("textarea[name='content']").html(item.content);
            $("#propagandaDetailForm").find("input[name='id']").val(item.id);
            $("#propagandaDetailForm").find("input[name='wholePcode']").val(item.wholePcode);
            $("#propagandaDetailForm").find("input[name='wholePcodeShow']").val(item.parentName);
            $("#propagandaDetailForm").find("input[name='pcode']").val(item.pcode);
            $("#propagandaDetailForm").find("label[name='imageShowTitle']").html(getFileTitle(item.imagePath));
            if (getFileTitle(item.imagePath) != "") {
                $("[name='imageShowTitle']").siblings("img").css("display", "block");
            }
            $("#propagandaDetailForm").find("label[name='videoShowTitle']").html(getFileTitle(item.video));
            if (getFileTitle(item.video) != "") {
                $("[name='videoShowTitle']").siblings("img").css("display", "block");
            }
            var tempHtml = '';
            $("#addTagDiv>span:eq(0)").siblings("div").remove();
            $("#addTagDiv>span:eq(0)").after(addTagInputByUpdate(tempHtml, item));
        }
    }
}
/**
 * 修改文件时，删除文件，并且从js缓存中删除 type==0 图片 type==1 视频
 */
function delFileFromCache(detialId, type) {
    for (var i = 0; i < propagandaListCache.length; i++) {
        var item = propagandaListCache[i];
        if (item.id == detialId) {
            if (type == 0) {
                propagandaListCache[i].imagePath = '';
                propagandaListCache[i].realImagePath = '';
            } else if (type == 1) {
                propagandaListCache[i].video = '';
                propagandaListCache[i].videoShow = '';
            }
        }
    }
}
// 获得标题
function getFileTitle(fileTitle) {
    if (fileTitle == null || fileTitle == "") {
        return "";
    } else {
        var titleIndexTempOne = fileTitle.lastIndexOf('/');
        if (titleIndexTempOne > -1) {
            return fileTitle.substring(fileTitle.lastIndexOf('/') + 1, fileTitle.length);
        } else {
            var titleIndexTempTwo = fileTitle.lastIndexOf("\\");
            return fileTitle.substring(fileTitle.lastIndexOf("\\") + 1, fileTitle.length);
        }

    }
}
function addTagInputByUpdate(tempHtml, item) {
    if (item.tag != null && item.tag != "") {
        var tagArr = item.tag.split(',');
        for (var j = 0; j < tagArr.length; j++) {
            tempHtml += '<div class="add-result add-result-number">';
            tempHtml += '<input value="' + tagArr[j] + '" class="personal-input add-number" name="tag" type="text"/>';
            tempHtml += '<img class="delete-icon" onclick="delTagInput(this);" src="' + ctx + '/assets/img/delete.png"></div>';
        }
    }
    return tempHtml;
}

// 加载宣教详情数据
var propagandaListCache;
function loadPropagandaDetail(condition) {
    var codeName = '';
    $.ajax({
        url : ctx + '/propagandaDetail/findRecycleBinList.shtml',
        data : condition,
        loading : true,
        loadingMsg : "正在查询...",
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            // 宣教详情数据
            var propagandaDetailPOData = result.PropagandaDetailPOList;
            // 缓存数据
            propagandaListCache = propagandaDetailPOData;
            var tempHtml = '';
            // 给信息详情按钮设置data-id值
            if (propagandaDetailPOData[0] != null) {
                $("[name='propaDetailInfo']").attr("data-id", propagandaDetailPOData[0].id);
            }
            for (var i = 0; i < propagandaDetailPOData.length; i++) {
                var item = propagandaDetailPOData[i];
                tempHtml += '<div class="list-group-item border-bottom-line" style="height: 72px;">';
                tempHtml += '<ul class="hide"><li><input type="hidden" name="hideDetialId" value="' + item.id + '">'
                tempHtml += '<input type="hidden"  value="' + item.code + '" name="hideCode">';
                tempHtml += '<input type="hidden" value="' + item.pcode + '" name="hPcode"></li></ul>';
                tempHtml += '<div class="float-left"><label for="c1" class="margin-top-25">';
                tempHtml += '<input type="checkbox" name="checkDel" value=""></label>';
                if (item.imagePath == null || item.imagePath == "") {
                    tempHtml += '<img width="50" height="50" src="' + ctx + '/assets/img/media-default.png"/>';
                } else {
                    tempHtml += '<img  width="50" height="50"  src="' + ctx + '/images/' + item.imagePath + '">';
                }
                tempHtml += '</div><div class="float-left" style="margin-top:-7px;max-width: 140px;">';
                tempHtml += '<p class="xj-item-title hand m-t-16 m-l-8" onclick="getSpecialPropaDetailDom(this);">' + item.title + '</p>';
                tempHtml += '<p class="xj-item-title2 m-l-8">' + item.parentName.substring(0, 15) + '</p></div>';
                tempHtml += '<div class="float-right m-l-8 text-right"><div class="m-t-14 m-b-2">';
                if (item.video != null && item.video != "") {
                    tempHtml += '<img class="xj-media" src="' + ctx + '/assets/img/audio.png"/>';
                    tempHtml += '<img class="xj-media" src="' + ctx + '/assets/img/video.png"/>';
                }
                if (item.imagePath != null && item.imagePath != "" && item.imagePath != "null") {
                    tempHtml += '<img class="xj-media" src="' + ctx + '/assets/img/image.png"/>';
                }
                tempHtml += '</div><span class="xj-item-title3 ">发布人：' + item.releaseName + '</span>';
                tempHtml += '</div></div>';
            }
            $("#propagandaDetailDiv").html(tempHtml);
            $("#propagandaDetailDiv>div:eq(0)>div:eq(1)>p:eq(0)").trigger("click");
            // 如果没有数据，则把右边的详情给清空
            if (propagandaDetailPOData.length == 0) {
                $("[name='sdr-detail-id']").css("display", "none");
                $("#special-detail-right [name='sdr-video']").attr("poster", '');
                $("#special-detail-right [name='sdr-video']").attr("src", '');
                $("#special-detail-right [name='sdr-imageShow']").attr("src", '');
                $("#special-detail-right [name='sdr-title']").html('');
                $("#special-detail-right [name='sdr-releaseName']").html('');
                $("#special-detail-right [name='sdr-releaseTime']").html('');
                $("#special-detail-right [name='sdr-content']").html('');
                $("#special-detail-right [name='sdr-title']").html('');
                $("#special-detail-right [name='sdr-tag']").siblings("label").remove();
            } else {
                $("[name='sdr-detail-id']").css("display", "block");
            }
        }
    });
}

// 组装宣教字典 树形菜单
function loadPropagandaDictZtree() {
    var propagandaNodes = [];
    // 获取所又的宣教字典数据
    var propagandaDictionaryPOData = loadPropagandaDict();
    for (var i = 0; i < propagandaDictionaryPOData.length; i++) {
        var tempNode = {
            id : propagandaDictionaryPOData[i].code,
            name : propagandaDictionaryPOData[i].name,
            pId : propagandaDictionaryPOData[i].pcode,
            levelShow : propagandaDictionaryPOData[i].level,
            physicalId : propagandaDictionaryPOData[i].id,
            open : propagandaDictionaryPOData[i].pcode == 0 ? true : false
        };
        propagandaNodes.push(tempNode);
    }
    // 加载页面时加载的树
    var propagandaSettingFirst = {
        check : {
            enable : true,
            nocheckInherit : false,
            // Y 属性定义 checkbox 被勾选后的情况； N 属性定义 checkbox 取消勾选后的情况；"p" 表示操作会影响父级节点；"s" 表示操作会影响子级节点。
            chkboxType : {
                "Y" : "s",
                "N" : "s"
            }
        },
        treeId : "1",
        // 必须要设置data,否则折叠，展开的效果显示不出来
        data : {
            key : {

            },
            simpleData : {
                enable : true
            }
        },
        callback : {
            onClick : setParam
        }
    }
    $.fn.zTree.init($("#propagandaDictionaryTree"), propagandaSettingFirst, propagandaNodes);
    // 新增时加载的树
    var propagandaSettingSecond = {
        treeId : "1",
        // 必须要设置data,否则折叠，展开的效果显示不出来
        data : {
            key : {

            },
            simpleData : {
                enable : true
            }
        },
        callback : {
            onClick : setParam
        }
    }
    // 点击新增 加载数据
    $.fn.zTree.init($("#propagandaDictDialog"), propagandaSettingSecond, propagandaNodes);
}
// 查询宣教宣教 字典数据
function loadPropagandaDict() {
    var propagandaDictionaryPOData = '';
    $.ajax({
        url : ctx + '/propagandaDictionary/getAllPropagandaDictionary.shtml',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function(result) {
            propagandaDictionaryPOData = result.propagandaDictionaryPOList;
        }
    });
    return propagandaDictionaryPOData;
}

// 查询宣教详情数据
function searchPropagandaDetail() {
    // 获取树形菜单选中的节点数据的code，根据宣教详情的pcode==code查询
    var treeObj = $.fn.zTree.getZTreeObj("propagandaDictionaryTree");
    var nodes = treeObj.getCheckedNodes(true);
    var pCodeArr = 'delFlag=0';
    for (var i = 0; i < nodes.length; i++) {
        pCodeArr += ('&pCodeArr[' + i + ']=' + nodes[i].id);
    }
    pCodeArr += '&isEnable=false';

    if ($("#searchContent").val() != "" && $("#searchContent").val() != null) {
        pCodeArr += '&title=' + $("#searchContent").val();
    }
    // 查询
    loadPropagandaDetail(pCodeArr);
}

// 删除宣教信息详情
function delPropagandaDetail() {
    var arrId = 'delFlag=1';
    $("input[name='checkDel']:checked").each(function(index, obj) {
        var tempId = $(this).parents("div:eq(1)").find("ul li input[name='hideDetialId']").val();
        arrId += '&arrId[' + index + ']=' + tempId;
    });
    if (arrId != 'delFlag=1') {
        updatePropagandaDetail(arrId);
    } else {
        showWarn("请先选择项目详情 ,删除失败!");
        return;
    }
    // 加载宣教详情数据
    loadPropagandaDetail("delFlag=0&isEnable=false");
}

// 修改宣教详情数据
function updatePropagandaDetail(tempCondition) {
    $.ajax({
        url : ctx + '/propagandaDetail/updatePropagandaDetail.shtml',
        data : tempCondition,
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function(result) {
            if (result.msg == "success") {
                showTips("操作成功!");
            } else {
                showWarn("操作失败！");
            }
        }
    });
}

// 新增宣教详情
function savePropagandaDetail() {
    var checkFileResult = vilidatekDetail();
    if (checkFileResult) {
        var option = {
            url : ctx + '/propagandaDetail/savePropagandaDetail.shtml',
            dataType : 'JSON',
            loading : true,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                $("#uploadImageShow").html('<input type="file" name="imageShow" onchange="checkImageType();" style="display: inline-block;"/>');
                $("#uploadVideoShow").html('<input type="file" name="videoShow" onchange="checkVideoType(this);" style="display: inline-block;"/>');
                if (data.msg == "success") {
                    showTips("保存成功！");
                    window.location.href = ctx + '/propagandaDetail/view.shtml';
                } else {
                    showWarn("保存失败");
                }
            }
        };
        $("#propagandaDetailForm").ajaxSubmit(option);
        $("[name='modal-close-btn']").trigger("click");
        return false;
    }
    showWarn("你所选择的  文件 有误或者输入的有空值！请注意填写");
    return false;
}
// 递归 获取选中节点所有的父节点
function recursionWholeCode(treeNode) {
    // 最顶级的pId永远为0
    if (treeNode.pId == null || treeNode.pId == "0") {
        wholeCode += (wholeCode != '' ? ',' + treeNode.id : treeNode.id);// 当前节点多有的父级 code
        wholeCodeName += (wholeCodeName == '' ? treeNode.name : '<' + treeNode.name);// 当前节点所有父级的name
        clickCode = (clickCode == '' ? treeNode.id : clickCode);
        return;
    } else {
        wholeCode += (wholeCode == '' ? treeNode.id : ',' + treeNode.id);// 当前节点多有的父级 code
        wholeCodeName += (wholeCodeName == '' ? treeNode.name : '<' + treeNode.name);// 当前节点所有父级的name
        clickCode = (clickCode == '' ? treeNode.id : clickCode);// 点击节点的id
        recursionWholeCode(treeNode.getParentNode());
    }
}
// 当前节点所有父节点code,当前节点所有父节点name，当前节点
var wholeCode, wholeCodeName, clickCode;
function setParam(event, treeId, treeNode) {
    wholeCode = '';
    wholeCodeName = '';
    clickCode = '';
    recursionWholeCode(treeNode);
    $("[name='wholePcodeShow']").val(wholeCodeName);
    $("[name='wholePcode']").val(wholeCode);
    $("[name='pcode']").val(clickCode);
    $("#propagandaDictDialogDiv").toggleClass("hide");
}

// 验证图片
function checkImageType() {
    var imageShow = $("[name='imageShow']").val();
    if (imageShow != "") {
        var imageType = '.PNG.JPG';
        var FileExt = imageShow.replace(/.+\./, "");// 获取后缀名
        if (imageType.indexOf(("." + FileExt).toUpperCase()) == -1) {
            showWarn("图片格式不正确，请重新选择！");
            $("[name='imageShow']").val('');
            return false;
        } else {
            $("[name='imageShowTitle']").html(getFileTitle(imageShow));
            $("[name='imageShowTitle']").siblings("img").css("display", "block");
        }
    }
}
// 验证视频
function checkVideoType(obj) {
    var videoShow = $("[name='videoShow']").val();

    // 判断文件的大小
    var fileSize = 0;
    var isIE = /msie/i.test(navigator.userAgent) && !window.opera;
    if (isIE && !obj.files) {
        var filePath = obj.value;
        var fileSystem = new ActiveXObject("Scripting.FileSystemObject");
        var file = fileSystem.GetFile(filePath);
        fileSize = file.Size;
    } else {
        fileSize = obj.files[0].size;
    }
    fileSize = Math.round(fileSize / 1024 * 100) / 100; // 单位为KB
    if (fileSize >= (500485760 / 1024)) {// 500M
        showWarn("选择的文件最大大小只能是500M，请重新上传!");
        return false;
    }

    if (videoShow != "") {
        var videoType = '.MP4.MP3';
        var videoExt = videoShow.replace(/.+\./, "");// 获取后缀名
        if (videoType.indexOf(("." + videoExt).toUpperCase()) == -1) {
            showWarn("视频选择错误,目前只支持.MP4格式的视频或者.MP3格式音频，请重新选择！");
            $("[name='videoShow']").val('');
            return false;
        } else {
            $("[name='videoShowTitle']").html(getFileTitle(videoShow));
            $("[name='videoShowTitle']").siblings("img").css("display", "block");
        }
    }
}

// 上传文件时，判断文件类型
function vilidatekDetail() {
    // 验证标题
    if ($("[name='title']").val() == "" || $("[name='title']").val() == null) {
        showWarn("请输入标题");
        return false;
    }
    // 验证类别
    if ($("[name='wholePcode']").val() == null || $("[name='wholePcode']").val() == "") {
        showWarn("请选择类别");
        return false;
    }
    // 验证输入的信息内容
    if ($("[name='content']").val() == "" || $("[name='content']").val() == null) {
        showWarn("请输入宣教内容");
        return false;
    }
    // 判断标签是否输入了逗号
    var status = true;
    $("#addTagDiv input").each(function(index, obj) {
        var ill = $(this).val().indexOf(',');
        if (ill > -1) {
            status = false;
            return false;
        }
        if ($(this).val() == "") {
            $(this).parent().remove();
        }
    });
    if (status == false) {
        return false;
    }
    // 验证图片
    var imageShow = $("[name='imageShow']").val();
    if (imageShow != "" && imageShow != null) {
        var imageType = '.PNG.JPG';
        var FileExt = imageShow.replace(/.+\./, "");// 获取后缀名
        if (imageType.indexOf(("." + FileExt).toUpperCase()) == -1) {
            showWarn("图片格式不正确，请重新选择！");
            $("[name='imageShow']").val('');
            return false;
        }
    } else {
        $("#uploadImageShow").html('');
    }
    // 验证视频
    var videoShow = $("[name='videoShow']").val();
    if (videoShow != "" && videoShow != null) {
        var videoType = '.MP4.MP3';
        var videoExt = videoShow.replace(/.+\./, "");// 获取后缀名
        if (videoType.indexOf(("." + videoExt).toUpperCase()) == -1) {
            showWarn("视频格式不正确，目前只支持mp4格式视频或者.MP3格式的音频，请重新选择！");
            $("[name='videoShow']").val('');
            return false;
        }
    } else {
        $("#uploadVideoShow").html('');
    }
    return true;
}
// 点击确定获取树形菜单上面的勾选的值
function getCheckBoxValue() {
    // 获取树形菜单选中的节点数据的code，根据宣教详情的pcode==code查询
    var treeObj = $.fn.zTree.getZTreeObj("propagandaDictDialog");
    var nodes = treeObj.getCheckedNodes(true);
    var spTypeHtml = '';
    for (var i = 0; i < nodes.length; i++) {
        spTypeHtml += (i == 0 ? nodes[i].name : ">" + nodes[i].name);
    }
    $("#inType").val(spTypeHtml);
}

// 点击左边某个项目类别，对应的加载右边的详情内容
function getSpecialPropaDetailDom(dom) {
    $(dom).parents("div.list-group-item").siblings().find("div:eq(1) p").removeClass("active");
    $(dom).parents("div.list-group-item").siblings().find("div:eq(2) span").removeClass("active");
    $(dom).parent().find("p").addClass("active");
    $(dom).parent().next().find("span").addClass("active");
    var hideId = $(dom).parents("div:eq(1)").find("ul li input[name='hideDetialId']").val();
    $("#special-detail-right").find("label[name='sdr-detail-id']").attr("sdr-detail-id", hideId);
    getDetailFromPropagandaListCache(hideId);
}

// 点击左边列表，加载右边详情
function getDetailFromPropagandaListCache(hideId) {
    $("[name='sdr-tag']").siblings('label').remove();
    $("[name='sdr-video']").removeClass("hide").siblings("img").removeClass("hide");
    for (var i = 0; i < propagandaListCache.length; i++) {
        var item = propagandaListCache[i];
        if (item.id == hideId) {
            $("#special-detail-right [name='sdr-video']").attr("poster", ctx + "/images/" + item.realImagePath);
            $("#special-detail-right [name='sdr-video']").attr("src", ctx + "/images/" + item.video);
            $("#special-detail-right [name='sdr-imageShow']").attr("src", ctx + "/images/" + item.realImagePath);
            $("#special-detail-right [name='sdr-title']").html(item.title);
            $("#special-detail-right [name='sdr-releaseName']").html(item.releaseName);
            $("#special-detail-right [name='sdr-releaseTime']").html(item.releaseTimeShow);
            $("#special-detail-right [name='sdr-content']").html(item.content);
            $("#special-detail-right [name='sdr-title']").html(item.title);
            var tempHtml = '';
            $("#special-detail-right [name='sdr-tag']").after(getTag(tempHtml, item));
            if (item.video != null && item.video != "") {
                $("[name='sdr-video']").siblings("img").addClass("hide");
            } else if (item.video == null || item.video == "") {
                $("[name='sdr-video']").addClass("hide");
            }
        }
    }
}

function getTag(tempHtml, item) {
    if (item.tag != null && item.tag != "") {
        var tagArr = item.tag.split(',');
        for (var j = 0; j < tagArr.length; j++) {
            tempHtml += '<label class="xt-check-label2">' + tagArr[j] + '</label>';
        }
    }
    return tempHtml;
}

// 查询回收站列表数据
function findRecycleBinList(dom, type) {
    $(dom).addClass("active").siblings().removeClass("active");
    if (type == 1) {
        $("#detail-main").removeClass("hide");
        $("#recycle-main").addClass("hide");
        findRecycleBinListFun("delFlag=0&isEnable=false");
    } else if (type == 2) {
        $("#detail-main").addClass("hide");
        $("#recycle-main").removeClass("hide");
        findRecycleBinListFun("delFlag=1&isEnable=false");
    }
}
// 查询回收站列表数据Fun
function findRecycleBinListFun(search) {
    $.ajax({
        url : ctx + '/propagandaDetail/findRecycleBinList.shtml',
        data : search,
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            var PropagandaDetailPOData = result.PropagandaDetailPOList;
            var itemHtml = '';
            for (var i = 0; i < PropagandaDetailPOData.length; i++) {
                var item = PropagandaDetailPOData[i];
                itemHtml += '<div class="list-group-item border-bottom-line" style="height: 72px;">';
                itemHtml += '<ul><li><input type="hidden" value="' + item.id + '"></li></ul>';
                itemHtml += '<div class="float-left"><label for="" class="margin-top-25">';
                itemHtml += '<input  type="checkbox" name="checkboxRecycleBin" value="" ></label>';
                itemHtml += '<img class="xj-image" src="' + ctx + '/images/' + item.imagePath + '"/></div>';
                itemHtml += '<div class="float-left"><p class="xj-item-title m-t-16 m-l-8">' + item.title + '</p>';
                itemHtml += '<p class="xj-item-title2 m-l-8">' + item.parentName + '</p></div>';
                itemHtml += '<div class="float-right margin-left-48 margin-top-20 text-right">';
                itemHtml += '<button type="button" class="btn btn-bg-red" onclick="clearRecycle(this,0);">清空</button>';
                itemHtml += '<button type="button" class="btn btn-def" onclick="recoverRecycle(this,0);">恢复</button></div>';
                itemHtml += '<div class="float-right m-l-8 text-right"><div class="m-t-14 m-b-2">';
                if (item.video != null) {
                    itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/video.png"/>';
                    itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/audio.png"/>';
                }
                if (item.imagePath != null) {
                    itemHtml += '<img class="xj-media" src="' + ctx + '/assets/img/image.png"/>';
                }
                itemHtml += '</div><span class="xj-item-title3">发布人：' + item.releaseName + '</span></div></div>';
            }
            $("#recycleList").html(itemHtml);
        }
    });
}
// 全选回收站内容
function chooseAll() {
    // 判断是否被选中
    var tempValue = $("input[name='allChooseBtn']").is(":checked");
    if (tempValue) {
        $("input[name='checkboxRecycleBin']").prop("checked", "true");
    } else {
        $("input[name='checkboxRecycleBin']").removeProp("checked");
    }
}
// 清空回收站内容
function clearRecycle(dom, num) {
    var search = '';
    if (num == 1) {
        $("[name='checkboxRecycleBin']:checked").each(function(index, obj) {
            var arrId = $(this).parents("div:eq(1)").find("ul:eq(0) li input:eq(0)").val();
            search += (index == 0 ? 'arrId[' + index + ']=' + arrId : '&arrId[' + index + ']=' + arrId);
        });

    } else if (num == 0) {
        var id = $(dom).parents("div:eq(1)").find("ul li:eq(0) input:hidden").val();
        search += 'arrId[' + 0 + ']=' + id;
    }
    if (search == '') {
        showWarn("请选选择宣教内容");
        return;
    }
    search += '&isEnable=true';
    delRecycle(search);
    // 重新加载
    findRecycleBinListFun("delFlag=1&isEnable=false");
}
// 删除回收站内容
function delRecycle(search) {
    $.ajax({
        url : ctx + '/propagandaDetail/delPropagandaDetailById.shtml',
        data : search,
        type : 'POST',
        async : false,
        dataType : 'json',
        success : function(result) {
            if (result.msg == "success") {
                showTips("操作成功！");
            } else {
                showWarn("操作失败！");
            }
        }
    });
}
// 恢复回收站内容
function recoverRecycle(dom, num) {
    var search = 'delFlag=0';
    if (num == 1) {
        $("[name='checkboxRecycleBin']:checked").each(function(index, obj) {
            var arrId = $(this).parents("div:eq(1)").find("ul li:eq(0) input").val();
            search += '&arrId[' + index + ']=' + arrId;
        });
    } else if (num == 0) {
        var id = $(dom).parents("div:eq(1)").find("ul li:eq(0) input:hidden").val();
        search += '&arrId[' + 0 + ']=' + id;
    }
    if (search == 'delFlag=0') {
        showWarn("请选选择宣教内容");
        return;
    }
    // 修改
    updatePropagandaDetail(search);
    // 重新加载
    findRecycleBinListFun("delFlag=1&isEnable=false");
}

// 添加标签输入框
function addTagInput(dom) {
    if ($("input[name='tag']").length == 0) {
        var itemHtml = '';
        itemHtml += '<div class="add-result add-result-number"><input class="personal-input add-number" name="tag" type="text"/>';
        itemHtml += '<img class="delete-icon" onclick="delTagInput(this);" src="' + ctx + '/assets/img/delete.png"></div>';
        $(dom).before(itemHtml);
    } else {
        var ill = $(dom).prev().find("input").val();
        if (ill == "") {
            showWarn("不能输入空值");
            return false;
        }
        if (ill.indexOf(',') > -1) {
            showWarn("不能输入','特殊字符");
            $(dom).prev().find("input").val('');
            return false;
        }
        if ($("input[name='tag']").length >= 10) {
            showWarn("最多只能拥有10个标签");
            return false;
        }
        $("input[name='tag']").attr("readonly", "true");
        var itemHtml = '';
        itemHtml += '<div class="add-result add-result-number"><input class="personal-input add-number" name="tag" type="text"/>';
        itemHtml += '<img class="delete-icon" onclick="delTagInput(this);" src="' + ctx + '/assets/img/delete.png"></div>';
        $(dom).before(itemHtml);
    }
}
// 删除标签
function delTagInput(dom) {
    $(dom).parent("div:eq(0)").remove();
}
/**
 * 删除文件 type=0 图片, type=1 视频
 */
function delFile(dom, type) {
    if (dialogStatus = 'update') {
        showConfirm("确定删除吗？", function() {
            var id = $("#propagandaDetailForm input[name='id']").val();
            if (type == 0) {
                updateDetailFile("imagePath=&realImagePath=&id=" + id);
            }
            if (type == 1) {
                updateDetailFile('video=&id=' + id);
            }
            // 从缓存中删除id
            delFileFromCache(id, type);
            SystemDialog.modal('hide');
        });
    }
    $(dom).siblings("label").html('');
    $(dom).css("display", "none");
}

/**
 * 修改宣教内容的文件
 */
function updateDetailFile(search) {
    $.ajax({
        url : ctx + '/propagandaDetail/updateDetailFile.shtml',
        data : search,
        loading : true,
        loadingMsg : "正在保存，请稍等...",
        type : 'POST',
        dataType : 'json',
        success : function(result) {
        }
    });
}