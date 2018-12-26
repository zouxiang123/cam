<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<link rel="stylesheet" href="${ctx }/framework/bootstrap/daterangepicker/daterangepicker.css">
<script type="text/javascript" src="${ctx }/framework/moment/moment.min.js"></script>
<script type="text/javascript" src="${ctx }/framework/moment/locale/zh-cn.js"></script>
<script type="text/javascript" src="${ctx }/framework/bootstrap/daterangepicker/daterangepicker.js"></script>

<link rel="stylesheet" href="${ctx }/framework/bootstrap/datetimepicker/css/bootstrap-datetimepicker.css">
<script type="text/javascript" src="${ctx }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.js"></script>
<script type="text/javascript" src="${ctx }/framework/bootstrap/datetimepicker/js/bootstrap-datetimepicker.zh-CN.js"></script>
<script type="text/javascript">
function setReportDatePick(element,options){
	if(isEmpty(element))
		return;
	var reportDatePick = {
		init:function(element,opts){
			var html = '';
			html += '<div class="u-pop-up-hint" style="top: 50px;">';
			html += '	<span id="selectDateShow"></span>';
			html += '	<div class="pull-right">';
			html += '		<img src="${ctx}/assets/img/s1111.png">';
			html += '		<img src="${ctx}/assets/img/closenew.png" class="clear-hide">';
			html += '	</div>';
			html += '</div>';
			html += '<div class="u-pop-up-time my-toggle p-10" style="top: 50px; display: none;">';
			html += '	<img src="${ctx}/assets/img/s1110.png" alt="">';
			// 单个日期
			if(opts.dateType == 'single'){
				html += '	<div class="text-center h-50 f-dotted">';
				html +='		<input type="text" class="reportrange text-center width-150" id="'+opts.dateInputName+'" name="'+opts.dateInputName+'" readonly="readonly" data-opens="center" data-valueName="'+opts.dateInputName+'" datetimepicker/>';
				html += '	</div>';
			}else if(opts.dateType == 'double'){ // 多个日期条件过滤
				html += '	<div class="text-center h-50 f-dotted">';
				html +='		<input type="hidden" id="selectType" value="" />';
				if (opts.selectTimes){
					$.each(opts.selectTimes, function(i,v){
						html+=' <button type="button" class="select-btn" data-value="'+ v.value +'">'+ v.name +'</button>';
					});
				}else{
					html+=' <button type="button" class="select-btn" data-value="w">最近一周</button>';
					html+=' <button type="button" class="select-btn" data-value="m">最近一月</button>';
					html+=' <button type="button" class="select-btn" data-value="y">最近一年</button>';
				}
				html +='	</div>';
				html +='	<div class="text-center h-50 f-dotted">';
				html +='		<input type="text" class="reportrange text-center width-150" id="'+opts.startInputName+'" name="'+opts.startInputName+'" readonly="readonly" data-opens="center" data-valueName="'+opts.startInputName+'" daterangepicker/>';
				html +='		<span class="range_span" style="font-size: 12px;">至</span>';
				html +='		<input type="text" class="reportrange text-center width-150" id="'+opts.endInputName+'" name="'+opts.endInputName+'" readonly="readonly" data-opens="left" data-valueName="'+opts.endInputName+'" daterangepicker/>';
				html +='	</div>';
			}
			// 添加班次代码
			if(opts.clickShift){
				html += '	<div class="text-center h-50 f-dotted">';
				html +=  $(element).find("#clickShift").html();
				html += '	</div>';
				$(element).find("#clickShift").remove();
			}
			// 添加患者类型：临时和长期
			if(opts.patientTemp){
				html += '	<div class="text-center h-50 f-dotted">';
				if (!isEmpty(opts.patientTempText)) {
					html += opts.patientTempText + '：';
				}
				html += '		<select name="tempMultiple" class="dropdown pull-left" multiple="multiple">';
				html += '			<option value="0" selected="selected">长期患者</option>';
				html += '			<option value="1" selected="selected">临时患者</option>';
				html += '		</select>';
				html += '	</div>';
			}
			// 自定义form表单
			if(opts.customForm){
				$(".u-pop-up-from").find("form#" + opts.formId).show();
				html += '	<div class="f-dotted">';
				html +=  $(".u-pop-up-from").html();
				html += '	</div>';
				$(".u-pop-up-from").remove();
			}
			// 自定义下拉
			if(opts.customSelect){
			    html += '    <div class="text-center h-50 f-dotted">';
				if (!isEmpty(opts.customSelectText)) {
					html += opts.customSelectText + '：';
				}
                html += '       <select name="'+opts.customSelectName+'" class="dropdown pull-left" multiple="multiple">';
                for(var key in opts.customSelectItems){
                    html += '<option value="'+key+'" selected="selected">'+opts.customSelectItems[key]+'</option>';
                }
                html += '       </select>';
                html += '   </div>';
			}
			html += '	<div class="text-center h-50 text-right">';
			html += '       <button type="button" id="btn_cancle">取消</button>';
			html += '		<button type="button" class="u-btn-blue btn-fill checkTime">确定</button>';
			html += '	</div>';
			html += '</div>';
			$(element).append(html);
			$(element).find(".u-pop-up-hint").css({"z-index": "98"});
			$(element).find(".u-pop-up-time").css({"width": "auto", "min-width": "330px"});
			if(opts.clickShift){
				// 注册多选select事件
				$(element).find("[name='shiftMultiple']").multiselect({
					nonSelectedText : '全部班次',
					buttonWidth : "150px",
					allSelectedText : '全部班次'
				});
			}
			if(opts.patientTemp){
				// 注册多选select事件
				$(element).find("[name='tempMultiple']").multiselect({
					nonSelectedText : '临时患者+长期患者',
					buttonWidth : "150px",
					allSelectedText : '临时患者+长期患者'
				});
			}
			//注册自定义多选事件
			if(opts.customSelect){
			    var customSelectOptions = {
                    nonSelectedText : '全部',
                    buttonWidth : "150px",
                    allSelectedText : '全部'
			    }
			    if(!isEmptyObject(opts.customSelectOptions)){
    			    $.extend(customSelectOptions,opts.customSelectOptions);
			    }
			    $(element).find("[name='"+opts.customSelectName+"']").multiselect(customSelectOptions);
			}
			// 以上封装pop内容部分

			if(opts.dateType == "single" || opts.dateType == 'nothing'){
				if(opts.dateFormat == 'yyyy') {
					// 日历控件初始化
					$(element).find("input[datetimepicker]").datetimepicker({
						language: 'zh-CN',
						format: 'yyyy',
						weekStart: 1,
						// todayBtn : 1,
						autoclose: 1,
						todayHighlight: 1,
						startView: 4,
						minView: 4,
						bootcssVer : 3,
						forceParse: 0
					});
				}else if(opts.dateFormat == 'yyyy-mm'){
					// 日历控件初始化
					$(element).find("input[datetimepicker]").datetimepicker({
						format : 'yyyy-mm',
						weekStart : 1,
						autoclose : true,
						startView : 3,
						minView : 3,
						forceParse : true,
						bootcssVer : 3,
						language : 'zh-CN'
					});
				}else if(opts.dateFormat == 'YYYY-MM-DD'){
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
			}else if(opts.dateType == "double"){
				$(element).find("input[daterangepicker]").daterangepicker({
					"singleDatePicker": true,
					"showDropdowns": true,
					/*"clearBtn":true,
					 "alwaysShowCalendars": true, */
					"locale": {
						format:opts.dateFormat || 'YYYY-MM-DD'/*,
						 applyLabel:"确认",
						 cancelLabel:"取消" ,
						 daysOfWeek:['日', '一', '二', '三', '四', '五','六'],
						 monthNames:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'] */
					}
				});
				if(!isEmpty(opts.startDate))
					$(element).find("input[data-valueName='"+opts.startInputName+"']").data("startDate",opts.startDate);
				if(!isEmpty(opts.endDate))
					$(element).find("input[data-valueName='"+opts.endInputName+"']").data("startDate",opts.endDate);
				$(element).on("click","button.select-btn",function(){
					$(this).addClass("u-btn-blue").addClass("btn-fill").siblings().removeClass("u-btn-blue").removeClass("btn-fill");
					var type = $(this).attr("data-value");
					// 变更selectType值
					$(element).find("#selectType").val(type);
					$(element).find("#selectType").trigger("change");
				});
				$(element).on("change","#selectType",function(){
					var type = $(this).val();
					var startDate = moment();
					var endDate = moment();
					if(type=="w"){
						startDate = moment().subtract(7, 'days');
					}else if(type=="m"){
						startDate = moment().subtract(1, 'month').add(1, 'days');
					}else if(type=="3m"){
						startDate = moment().subtract(3, 'month').add(1, 'days');
					}else if(type=="6m"){
						startDate = moment().subtract(6, 'month').add(1, 'days');
					}else if(type=="y"){
						startDate = moment().subtract(1, 'year').add(1, 'days');
					}
					var startObj = $(element).find("input[data-valueName='"+opts.startInputName+"']");
					var endObj = $(element).find("input[data-valueName='"+opts.endInputName+"']");
					startObj.val(startDate.format(opts.dateFormat));
					endObj.val(endDate.format(opts.dateFormat));
					startObj.data("dateStr",startObj.val());
					endObj.data("dateStr",endObj.val());
					//设置开始日期最大值
					startObj.data("daterangepicker").startDate = startDate;
					startObj.data("daterangepicker").endDate = startDate;
					startObj.data("daterangepicker").maxDate = endDate;
					//设置结束日期最小值
					endObj.data("daterangepicker").startDate = endDate;
					endObj.data("daterangepicker").endDate = endDate;
					endObj.data("daterangepicker").minDate = startDate;
				});
				$(element).on('apply.daterangepicker',"input", function(ev, picker) {
					var startObj = $(element).find("input[data-valueName='"+opts.startInputName+"']");
					var endObj = $(element).find("input[data-valueName='"+opts.endInputName+"']");
					if($(this).attr("data-valueName")=="startDate"){
						endObj.data("daterangepicker").minDate = moment($(this).val(),opts.dateFormat);
					} else if($(this).attr("data-valueName")=="endDate"){
						startObj.data("daterangepicker").maxDate = moment($(this).val(),opts.dateFormat);
					}
					if($(this).data("dateStr") != $(this).val())
						$(element).find("select").val("");
				});
			}
			//
			$(element).on('click', '.clear-hide', function(){
				if($(this).parent().parent().css("display") == 'none'){
					$(this).parent().parent().show();
				}else{
					$(this).parent().parent().hide();
				}
			});
			//确定
			$(element).on('click', 'button.checkTime', function(){
				var multipleSelectValues = "";
				var dateFormat = "";
				var btnBlueText = "";
				var selectDateShow = "";
				// 如果存在长期、临时患者类型选项，则获取选项文本值
				if($(element).find("[multiple='multiple']").length > 0){
					$(element).find("[multiple='multiple']").each(function(){
						var selectedText = $(this).parent().find(".multiselect-selected-text").text();
						if(selectedText.indexOf("(") >= 0 && selectedText.indexOf(")") >= 0){
							selectedText = selectedText.substring(0, selectedText.indexOf("("));
						}
						multipleSelectValues += " " + selectedText;
					});
				}
				if(opts.dateType == 'single') { // 单个日期形式
					var dateObj = $(element).find("input[data-valueName='"+opts.dateInputName+"']");
					if (!isEmpty(opts.callback))
						opts.callback(dateObj.val());
					dateFormat = opts.dateFormat.replace(new RegExp("-","g"), "/");
					/*switch (dateFormat.length){
						case 4:
							btnBlueText = "年份："; break;
						case 7:
							btnBlueText = "月份："; break;
						case 10:
							btnBlueText = "日期："; break;
					}*/
					selectDateShow = moment(dateObj.val()).format(dateFormat.toUpperCase());
				}if(opts.dateType == 'double') { // 多个日期形式
					var startObj = $(element).find("input[data-valueName='"+opts.startInputName+"']");
					var endObj = $(element).find("input[data-valueName='"+opts.endInputName+"']");
					if (!isEmpty(opts.callback))
						opts.callback(startObj.val(), endObj.val());
					/*btnBlueText = "日期：";*/
					dateFormat = opts.dateFormat.replace(new RegExp("-","g"), "/");
					selectDateShow = moment(startObj.val()).format(dateFormat) + "~" + moment(endObj.val()).format(dateFormat);
				}else if(opts.dateType == 'nothing'){
					if (!isEmpty(opts.callback))
						opts.callback();
					if(opts.customForm){
						if(opts.formId == 'selectForm'){
							if($(element).find("form#" + opts.formId + " input#reportDate").length > 0){
								selectDateShow = $(element).find("form#" + opts.formId + " input#reportDate").val();
							}
						}
					}
				}
				selectDateShow += multipleSelectValues;
				$(element).find(".u-pop-up-hint #selectDateShow").text(selectDateShow);
				$(element).find(".u-pop-up-hint").show();
				$(".my-toggle").hide();
			});
		    //取消
			$(element).on('click','#btn_cancle',function(){
			    $(".my-toggle").hide();
			});		
		}
		,setReportDate:function(opts){
			if(opts.dateType == 'single') {
				$(element).find("#reportDate").val(opts.defaultValue);
			}if(opts.dateType == 'double') { // 多个日期条件过滤
				$(element).find("#selectType").val(opts.defaultType);
				$(element).find("button[data-value='" + opts.defaultType + "']").addClass("u-btn-blue btn-fill").siblings().removeClass("u-btn-blue btn-fill");
				$(element).find("#selectType").trigger("change");
			}else if(opts.dateType == 'nothing'){
				if($(element).find("#reportDate").length > 0){
					$(element).find("#reportDate").val(opts.defaultValue);
				}
			}
			$(element).find("button.checkTime").trigger("click");
		}
	};
	var defaults ={
		startInputName:"startDate",			
		endInputName:"endDate",
		dateInputName:"reportDate",
		startDate:null,
		endDate:null,
		dateType:'double',
		defaultType:null,
		defaultValue:null,
		dateFormat: 'YYYY-MM-DD',
		formId: '',
		clickShift: false,
		patientTemp: false,
		customForm: false,
		callback : function(s,e){}
	};
	var opts = $.extend({}, defaults, options);
	//初始化
	reportDatePick.init(element,opts);
	reportDatePick.setReportDate(opts);
	$(element).data("reportDatePick",reportDatePick);
}
// 获取长期、临时患者类型值
function getPatientTempValue(isFirst){
	var patientTempValue = '';
	var patientTemp = $("[name='tempMultiple']").serialize();
	if (patientTemp != null && patientTemp != '') {
		var replaceValue = patientTemp.replace(/tempMultiple=/g, '');
		var splitValue = replaceValue.split('&');
		for (var i = 0; i < splitValue.length; i++) {
			patientTempValue += ('&patientTemp[' + i + ']=' + splitValue[i]);
		}
	}
	if(isFirst) patientTempValue = patientTempValue.substring(1);
	return patientTempValue;
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
$(function() {
	$(".open-show").click(function () {
		$(".my-toggle").show();
	});
});
function hideOpenShow(){
	$(".open-show").hide();
	$(".u-pop-up-hint").hide();
}
function showOpenShow(){
	$(".open-show").show();
	$(".u-pop-up-hint").show();
}
</script>