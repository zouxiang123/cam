// 为了控制echarts图表数据显示与否
var isShow1 = true;
var isShow2 = true;
var chart1Datas;
var chart1DataNames;
var chart2Title;
var chart2Xarray;
var chart2CountList;
var chart2PercentList;
var tabCount; // 当前打开的tab数量

$(function() {
    // 日历控件
    layui.use('laydate', function() {
        var laydate = layui.laydate;
        laydate.render({
            elem : '#year',
            type : 'year',
            theme : '#31AAFF',
            btns : [ 'confirm' ]
        });

        laydate.render({
            elem : '#startDate',
            type : 'year',
            theme : '#31AAFF',
            btns : [ 'confirm' ]
        });

        laydate.render({
            elem : '#endDate',
            type : 'year',
            theme : '#31AAFF',
            btns : [ 'confirm' ]
        });
    })
    $("[name='allCondition_one']").hide();
    $("div [name='allConditionForm_one']").hide();
    $("#diagnosis_table").show();
    $("#oneDiagnosis_table").hide();
    $("#chart1").show();
    $("#patient_table").hide();
    $("#shownum").show();
    $("#year").val(new Date().getFullYear());

    // 初始化树
    tree.init("tree_year", null);
    tree.init("tree_one", null);
    countYearDiagnosisByCondition();
    $("#disease_shownum").change(function() {
        if (!isEmpty($("#yearLable").attr("class"))) {
            if ($(this).is(':checked')) {
                isShow1 = true;
                creatEchart(chart1Datas, chart1DataNames, isShow1);
            } else {
                isShow1 = false;
                creatEchart(chart1Datas, chart1DataNames, isShow1);
            }
        }
        if (!isEmpty($("#disease").attr("class"))) {
            if ($(this).is(':checked')) {
                isShow2 = true;
                creatEchartTwo(chart2Title, chart2Xarray, chart2CountList, isShow2, chart2PercentList);
            } else {
                isShow2 = false;
                creatEchartTwo(chart2Title, chart2Xarray, chart2CountList, isShow2, chart2PercentList);
            }
        }
    });
});

/**
 * 数字验证
 * 
 * @returns {Boolean}
 */
function validate(minAge, maxAge, minDialysisAge, maxDialysisAge) {
    var reg = /^([1-9]\d*|[0]{1,1})$/;
    if (isNotBlank(minAge)) {
        if (reg.test(minAge) == false) {
            showTips("最小年龄格式填写不正确");
            return false;
        }
    }
    if (isNotBlank(maxAge)) {
        if (reg.test(maxAge) == false) {
            showTips("最大年龄格式填写不正确");
            return false;
        }
    }

    if (isNotBlank(minDialysisAge)) {
        if (reg.test(minDialysisAge) == false) {
            showTips("最小透析龄格式填写不正确");
            return false;
        }
    }
    if (isNotBlank(maxDialysisAge)) {
        if (reg.test(maxDialysisAge) == false) {
            showTips("最大透析龄格式填写不正确");
            return false;
        }
    }

    return true;
}
/**
 * 报表设置重新加载数据
 */
$("#submitButton_year").click(function() {
    var diagonsisItemCodes = tree.getCheckNodes("tree_year"); // 所有的原发病的叶子节点
    if (diagonsisItemCodes.length == 0) {
        showWarn("至少选中一种原发病！");
        return;
    }
    var maxAge = $("#allCondition_year #maxAge").val();
    var minAge = $("#allCondition_year #minAge").val();
    var minDialysisAge = $("#allCondition_year #minDialysisAge").val();
    var maxDialysisAge = $("#allCondition_year #maxDialysisAge").val();
    if (validate(minAge, maxAge, minDialysisAge, maxDialysisAge)) {
        countYearDiagnosisByCondition($("#yearLable"));
    }

});

/**
 * 报表设置重新加载数据
 */
