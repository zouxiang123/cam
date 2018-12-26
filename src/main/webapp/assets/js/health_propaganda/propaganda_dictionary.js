var max_code = 0;
$("#propagandaDictionaryNavId").addClass("active");
$(function() {
    loadPropagandaTree();
});

/**
 * 加载时获得数据
 */
function getDataByLoad() {
    var propagandaDictionaryPOData = '';
    $.ajax({
        url : ctx + '/propagandaDictionary/getAllPropagandaDictionary.shtml',
        type : 'POST',
        dataType : 'json',
        async : false,
        success : function(result) {
            propagandaDictionaryPOData = result.propagandaDictionaryPOList;
            // 设置最大的code
            // max_code = result.propagandaDictionarySize;
        }
    });
    return propagandaDictionaryPOData;
}
/**
 * 加载宣教树形菜单
 */
function loadPropagandaTree() {
    var propagandaNodes = [];
    // 获取所又的宣教字典数据
    var propagandaDictionaryPOData = getDataByLoad();
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
    var propagandaSetting = {
        treeId : "1",
        treeObj : "propagandaTree",
        view : {
            // 鼠标悬浮时显示按钮
            addHoverDom : addHoverDom,
            // 鼠标移开时不显示按钮
            removeHoverDom : removeHoverDom,
        },
        // 必须要设置data,否则折叠，展开的效果显示不出来
        data : {
            key : {},
            simpleData : {
                enable : true
            }
        },
        callback : {
            // 删除节点前调用的函数
            beforeRemove : beforeRemove,
            onClick : onClickNode,
            beforeEditName : zTreeBeforeEditName
        },
        // 可编辑
        edit : {
            enable : true
        }
    }
    $.fn.zTree.init($("#propagandaDictionaryTree"), propagandaSetting, propagandaNodes);
}

// 鼠标悬浮在node时,显示自定义控件按钮:+
function addHoverDom(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_" + treeNode.tId).length > 0)
        return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId + "'  onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_" + treeNode.tId);
    // 将函数绑定到"+"上面
    if (btn)
        btn.bind("click", function() {
            if (treeNode.levelShow == 0) {
                $("input[name='imagePathShow']").css("display", "block");
            } else {
                $("input[name='imagePathShow']").css("display", "none");
            }
            // 将下面的输入框显示出来
            $("[name='propagandaDictName']").val("");
            $("#inputPropagandaDict").css("display", "block");
            $("[name='savePropagandaDict']").attr("status", "add");
            // 设置参数
            setParam(treeNode);
            return false;
        });
};
// 点击节点事件
function onClickNode(event, treeId, treeNode) {
    $("#inputPropagandaDict").css("display", "none");
}
// 鼠标移开node时
function removeHoverDom(treeId, treeNode) {
    $("#addBtn_" + treeNode.tId).unbind().remove();
};
// 删除节点前给提示
function beforeRemove(treeId, treeNode) {
    var zTree = $.fn.zTree.getZTreeObj("propagandaDictionaryTree");
    zTree.selectNode(treeNode);
    // 最顶级'健康宣教'不能删除
    if (treeNode.levelShow == 0) {
        showWarn("此项不能进行删除或编辑");
        return false;
    }
    if (treeNode.isParent) {
        showWarn("请先删除    " + treeNode.name + "  下面所有的项");
        return false;
    }
    showConfirm("确定删除吗？", function() {
        setParam(treeNode);
        deletePropagandaDict();
        SystemDialog.modal('hide');

        return true;
    });
    return false;
}

/**
 * 点击保存按钮
 */
function clickSaveBtn() {
    var status = $("[name='savePropagandaDict']").attr("status");
    if (status == "add") {
        clickBtnSave();
        loadPropagandaTree();
    }
    if (status == "update") {
        editPropagandaDict();
        $("#fileDiv")
                        .html(
                                        '<input type="file" onchange="checkImageType();" name="imagePathShow" style="margin-left:20px;margin-top:10px;display:none;"/>');
        loadPropagandaTree();
    }
}
/**
 * 新增宣教字典
 */
