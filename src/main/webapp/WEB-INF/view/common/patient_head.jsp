<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>

<div class="col-sm-12 col-md-12 main" style="padding: 15px 15px 0px 15px;" id="patientHeadNav">
	<div class="fill-parent">
		<div class="list-item bg-white">
			<div class="tab-header tab-header2" data-iframe="true" style="display:none" id="patient-navbar">
	         </div>
	     </div>
	     <div class="simple-line simple-line-icon simple-line-text bg-white margin-top-8 new-bottom-line" id="patientTopNav">
	         <div class="simple-line-container" id="findPatientNavId" data-permission-key="patient_info">
	             <span class="tabbar">基本信息</span>
	         </div>
	         <div class="simple-line-container" id="diagnosisInfoNavId" data-permission-key="diagnosis_info">
	             <span class="tabbar">诊断信息</span>
	         </div>
	         <div class="simple-line-container" id= "routineCheckNavId" data-permission-key="patient_assay_record">
	             <span class="tabbar">化验信息</span>
	         </div>
	         <div class="simple-line-container" id= "outcomeRecordNavId" data-permission-key="outcome_record">
	             <span class="tabbar">转归</span>
	         </div>
	     </div>
	 </div>
</div>
<script type="text/javascript">
	var patientHasOutCome = "${patient.delFlag}"=="false"?false:true;
	$(function(){
		var storage = window.sessionStorage;
		var urlStack = storage.getItem('urlStack');
		if (isEmpty(urlStack)) {// 当栈不存在时
			urlStack = [];
		} else {
			urlStack = eval('(' + urlStack + ')');
		}
		setPatientNavbar(urlStack);
		setPatientNavOnclick();

		if (parent != top) {
			$("#patient-navbar").hide();
		}
	});
	/** 设置患者顶部tab宽度 */
	function setPatientTabWidth(){
		var patientTopNavCount = 0;
		$("#patientTopNav .simple-line-container").each(function(){
			if(!$(this).is(":hidden")){
				patientTopNavCount++;
			}
		});
		var patientTopNavWidth = (95/patientTopNavCount).toFixed(4)+"";
		$("#patientTopNav .simple-line-container").width(patientTopNavWidth.substring(0, patientTopNavWidth.length - 1) + "%" );
		
		$(".simple-line .tabbar").css("width", (96/9) + "%");//tab 9项
	}
	
	/** 设置患者顶部导航 */
	function setPatientNavbar(menu){
		var menuHtml = '<span class="tab-title bigger margin-left-5">${patient.name}</span>';
		menuHtml += '<div class="tab-header-line"></div>';
		for ( var i=1;i<=menu.length;i++) {
			if(menu.length == i){
				menuHtml += '<span  class="new-navbar-span disabled">'+ menu[i-1].name + '</span>';	
			}else{
				if(isEmpty(menu[i-1].url))
					menuHtml += '<span class="new-navbar-span disabled">'+ menu[i-1].name + '</span><span class="new-navbar-span disabled">&nbsp;>&nbsp;</span>';	
				else
					menuHtml += '<span class="new-navbar-span hand" onclick="window.location.href=\''+ menu[i-1].url+'\'">'+ menu[i-1].name + '</span>&nbsp;<span class="new-navbar-span">></span>&nbsp;';
			}
		}
		/* menuHtml +='<img id="nav-patient-photo" class="new-navbar-user-photo margin-left-5" src="${ctx}/images${patient.imagePath }">';
		menuHtml +='<span class="new-navbar-user-name">${patient.name }</span>'; */
		$("#patient-navbar").html("");
		$("#patient-navbar").html(menuHtml);
	}
	
	  /**设置组件的onclick */
	  function setPatientNavOnclick(){
		  $("#patientTopNav [data-permission-key]:visible").each(function() {
			  var val = $(this).attr("data-permission-key");
				for (var i = 0; i < user_permission_list.length; i++) {
					if (user_permission_list[i].key == val) {
						if(isEmpty(user_permission_list[i].url)){
							$(this).attr("onclick","openPatientUrl(this,'"+convertEmpty(getPermissionUrlByParentCode(user_permission_list[i].code))+"','"+user_permission_list[i].name+"')");
						}else{
							$(this).attr("onclick","openPatientUrl(this,'"+user_permission_list[i].url+"','"+user_permission_list[i].name+"')");
						};
						break;
					};
				};
		  });
	  }
	  /**页面跳转 */
	  function openPatientUrl(element,url,name){
		 window.location.href = ctx +"/"+url+".shtml?patientId=${patientId}";
	  };
</script>