$("#submitButton_one").click(function() {
    var diagonsisItemCodes = tree.getCheckNodes("tree_one"); // 所有的原发病的叶子节点
    if (diagonsisItemCodes.length == 0) {
        showWarn("至少选中一种原发病！");
        return;
    }
    if (diagonsisItemCodes.length > 1) {
        showWarn("只能选择一种原发病！");
        return;
    }
    var maxAge = $("#allCondition_one #maxAge").val();
    var minAge = $("#allCondition_one #minAge").val();
    var minDialysisAge = $("#allCondition_one #minDialysisAge").val();
    var maxDialysisAge = $("#allCondition_one #maxDialysisAge").val();

    if (validate(minAge, maxAge, minDialysisAge, maxDialysisAge)) {
        getOneDiagnosisData($("#disease"));
    }
});

/**
 * 获得数据年度统计报表
 */
function countYearDiagnosisByCondition(dom) {
    $("[name='allCondition_one']").hide();
    $("div[name='allConditionForm_one']").hide();
    $("[name='allCondition_year']").show();
    $(dom).addClass("active").siblings("span").removeClass("active");
    $("#diagnosis_table").show();
    $("#chart1").show();
    $("#shownum").show();
    $("#oneDiagnosis_table").hide();
    $("#patient_table").hide();

    // 如果一种原发病都没有选 默认查询所有
    var diagonsisItemCodes = tree.getCheckNodes("tree_year").toString(); // 所有的原发病的叶子节点
    if (isEmpty(diagonsisItemCodes)) {
        var treeObj = $.fn.zTree.getZTreeObj("tree_year");
        treeObj.checkAllNodes(true);
    }
    diagonsisItemCodes = tree.getCheckNodes("tree_year").toString();
    $("#shownum").css("right", "40px");
    $.ajax({
        url : ctx + "/report/diagnosis/countYearDiagnosisByCondition.shtml",
        type : "post",
        dataType : "json",
        data : $('#allCondition_year').serialize() + "&diagonsisItemCodes=" + diagonsisItemCodes,
        async : false,
        success : function(data) {
            if (data.status == 1) {
                // 图表数据
                var datas = [];
                // 图标名称
                var dataNames = [];
                // 遍历数据组装数据内容
                $.each(data.data, function(i, item) {
                    // 报表图标数据
                    var name =item.itemName;
                    datas.push({
                        value : item.count,
                        name : name
                    });
                    dataNames.push(name);
                });
                // 初始化图标数据
                creatEchart(datas, dataNames, isShow1);
                chart1Datas = datas;
                chart1DataNames = dataNames;
                loadYearTable(data.data);
            }
        }
    });
}

/**
 * 获得患者详情
 */
function getPatientDetails(itemCode, itemName, year, event) {
     tabCount=$("#label").children("span").length;
     if ((tabCount-$("#" + itemCode + year).length )<8) {
    $("[name='allCondition_one']").hide();
    $("[name='allCondition_year']").hide();
    $("div[name='allConditionForm_one']").hide();
    $("div[name='allConditionForm_year']").hide();
    $("#label").find("span").removeClass("active");
    if (!isNotBlank(itemCode) || itemCode == "qb100000") {
        itemName = "全部";
    }
    // 判断是否存在table
    var isExit = false;
    if ($("#" + itemCode + year).length > 0) {
        $("#" + itemCode + year).addClass("active").siblings().removeClass("active");
        isExit = true;
    }
    var diagonsisItemCodes = itemCode;
    if (itemName == "全部") { // 如果为全部 传的参数应该是 选中的节点的值
        diagonsisItemCodes = tree.getCheckNodes("tree_year").toString();
        itemCode = '';
    }
    if (isEmpty(itemCode)) {
        if ($("#qb100000" + year).length >= 1) {
            $("#qb100000" + year).addClass("active");
            isExit = true;
        }
    }

    // 获取原发病类型
    $.ajax({
        url : ctx + "/report/diagnosis/getPatientByCondition.shtml",
        type : "post",
        dataType : "json",
        data : $('#allCondition_year').serialize() + "&diagonsisItemCodes=" + diagonsisItemCodes,
        async : false,
        success : function(data) {
            if (data.status == 1) {
                if (!isNotBlank(itemCode)) {
                    itemCode = "qb100000";
                }
                if (!isExit) {
                    var tabsWidth = 356;
                    $(".bed-head .tab-head-text > span").each(function() {
                        tabsWidth += $(this).width() + 26;
                    });
                    if (tabsMaxWidth - tabsWidth < 0) {
                        showWarn("您打开的页面过多");
                        $("#yearLable").attr("class","active");
                        return false;
                    }
                    $(".bed-head .tab-head-text").width(tabsWidth);
                    var html = '<span class="active"  id="' + itemCode + '' + year + '" onclick="getPatientDetails(\'' + itemCode + '\', \''
                                    + itemName + '\', \'' + year + '\',event)"  type="3">';
                    html += "<i>" + year + itemName + "</i>";
                    html += "<i class='icon-close ml-6 opacity-5 fs-12'  onclick=\"closeTab(0,this,event)\"></i></span>"
                    $("#label").append(html);
                    
                    
                }
                $("#oneDiagnosis_table").hide();
                $("#diagnosis_table").hide();
                $("#chart1").hide();
                $("#patient_table").show();
                $("#shownum").hide();
                var html = "";
                $.each(data.data, function(i, item) {
                    html += '<tr>';
                    html += '<td style="width: 10%">' + item.name + '</td>';
                    html += '<td style="width: 10%">' + item.registerTime + '</td>';
                    html += '<td style="width: 80%">' + convertEmpty(item.content) + '</td>';
                    html += '</tr>';
                });
                $("#patient_body").html(html);
            }
        }
    });
    event.stopPropagation(); // 阻止冒泡
     }else {
        showWarn("标签打开最多八个");
        $("#yearLable").attr("class","active");
        return;
    }
}