function addPropagandaDictioanry(propagandaName, pcode, level) {
    if (propagandaName == "") {
        showWarn("项目名称不能为空值，请重新填写");
        return;
    }
    // 必须保存图片
    if (level == 0) {
        if ($("[name='imagePathShow']").val() == "" || $("[name='imagePathShow']").val() == null) {
            showWarn("请先选择图片!");
            return false;
        }
    }
    var checkImageconfirm = checkImageType();
    if (checkImageconfirm) {
        var imageFile = $("#dictForm input[name='imagePathShow']").val();
        if (imageFile == "") {
            $("#fileDiv").html('');
        }
        var propagandaDictionaryModel = '';
        var option = {
            url : ctx + '/propagandaDictionary/insertPropagandaDictionary.shtml',
            data : {
                "name" : propagandaName,
                "level" : level * 1 + 1,
                "pcode" : pcode
            },
            dataType : 'JSON',
            async : false,
            loadingMsg : "正在保存，请稍等...",
            success : function(data) {// ajax返回的数据
                /*// 新增完后，自动设置最大的code
                max_code = max_code * 1 + 1;*/
                propagandaDictionaryModel = data.returnData;
            }
        };
        $("#dictForm").ajaxSubmit(option);
        return propagandaDictionaryModel;
    }
}

var commonTreeNode = '';// 当前节点对象
function setParam(privateTreeNode) {
    commonTreeNode = privateTreeNode;
}
/**
 * 点击保存
 */
function clickBtnSave() {
    // 输入的宣教名称
    var inputPropagandaName = $("[name='propagandaDictName']").val();
    var saveModel = addPropagandaDictioanry(inputPropagandaName, commonTreeNode.id, commonTreeNode.levelShow);
    if (saveModel != "fail" && saveModel != false) {
        /*var zTree = $.fn.zTree.getZTreeObj("propagandaDictionaryTree");
        zTree.addNodes(commonTreeNode, {
        	id : saveModel.code,
        	levelShow : saveModel.level,
        	pId : saveModel.pcode,
        	name : saveModel.name,
        	physicalId : saveModel.id
        });*/
        showTips("保存成功^_^");
        $("#inputPropagandaDict").css("display", "none");
        $("#fileDiv")
                        .html(
                                        '<input type="file" name="imagePathShow" onchange="checkImageType();" style="margin-left:20px;margin-top:10px;display:none;"/>');
    } /*else {
       	showWarn("保存失败！");
       }*/

}

/**
 * 删除宣教字典表数据
 */
function deletePropagandaDict() {
    $.ajax({
        url : ctx + '/propagandaDictionary/deletePropagandaDictById.shtml',
        data : {
            "id" : commonTreeNode.physicalId
        },
        type : 'POST',
        dataType : 'json',
        success : function(result) {
            if (result.msg == "success") {
                showTips("删除成功^_^");
                // 重新加载数据
                loadPropagandaTree();
            } else if (result.msg == "fail") {
                showWarn("删除失败！");
            }
        }
    });
}
/**
 * 编辑宣教字典数据
 */
function editPropagandaDict() {
    if ($("[name='propagandaDictName']").val() == "") {
        showWarn("项目名称不能为空值，请重新填写");
        return;
    }
    if ($("[name='imagePathShow']").val() == "" || $("[name='imagePathShow']").val() == null) {
        $("#fileDiv").html('');
    }
    var option = {
        url : ctx + '/propagandaDictionary/updatePropagandaDict.shtml',
        data : {
            "id" : commonTreeNode.physicalId,
            "name" : $("[name='propagandaDictName']").val()
        },
        async : false,
        dataType : 'JSON',
        loadingMsg : "正在保存，请稍等...",
        success : function(result) {// ajax返回的数据
            if (result.msg == "success") {
                showTips("保存成功");
                // 重新加载数据
                loadPropagandaTree();
            } else {
                showWarn("保存失败！");
            }
            $("#inputPropagandaDict").css("display", "none");
        }
    }
    $("#dictForm").ajaxSubmit(option);
    return false;
}

/**
 * 编辑
 */
function zTreeBeforeEditName(treeId, treeNode) {
    if (treeNode.levelShow == 0) {
        showWarn("此项不能进行删除或编辑");
        return false;
    }
    $("[name='propagandaDictName']").val(treeNode.name);
    if (treeNode.levelShow == 1) {
        $("input[name='imagePathShow']").css("display", "block");
    } else {
        $("input[name='imagePathShow']").css("display", "none");
    }
    $("#inputPropagandaDict").css("display", "block");
    $("[name='savePropagandaDict']").attr("status", "update");
    // 设置参数
    setParam(treeNode);
    return false;
}

// 验证图片
function checkImageType() {
    var imageShow = $("[name='imagePathShow']").val();
    if (imageShow != "") {
        var imageType = '.PNG.JPG';
        var FileExt = imageShow.replace(/.+\./, "");// 获取后缀名
        if (imageType.indexOf(("." + FileExt).toUpperCase()) == -1) {
            showWarn("图片格式不正确，请重新选择！");
            $("[name='imagePathShow']").val('');
            return false;
        }
    }
    return true;
}