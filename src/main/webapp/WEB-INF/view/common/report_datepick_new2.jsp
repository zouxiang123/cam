<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<link rel="stylesheet" href="${ctx  }/framework/bootstrap/daterangepicker/daterangepicker.css">
<script type="text/javascript" src="${ctx  }/framework/moment/moment.min.js"></script>
<script type="text/javascript" src="${ctx  }/framework/moment/locale/zh-cn.js"></script>
<script type="text/javascript" src="${ctx  }/framework/bootstrap/daterangepicker/daterangepicker.js"></script>

<link rel="stylesheet" href="${ctx  }/framework/bootstrap/datetimepicker/css/bootstrap-datetimepicker.css">
<script type="text/javascript" src="${ctx  }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="${ctx  }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.zh-CN.js"></script>
<style>
    #reportDateDiv {
        padding-top: 8px;
    }
    .xtt
    .tablesetting {
        bottom: inherit;
    }
</style>
<script type="text/javascript">
    function setReportDatePick(element, options) {
        if (isEmpty(element))
            return;
        var reportDatePick = {
            init : function(element, opts) {
                var html = '';
                html += '<div id="tip">';
                html += '<i class="icon-caret-top" style="color: #000000;top:40px"></i>';
                html += '<div class="u-pop-up-hint" style="top: 50px;z-index: 100;right: 12px">';
                html += '<span id="selectDateShow"></span>';
                html += '<div class="u-float-r">';
                html += '<i class="icon-close" style="margin-left: 34px" onclick="closetip(\'#tip\')"></i>';
                html += '</div>';
                html += '</div>';
                html += '</div>';
                html += '<div class="u-prompt-box pl-16 pr-14" top-right style="top: 50px;right: 12px;display: none;" id="promptDialog">';
                // 单个日期
                if (opts.dateType == 'single') {
                    html += '<div  class="bb-line pb-6 w-100">';
                    html += '<input type="text" class="w-100" id="'+opts.dateInputName+'" name="'+opts.dateInputName+'" readonly="readonly" data-opens="center" data-valueName="'+opts.dateInputName+'" datetimepicker/>';
                    html += '</div>';
                } else if (opts.dateType == 'double') { //多个日期条件过滤
                    html += '   <div class="bb-dashed pb-10 mt-10">';
                    html += '        <input type="text" style="width: 44%" id="' + opts.startInputName + '" name="' + opts.startInputName
                                    + '" readonly="readonly" data-opens="center" data-valueName="' + opts.startInputName + '" daterangepicker/>';
                    html += '        <span class="ml-8 mr-8">至</span>';
                    html += '        <input type="text" style="width: 44%" id="' + opts.endInputName + '" name="' + opts.endInputName
                                    + '" readonly="readonly" data-opens="left" data-valueName="' + opts.endInputName + '" daterangepicker/>';
                    html += '   </div>';

                    html += '<div>';
                    html += '<input type="hidden" id="selectType" value=""/>';
                    if (opts.selectTimes) {
                        html += '<div class="bb-line pb-10 pt-10 text-center">';
                         $.each(opts.selectTimes, function(i, v) {
                             html += '<label class="u-radio">';
                             html += '<input type="radio" name="che" data-value="'+v.value+'" '+(i == 0 ? 'checked' : '')+'>';
                             html += '<span class="icon-radio"></span>';
                             html += v.name + '</label>';
                          });
                        html += '</div>';
                    } else {
                        html += '<div class="bb-line pb-10 pt-10 text-center">';
                        html += '<label class="u-radio u-float-l">';
                        html += '<input type="radio" name="che"  data-value="w">';
                        html += '<span class="icon-radio"></span>';
                        html += '最近一周</label>';
                        html += '<label class="u-radio">';
                        html += '<input type="radio" name="che" data-value="m" checked>';
                        html += '<span class="icon-radio"></span>';
                        html += '最近一月</label>';
                        html += '<label class="u-radio u-float-r">';
                        html += '<input type="radio" name="che" data-value="y">';
                        html += '<span class="icon-radio"></span>';
                        html += '最近一年</label>';
                        html += '</div>';
                    }
                    html += '</div>';
                }
                // 添加班次代码
                if (opts.clickShift) {                    
                    html += ' <div class="bb-line pb-10 pt-10" id="clickShift" style="max-width: 280px">';
                    html += $(element).find("#clickShift").html();
                    html += ' </div>';
                    $(element).find("#clickShift").remove();
                }
                
              //添加年龄间隔 默认为5
                if(opts.ageInterval){
                    html+='<div class="bb-dashed pb-10 pt-10">';
                    html+='<label class="u-radio mr-20">';
                    html+='<input type="radio" name="ageGapType" value="1" checked>';
                    html+='<span class="icon-radio"></span>';
                    html+='</label>';
                    html+='<span class="mr-20" style="width: 200px" id="ageGap">均匀年龄段间隔</span>';
                    html+='<input type="text" id="age_interval" placeholder="请输入年龄段间隔"  value="5">';
                    html+='</div>';
                }
              //非均匀年龄段间隔
              if(opts.ageNotBalanceInterval){
                  html+='<div class="bb-dashed pb-10 pt-10">';
                  html+='<label class="u-radio mr-20">';
                  html+='<input type="radio" name="ageGapType" value="0">';
                  html+='<span class="icon-radio"></span>';
                  html+='</label>';
                  html+='<span class="mr-20" style="width: 200px" id="ageGap">非均匀年龄段间隔</span>';
                  html+='<input type="text" style="width:70px" id="not_interval_beg" placeholder=""  value=""> 至 ';
                  html+=' <input type="text" style="width:70px" id="not_interval_end" placeholder=""  value=""> (岁/年)';
                  html+='</div>';
              }
                //添加患者姓名
                if(opts.showPatientName){
                    html+='<div class="bb-dashed pb-10 pt-10">';
                    html+='<input type="text" id="patientName" style="width: 100%" placeholder="为空表示所有患者">';
                   html+='</div>';
                }
                //添加医保类型
                if(opts.showMedicalType){
                    html+='<div class="bb-dashed pb-6 u-float-l mt-6 mb-4 " style="max-width: 300px" id="medicalType">';
                    html+='<label class="u-radio mr-20">';
                    html+='<input type="radio" name="MedicalMultiple" value="" checked>';
                    html+='<span class="icon-radio"></span>全部';
                    html+='</label>';
                    $.each(opts.chargTypeValue, function (n, item) {
                        html+='<label class="u-radio mr-20">';
                        html+='<input type="radio" name="MedicalMultiple" value="'+item.value+'">';
                        html+='<span class="icon-radio"></span>'+item.name;
                        html+='</label>';
                    });
                    html+='</div>';
                }
                
                // 添加患者类型：临时和长期
                if (opts.patientTemp) {
                    html += '<div class="bb-line pb-10 pt-10 text-center" id="patientTemp">';
                    html += '<label class="u-radio u-float-l">';
                    html += '<input type="radio" name="tempMultiple"  value="" checked data-text="全部患者">';
                    html += '<span class="icon-radio"></span>';
                    html += '全部</label>';
                    html += '<label class="u-radio" >';
                    html += '<input type="radio" name="tempMultiple" value="1" data-text="临时患者">';
                    html += '<span class="icon-radio"></span>';
                    html += '临时患者</label>';
                    html += '<label class="u-radio  u-float-r">';
                    html += '<input type="radio" name="tempMultiple" value="0" data-text="长期患者">';
                    html += '<span class="icon-radio"></span>';
                    html += '长期患者</label>';
                    html += '</div>';
                }
                
              //是否转归患者
                if(opts.outcome){
                    html += '<div class="bb-line pb-10 pt-10 text-center" id="outcomeType">';
                    html += '<label class="u-radio u-float-l">';
                    html += '<input type="radio" name="outcomeType"  value="" data-text="全部患者">';
                    html += '<span class="icon-radio"></span>';
                    html += '全部</label>';
                    html += '<label class="u-radio" >';
                    html += '<input type="radio" name="outcomeType" value="1" data-text="已转归">';
                    html += '<span class="icon-radio"></span>';
                    html += '已转归</label>';
                    html += '<label class="u-radio  u-float-r">';
                    html += '<input type="radio" name="outcomeType" value="0" checked data-text="未转归">';
                    html += '<span class="icon-radio"></span>';
                    html += '未转归</label>';
                    html += '</div>';
                }
                // 自定义form表单
                if (opts.customForm) {
                    $(".u-pop-up-from").find("form#" + opts.formId).show();
                    html += '	<div class="f-dotted">';
                    html += $(".u-pop-up-from").html();
                    html += '	</div>';
                    $(".u-pop-up-from").remove();
                }
                // 自定义选项
                if (opts.customSelect) {
                    //判断单复选
                    if(opts.customSelectCheck){
                        html += '<div class="bb-line pb-6 pt-8 width-280" id="customSelect" >';
                        for ( var key in opts.customSelectItems) {
                            html += '<label class="u-checkbox mr-16">';
                            html += '<input type="checkbox" name="'+opts.customSelectName+'" value="'+key+'" data-text="'+opts.customSelectItems[key]+'"/>';
                            html += '<span class="icon-checkbox"></span>'+opts.customSelectItems[key]+'</label>';
                        }
                     /* html += '<label class="u-checkbox">';
                        html += '<input type="checkbox" name="'+opts.customSelectName+'" value="" checked data-text="全部'+opts.customSelectText+'"/>';
                        html += '<span class="icon-checkbox"></span>全部</label>';*/
                        html += '   </div>';
                    } else {
                        html += '<div class="bb-line pb-6 pt-8" id="customSelect" >';
                        html += '<label class="u-radio">';
                        html += '<input type="radio" name="'+opts.customSelectName+'" value="" checked data-text="全部'+opts.customSelectText+'"/>';
                        html += '<span class="icon-radio"></span>全部</label>';
                        for ( var key in opts.customSelectItems) {
                            html += '<label class="u-radio" >';
                            html += '<input type="radio" name="'+opts.customSelectName+'" value="'+key+'" data-text="'+opts.customSelectItems[key]+'"/>';
                            html += '<span class="icon-radio"></span>'+opts.customSelectItems[key]+'</label>';
                        }
                        html += '   </div>';
                    }
                }
                html += '<div class="u-float-r mt-12">';
                html += '<button type="button" data-hide="#promptDialog">取消</button>';
                html += '<button type="button" class="u-btn-blue checkTime ml-8" fill data-hide="#promptDialog">确定</button>';
                html += '</div>';
                html += '</div>';
                $(element).append(html);
                $(element).find(".u-pop-up-hint").css({
                    "z-index" : "100"
                });
                $(element).find(".u-pop-up-time").css({
                    "width" : "auto",
                    "min-width" : "330px"
                });
                // 以上封装pop内容部分

                if (opts.dateType == "single" || opts.dateType == 'nothing') {
                    if (opts.dateFormat == 'yyyy') {
                        // 日历控件初始化
                        $(element).find("input[datetimepicker]").datetimepicker({
                            language : 'zh-CN',
                            format : 'yyyy',
                            weekStart : 1,
                            // todayBtn : 1,
                            autoclose : 1,
                            todayHighlight : 1,
                            startView : 4,
                            minView : 4,
                            //bootcssVer : 3,
                            forceParse : 0
                        });
                        $(element).find("input[datetimepicker]")
                    } else if (opts.dateFormat == 'yyyy-mm') {
                        // 日历控件初始化
                        $(element).find("input[datetimepicker]").datetimepicker({
                            format : 'yyyy-mm',
                            weekStart : 1,
                            autoclose : true,
                            startView : 3,
                            minView : 3,
                            forceParse : true,
                            //bootcssVer : 3,
                            language : 'zh-CN'
                        });
                    } else if (opts.dateFormat == 'YYYY-MM-DD') {
                        // 日历控件初始化
                        $(element).find("input[datetimepicker]").daterangepicker({
                            "singleDatePicker" : true,
                            "autoUpdateInput" : true,
                            "showDropdowns" : true,
                            // "clearBtn" : true,
                            "alwaysShowCalendars" : true,
                            "locale" : {
                                format : "YYYY-MM-DD",
                                applyLabel : "确认",
                                cancelLabel : "取消",
                                daysOfWeek : [ '日', '一', '二', '三', '四', '五', '六' ],
                                monthNames : [ '1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月' ]
                            }
                        });
                    }
                } else if (opts.dateType == "double") {
                    $(element).find("input[daterangepicker]").daterangepicker({
                        "singleDatePicker" : true,
                        "showDropdowns" : true,
                        "locale" : {
                            format : opts.dateFormat || 'YYYY-MM-DD'
                        }
                    });
                    if (!isEmpty(opts.startDate))
                        $(element).find("input[data-valueName='" + opts.startInputName + "']").data("startDate", opts.startDate);
                    if (!isEmpty(opts.endDate))
                        $(element).find("input[data-valueName='" + opts.endInputName + "']").data("startDate", opts.endDate);
                    $(element).on("click", "input[name='che']", function() {
                        var type = $(this).attr("data-value");
                        // 变更selectType值
                        $(element).find("#selectType").val(type);
                        $(element).find("#selectType").trigger("change");
                    }); 
                    $(element).on("change", "#selectType", function() {
                        var type = $(this).val();
                        var startDate = moment();
                        var endDate = moment();
                        if (type == "w") {
                            startDate = moment().subtract(7, 'days');
                        } else if (type == "m") {
                            startDate = moment().subtract(1, 'month').add(1, 'days');
                        } else if (type == "3m") {
                            startDate = moment().subtract(3, 'month').add(1, 'days');
                        } else if (type == "6m") {
                            startDate = moment().subtract(6, 'month').add(1, 'days');
                        } else if (type == "y") {
                            startDate = moment().subtract(1, 'year').add(1, 'days');
                        }
                        var startObj = $(element).find("input[data-valueName='" + opts.startInputName + "']");
                        var endObj = $(element).find("input[data-valueName='" + opts.endInputName + "']");
                        startObj.val(startDate.format(opts.dateFormat));
                        endObj.val(endDate.format(opts.dateFormat));
                        startObj.data("dateStr", startObj.val());
                        endObj.data("dateStr", endObj.val());
                        //设置开始日期最大值
                        startObj.data("daterangepicker").startDate = startDate;
                        startObj.data("daterangepicker").endDate = startDate;
                        startObj.data("daterangepicker").maxDate = endDate;
                        //设置结束日期最小值
                        endObj.data("daterangepicker").startDate = endDate;
                        endObj.data("daterangepicker").endDate = endDate;
                        endObj.data("daterangepicker").minDate = startDate;
                    });
                    $(element).on('apply.daterangepicker', "input", function(ev, picker) {
                        var startObj = $(element).find("input[data-valueName='" + opts.startInputName + "']");
                        var endObj = $(element).find("input[data-valueName='" + opts.endInputName + "']");
                        if ($(this).attr("data-valueName") == "startDate") {
                            endObj.data("daterangepicker").minDate = moment($(this).val(), opts.dateFormat);
                        } else if ($(this).attr("data-valueName") == "endDate") {
                            startObj.data("daterangepicker").maxDate = moment($(this).val(), opts.dateFormat);
                        }
                        if ($(this).data("dateStr") != $(this).val())
                            $(element).find("select").val("");
                        if ($(element).find("#selectType").length > 0) {
                            $(element).find("[name='che']").attr("checked",false);
                        }
                    });
                }
                //取消
                $(element).on('click', '.clear-hide', function() {
                    if ($(this).parent().parent().css("display") == 'none') {
                        $(this).parent().parent().show();
                    } else {
                        $(this).parent().parent().hide();
                    }
                });
                //确定
                $(element).on('click', 'button.checkTime', function() {
                    var radioText = "";
                    var dateFormat = "";
                    var btnBlueText = "";
                    var selectDateShow = "";
                    // 存在班次
                    if (opts.clickShift) {
                        radioText += " " + $(element).find("#clickShift input[type='radio']:checked").data("text");
                    }
                    // 患者类型
                    if (opts.patientTemp) {
                        radioText += " " + $(element).find("#patientTemp input[type='radio']:checked").data("text");
                    }
                    // 自定义选项
                    if (opts.customSelect) {
                        //判断单复选
                        if(opts.customSelectCheck){
                           // radioText += " " + $(element).find("#customSelect input[type='checkbox']:checked").data("text");
                        } else{
                            radioText += " " + $(element).find("#customSelect input[type='radio']:checked").data("text");
                        }
                    }
                    if (opts.dateType == 'single') { // 单个日期形式
                        var dateObj = $(element).find("input[data-valueName='" + opts.dateInputName + "']");
                        if (!isEmpty(opts.callback))
                            opts.callback(dateObj.val());
                        dateFormat = opts.dateFormat.replace(new RegExp("-", "g"), "/");
                        selectDateShow = moment(dateObj.val()).format(dateFormat.toUpperCase());
                    }
                    if (opts.dateType == 'double') { // 多个日期形式
                        var startObj = $(element).find("input[data-valueName='" + opts.startInputName + "']");
                        var endObj = $(element).find("input[data-valueName='" + opts.endInputName + "']");
                        if (!isEmpty(opts.callback))
                            opts.callback(startObj.val(), endObj.val());
                        /*btnBlueText = "日期：";*/
                        dateFormat = opts.dateFormat.replace(new RegExp("-", "g"), "/");
                        selectDateShow = moment(startObj.val()).format(dateFormat) + "~" + moment(endObj.val()).format(dateFormat);
                    } else if (opts.dateType == 'nothing') {
                        if (!isEmpty(opts.callback))
                            opts.callback();
                        if (opts.customForm) {
                            if (opts.formId == 'selectForm') {
                                if ($(element).find("form#" + opts.formId + " input#reportDate").length > 0) {
                                    selectDateShow = $(element).find("form#" + opts.formId + " input#reportDate").val();
                                }
                            }
                        }
                    }
                    selectDateShow += radioText;
                    $(element).find(".u-pop-up-hint #selectDateShow").text(selectDateShow);
                    $(element).find(".u-pop-up-hint").show();
                    $(".my-toggle").hide();
                });
                //取消
                $(element).on('click', '#btn_cancle', function() {
                    $(".my-toggle").hide();
                });
            },
            setReportDate : function(opts) {
                if (opts.dateType == 'single') {
                    $(element).find("#reportDate").val(opts.defaultValue);
                }
                if (opts.dateType == 'double') { // 多个日期条件过滤
                    $(element).find("#selectType").val(opts.defaultType);
                    $(element).find("#selectType").trigger("change");
                } else if (opts.dateType == 'nothing') {
                    if ($(element).find("#reportDate").length > 0) {
                        $(element).find("#reportDate").val(opts.defaultValue);
                    }
                }
                $(element).find("button.checkTime").trigger("click");
            }
        };
        var defaults = {
            startInputName : "startDate",
            endInputName : "endDate",
            dateInputName : "reportDate",
            startDate : null,
            endDate : null,
            dateType : 'double',
            defaultType : null,
            defaultValue : null,
            dateFormat : 'YYYY-MM-DD',
            formId : '',
            clickShift : false,
            patientTemp : false,
            customForm : false,
            callback : function(s, e) {
            }
        };
        var opts = $.extend({}, defaults, options);
        //初始化
        reportDatePick.init(element, opts);
        reportDatePick.setReportDate(opts);
        $(element).data("reportDatePick", reportDatePick);
    }
    
    $(function() {
        $(".open-show").click(function() {
            $(".my-toggle").show();
        });
    });
    function hideOpenShow() {
        $(".open-show").hide();
        $(".u-pop-up-hint").hide();
    }
    function showOpenShow() {
        $(".open-show").show();
        $(".u-pop-up-hint").show();
    }
    
    // 获取长期、临时患者类型值
    function getPatientTempValue(isFirst) {
        var patientTempValue = '';
        var patientTemp = $("[name='tempMultiple']:checked").val();
        if (!isEmpty(patientTemp)) {
            patientTempValue = '&patientTemp[0]=' + patientTemp;
        } else {
            patientTempValue = '&patientTemp[0]=0&patientTemp[1]=1';
        }
        if (isFirst && !isEmpty(patientTempValue)) {
            patientTempValue = patientTempValue.substring(1);
        }
        return patientTempValue;
    }
    
  //获取患者是否转归的类型值
    function getOutcomeTypeValue() {
       var outcomeTypeValue = '';
       var outcomeType = $("[name='outcomeType']:checked").val();
       outcomeTypeValue = '&outcomeType='+outcomeType;
       return outcomeTypeValue;
   }
  
    //标签选中的值
    function getPatientLabelValue(isFirst){
        var patientLabelValue = '';
        var patientLabelId = $("[name='patientLabelId']").serialize();
        
        if (patientLabelId != null && patientLabelId != '') {
            var replaceValue = patientLabelId.replace(/patientLabelId=/g, '');
            var splitValue = replaceValue.split('&');
            for (var i = 0; i < splitValue.length; i++) {
                patientLabelValue += ('&patientLabelId[' + i + ']=' + splitValue[i]);
            }
        }
        if(isFirst) patientLabelValue = patientLabelValue.substring(1);
        return patientLabelValue;
    }
    
    // 获取班次值
    function getShiftNumberValue(isFirst) {
        var shiftNumberValue = '';
        var shiftNumber = $("[name='shiftMultiple']:checked").val();
        if (!isEmpty(shiftNumber)) {
            shiftNumberValue = '&shiftNumber[0]=' + shiftNumber;
        }
        if (isFirst && !isEmpty(shiftNumberValue))
            shiftNumberValue = shiftNumberValue.substring(1);
        return shiftNumberValue;
    }
    
    //获取年龄间隔值
    function getAgeInterval(){
        return $("#age_interval").val();
    }
    
 // 非均匀
    function getAgeNotBalanceInterval(){
        return "&ageIntervalBeg=" + $("#not_interval_beg").val() + "&ageIntervalEnd=" +$("#not_interval_end").val();
    }
    function getAgeNotBalanceIntervalBeg(){
        return $("#not_interval_beg").val(); 
    }
    function getAgeNotBalanceIntervalEnd(){
        return $("#not_interval_end").val();
    }
    //获取患者姓名
    function getPatientName(){
        return $("#patientName").val();
    }
    
    //获取患者医保类型
    function getMedicalType(isFirst){
        var medicalTypeValue = '';
        var medicalType = $("[name='MedicalMultiple']:checked").val();
        if (!isEmpty(medicalType)) {
            medicalTypeValue = '&medicalType[0]=' + medicalType;
        }
        if (isFirst && !isEmpty(medicalTypeValue))
            medicalTypeValue = medicalTypeValue.substring(1);
        return medicalTypeValue;
    }

    function hidesetting() {
        $("#tip").hide();
        $("#promptDialog").hide();
    }

    function showsetting() {
        $("#tip").show();
        $("#promptDialog").show();
    }
    // 关闭提示框
    function closetip(ev) {
        $(ev).hide();
    }
</script>