/**
 * 关闭tab
 */
function closeTab(type, dom, event) {
    $(dom).parent().remove();
    $("#patient_table").hide();
    if (type == 1) {// 原发病统计
        $("#disease").click();
    } else {
        $("#yearLable").click();
    }
    event.stopPropagation(); // 阻止冒泡
}
/**
 * 单一原发病统计
 */
function getOneDiagnosisData(dom) {
    $("[name='allCondition_year']").hide();
    $("div[name='allConditionForm_year']").hide();
    $("[name='allCondition_one']").show();
    $(dom).addClass("active").siblings("span").removeClass("active");
    $("#oneDiagnosis_table").show();
    $("#diagnosis_table").hide();
    $("#chart1").show();
    $("#patient_table").hide();
    $("#shownum").show();
    $("#shownum").css("right", "109px");
    var itemCode = tree.getCheckNodes("tree_one"); // 所有的原发病的叶子节点
    if (itemCode.length > 1) {
        itemCode = "";
    } else {
        itemCode = itemCode.toString();
    }
    $.ajax({
        url : ctx + "/report/diagnosis/countDiagnosisByCondition.shtml",
        type : "post",
        dataType : "json",
        data : $('#allCondition_one').serialize() + "&diagonsisItemCode=" + itemCode,
        async : false,
        success : function(data) {
            debugger
            if (data.status == 1 && data.data!=null) {
                // 选中加载的数据的树节点
                if ((!isNotBlank($("#startDate").val()) && !isNotBlank($("#endDate").val()))) { // 开始时间和结束时间为空 表示第一次加载
                    $("#startDate").val(new Date().pattern("yyyy") - 2);
                    $("#endDate").val(new Date().pattern("yyyy"));
                }
                loadOneTable(data.data);

                var itemCode = data.itemCode;
                var treeObj = $.fn.zTree.getZTreeObj("tree_one");
                treeObj.checkAllNodes(false);
                treeObj.checkNode(treeObj.getNodeByParam("itemCode", itemCode), true, true);

                var title = data.itemName;
                var xArray = [];
                var countList = [];
                var percentList = [];
                $.each(data.data, function(i, item) {
                    percentList.push(((item.count / item.countAll) * 100).toFixed(2));
                    xArray.push(item.year);
                    countList.push(item.count);
                });
                // 标题 ，年份数组，数据集合
                creatEchartTwo(title, xArray, countList, isShow2, percentList);
                chart2Title = title;
                chart2Xarray = xArray;
                chart2CountList = countList;
                chart2PercentList = percentList;
            }
        }
    });
}

/**
 * 加载年度统计饼图数据
 */
