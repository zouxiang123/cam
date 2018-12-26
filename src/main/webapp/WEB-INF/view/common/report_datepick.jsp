<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<link rel="stylesheet" href="${ctx }/framework/bootstrap/daterangepicker/daterangepicker.css">

<script type="text/javascript" src="${ctx }/framework/moment/moment.min.js"></script>
<script type="text/javascript" src="${ctx }/framework/bootstrap/daterangepicker/daterangepicker.js"></script>
<script type="text/javascript">
function setReportDatePick(element,options){
	if(isEmpty(element))
		return;
	var reportDatePick = {
		init:function(element,opts){
			var html='<div class="dropdown margin-left-10 margin-right-10 pull-left clearfix">';
					html+=' <select style="background-position: 82px 10px;width: 100px;">';
						html+=' <option value=""></option>';
						html+=' <option value="w">最近一周</option>';
						html+=' <option value="m">最近一月</option>';
						html+=' <option value="y">最近一年</option>';
					html+=' </select>';
				html+=' </div>';
				html+='<input type="text" class="reportrange text-center width-150" name="'+opts.startInputName+'" readonly="readonly" data-opens="center" data-valueName="startDate"/>';
				html+='<span class="range_span">至</span>';
				html+='<input type="text" class="reportrange text-center width-150" name="'+opts.endInputName+'" readonly="readonly" data-opens="left" data-valueName="endDate"/>';
			$(element).html(html);
			if(!isEmpty(opts.startDate))
				$(element).find("input[data-valueName='startDate']").data("startDate",opts.startDate);
			if(!isEmpty(opts.endDate))
				$(element).find("input[data-valueName='endDate']").data("startDate",opts.endDate);
			$(element).find("input").daterangepicker({
			    "singleDatePicker": true,
			    "showDropdowns": true,
			    "alwaysShowCalendars": true,
			    "locale": {
			    	format:"YYYY-MM-DD",
			    	applyLabel:"确认",
			    	cancelLabel:"取消",
			        daysOfWeek:['日', '一', '二', '三', '四', '五','六'],
			        monthNames:['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月']
			    }
			});
			$(element).on("change","select",function(){
				var type = $(this).val();
				var startDate = moment();
				var endDate = moment();
				if(type=="w"){
					startDate = moment().subtract(7, 'days');
				}else if(type=="m"){
					startDate = moment().subtract(1, 'month').add(1, 'days');
				}else if(type=="y"){
					startDate = moment().subtract(1, 'year').add(1, 'days');
				}
				var startObj = $(element).find("input[data-valueName='startDate']");
				var endObj = $(element).find("input[data-valueName='endDate']");
				startObj.val(startDate.format("YYYY-MM-DD"));
				endObj.val(endDate.format("YYYY-MM-DD"));
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
				if(!isEmpty(opts.callback))
					opts.callback(startObj.val(),endObj.val());
			});
			
			$(element).on('apply.daterangepicker',"input", function(ev, picker) {
				var startObj = $(element).find("input[data-valueName='startDate']");
				var endObj = $(element).find("input[data-valueName='endDate']");
				if($(this).attr("data-valueName")=="startDate"){
					endObj.data("daterangepicker").minDate = moment($(this).val(),"YYYY-MM-DD");
				} else if($(this).attr("data-valueName")=="endDate"){
					startObj.data("daterangepicker").maxDate = moment($(this).val(),"YYYY-MM-DD");
				}
				if($(this).data("dateStr") != $(this).val())
					$(element).find("select").val("");
				if(!isEmpty(opts.callback))
					opts.callback(startObj.val(),endObj.val());
			});
		}
		,setReportDatePickType:function(type){
			$(element).find("select").val(type);
			$(element).find("select").trigger("change");
		}
	};
	var defaults ={
		startInputName:"startDate",			
		endInputName:"endDate",
		startDate:null,
		endDate:null,
		defaultType:null,
		callback : function(s,e){}
	};
	var opts = $.extend({}, defaults, options);
	//初始化
	reportDatePick.init(element,opts);
	
	if(!isEmpty(opts.defaultType)){
		reportDatePick.setReportDatePickType(opts.defaultType);
	}
	$(element).data("reportDatePick",reportDatePick);
}

</script>