function creatEchart(datas, dataNames, isShow1) {
    var myChart1 = echarts.init(document.getElementById("chart1"), parent.statementSkin);
    var option1 = {
        title : {
            text : '',
            subtext : '',
        },
        tooltip : {
            trigger : 'item',
            formatter : "{b} : {c} ({d}%)"
        },
        toolbox : {
            show : true,
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存为图片"
                }
            },
            right : '10',
            top : '12'
        },
        legend : {
            orient : 'vertical',
            x : '70%',
            y : 'center',
            data : dataNames
        },
        series : [ {
            type : 'pie',
            radius : '55%',
            center : [ '45%', '45%' ],
            data : datas,
            itemStyle : {
                normal : {
                    label : {
                        show : isShow1,
                        formatter : '{b} : {c} ({d}%)'
                    },
                    labelLine : {
                        show : isShow1
                    }
                }
            }

        } ]
    };
    myChart1.setOption(option1);
}

/**
 * 原发病柱状图
 */
function creatEchartTwo(title, xArray, countList, isShow2, percentList) {
    var myChart2 = echarts.init(document.getElementById('chart1'), parent.statementSkin);
    var option2 = {
        title : {
            text : title,
            x : 'center',
            top : '20'
        },
        grid : {
            bottom : '15%',
            top : '30%'
        },
        tooltip : {
            trigger : 'axis'
        },
        toolbox : {
            feature : {
                saveAsImage : {
                    show : true,
                    title : "保存为图片"
                },
                restore : {
                    show : true,
                    title : "还原"
                },
                magicType : {
                    show : true,
                    type : [ 'line', 'bar' ],
                    title : {
                        line : "切换为折线图",
                        bar : "切换为柱状图"
                    }
                }
            },
            right : '10',
            top : '12'
        },
        xAxis : [ {
            type : 'category',
            data : xArray,
            axisPointer : {
                type : 'shadow'
            }
        } ],
        yAxis : [ {
            type : 'value',
            name : '数量',
        }, {
            type : 'value',
            name : '百分比',
            axisLabel : {
                formatter : '{value} %'
            }
        } ]
    };
    var series = [];
    var titles = new Array("数量", "占比")
    var datas = new Array(countList, percentList)
    for (var i = 0; i < titles.length; i++) {
        var item = {};
        item.name = titles[i];
        item.data = datas[i];
        if (i == titles.length - 2) {
            item.type = 'bar';
            item.itemStyle = {
                normal : {
                    label : {
                        show : isShow2
                    },
                    labelLine : {
                        show : isShow2
                    }
                }
            }
        } else {
            item.type = 'line';
            item.yAxisIndex = 1;
            item.itemStyle = {
                normal : {
                    label : {
                        show : isShow2
                    },
                    labelLine : {
                        show : isShow2
                    }
                }
            }
        }
        series.push(item);
    }
    option2.series = series;
    myChart2.setOption(option2);
}
/**
 * 加载年度原发病table
 */
function loadYearTable(data) {
    var year = $("#year").val();
    if (!isEmpty(data)) {
        var html = "";
        var sumNum = 0;
        $.each(data, function(i, item) {
            sumNum += item.count;
        });
        $.each(data, function(i, item) {
            html += '<tr>';
            html += '<td>' + item.itemName + '</td>';
            html += '<td>';
            html += '<button type="button" class="u-btn-blue" text style="text-decoration: underline"  onclick="getPatientDetails(\'' + item.itemCode
                            + '\', \'' + item.itemName + '\', \'' + year + '\',event)">' + item.count + '</button>';
            html += '</td>';
            html += '<td>' + (item.count / sumNum).toPercent() + '</td>';
            html += ' </tr>';
        });
        html += '<tr>';
        html += '<td>总计</td>';
        html += '<td>';
        if (sumNum == 0) {
            html += ' <button type="button" text >' + sumNum + '</button>';
        } else {
            html += ' <button type="button" class="u-btn-blue" text style="text-decoration: underline"  onclick=getPatientDetails("","",\'' + year
                            + '\',event)>' + sumNum + '</button>';
        }
        html += '</td>';
        html += '<td>100%</td>';
        html += '</tr>';
        $("#table_tbody").html(html);
    }
}

/*
 * 单一原发病统计table
 */
function loadOneTable(data) {    
    if (!isEmpty(data)) {
        var html = "";
        $.each(data, function(i, item) {
            html += '<tr>';
            html += '<td>' + item.year + '</td>';
            html += '<td>';
            html += '<button type="button" class="u-btn-blue" text style="text-decoration: underline"  onclick="getPatientDetailsByYear(\''
                            + item.year + '\',\'' + item.itemCode + '\',\'' + item.itemName + '\',event)" >' + item.count + '</button>';
            html += '</td>';
            html += '<td>' + (item.count / item.countAll).toPercent() + '</td>';
            html += '</tr>';
        });
        $("#one_diagnosis_body").html(html);
    }
}

/**
 * 单一原发病点击患者数量查看患者详情
 * 
 * @param year
 * @param itemCode
 * @param itemName
 */
function getPatientDetailsByYear(year, itemCode, itemName, event) {
    tabCount=$("#label").children("span").length;
    if ((tabCount-$("#" + itemCode + year).length)<8) {
        $("[name='allCondition_one']").hide();
        $("div[name='allConditionForm_one']").hide();
        $("#label").find("span").removeClass("active");
        // 判断是否存在table
        var isExit = true;
        if ($("#" + itemCode + year).length > 0) {
            $("#" + itemCode + year).addClass("active").siblings().removeClass("active");
            isExit = false;
        }
        // 获取原发病类型
        $.ajax({
            url : ctx + "/report/diagnosis/getPatientByCondition.shtml",
            type : "post",
            dataType : "json",
            data : $("#allCondition_one").serialize() + "&diagonsisItemCodes=" + itemCode + "&year=" + year,
            async : false,
            success : function(data) {
                if (data.status == 1) {
                    if (isExit) {
                        var tabsWidth = 356;
                        $(".bed-head .tab-head-text > span").each(function() {
                            tabsWidth += $(this).width() + 26;
                        });
                        if (tabsMaxWidth - tabsWidth < 0) {
                            $("#disease").attr("class","active");
                            showWarn("您打开的页面过多");
                            return false;
                        }
                        $(".bed-head .tab-head-text").width(tabsWidth);
                        var html = '<span class="active"  type="4" id="' + itemCode + '' + year + '" onclick="getPatientDetailsByYear(\'' + year
                                        + '\',\'' + itemCode + '\',\'' + itemName + '\',event)">';
                        html += "<i>" + year + itemName + "</i>";
                        html += '<i class="icon-close ml-6 opacity-5 fs-12" onclick=\"closeTab(1,this,event)\"></i></span>'
                        $("#label").append(html);
                    }
                    $("#diagnosis_table").hide();
                    $("#shownum").hide();
                    $("#chart1").hide();
                    $("#oneDiagnosis_table").hide();
                    $("#patient_table").show();
                    var html = "";
                    $.each(data.data, function(i, item) {
                        html += '<tr>';
                        html += '<td style="width: 10%">' + item.name + '</td>';
                        html += '<td style="width: 10%">' + item.registerTime + '</td>';
                        html += '<td style="width: 80%">' + convertEmpty(item.content) + '</td>';
                        html += '</tr>';
                    });
                    $("#patient_body").html(html);
                }
            }
        });
        event.stopPropagation(); // 阻止冒泡
    }else {
        showWarn("标签打开最多八个");
        $("#disease").attr("class","active");
        return;
    }
}

/**
 * 加载报表设置ztree
 */
var _setting = {
    view : {
        showLine : false
    },
    check : {
        enable : true,
        chkboxType : {
            "Y" : "ps",
            "N" : "s"
        }
    },
    edit : {
        enable : true
    },
    data : {
        key : {

            name : "itemName",
        },
        simpleData : {
            enable : true,
            idKey : "itemCode",
            pIdKey : "pItemCode"
        }
    },
    callback : {
        beforeClick : function(treeId, treeNode, clickFlag) {// 不选中选择的行

            return clickFlag != 1;
        }
    }
};

var tree = {
    /**
     * 初始化树结构
     * 
     * @param treeId
     *            绑定document节点ID
     * @param config
     *            回调函数配置{ click:"点击事件"}
     */
    init : function(treeId, config) {
        // 绑定事件
        if (config != null && config.click != null) {
            _setting.callback.onClick = config.click;
        }
        // 获取数据内容
        $.ajax({
            url : ctx + "/system/dictDiagnosis/getTreeByPItemCode.shtml",
            type : "post",
            dataType : "json",
            async : false,
            success : function(data) {
                var zNodes = data.dictDiagnosisList;                
                var treeObj = $.fn.zTree.init($("#" + treeId), _setting, zNodes);
                treeObj.checkAllNodes(true);// 默认是全部选中的
            }
        });
    },
    /**
     * 获取所有选中节点
     * 
     * @param treeId
     * @returns
     */
    getCheckNodes : function(treeId) {
        var treeObj = $.fn.zTree.getZTreeObj(treeId);
        var result = [];
        // 获取选中的对象
        var nodes = treeObj.getCheckedNodes(treeId);
        for (var i = 0; i < nodes.length; i++) {
            var node = nodes[i];
            // 如果该节点是叶子节点则 获取
            if (node.children == null && node.children == undefined) {
                result.push(node.itemCode); // 取itemCode
            }
        }
        return result;
    }
}

/**
 * 判断是否为空 是 返回空字符存 否则 返回原始内容
 * 
 * @param d
 * @returns
 */
function isNotBlank(d) {
    if (d == null || d == "" || d == undefined) {
        return '';
    }
    return d;
}

/**
 * 下载
 */
$("#downLoad").click(
                function() {
                    // 获取两个表单的参数数据
                    var param_year = $('#allCondition_year').serialize();
                    var param_one = $('#allCondition_one').serialize();

                    // 两棵树的数据
                    var param_year_tree = tree.getCheckNodes("tree_year"); // 年度统计报表参数
                    var param_one_tree = tree.getCheckNodes("tree_one"); // 单一原发病统计报表 参数

                    var method = "";
                    var spanNum = $("#label").find("span").length; // 获取当前打开的span的数量
                    var spanType = $("#label").find("span[class='active']").attr("type"); // 获取当前选中的span的type值

                    if (spanNum > 2) { // 打开了子table
                        if (spanType != 1 && spanType != 2) {// 表示当前选中的是子table, 下载子table的时候还需要下载父table
                            // 获取查询患者详情的参数
                            var paramValue = $("#label").find("span[class='active']").attr("onclick");
                            var newparamValue = paramValue.substring(paramValue.indexOf("(") + 1, paramValue.indexOf(")")).replace(/'/g, "");
                            var newparamValueList = newparamValue.split(",");
                            if (spanType == 3) {// 年度统计原发病患者详情
                                method = param_year + "&diagonsisItemCodes=" + param_year_tree + "&itemCode=" + newparamValueList[0] + "&itemYear="
                                                + newparamValueList[2].trim() + "&type=3&patientTitle=" + newparamValueList[1];
                            }
                            if (spanType == 4) { // 单一原发病患者详情
                                method = param_one + "&diagonsisItemCodes=" + param_year_tree + "&itemCode=" + newparamValueList[1] + "&itemYear="
                                                + newparamValueList[0].trim() + "&type=4&patientTitle=" + newparamValueList[2];
                            }
                        } else {// 表示选中的是父table
                            if (spanType == 1) { // 年度统计
                                method = param_year + "&diagonsisItemCodes=" + param_year_tree + "&type=1";
                            }
                            if (spanType == 2) { // 单一原发病统计
                                method = param_one + "&diagonsisItemCodes=" + param_one_tree + "&type=2";
                            }
                        }
                    } else { // 没有打开 子table
                        if (spanType == 1) { // 年度统计
                            method = param_year + "&diagonsisItemCodes=" + param_year_tree + "&type=1";
                        }
                        if (spanType == 2) { // 单一原发病统计
                            method = param_one + "&diagonsisItemCodes=" + param_one_tree + "&type=2";
                        }
                    }
                    window.location.href = ctx + "/report/diagnosis/download.shtml?" + method;
                });
