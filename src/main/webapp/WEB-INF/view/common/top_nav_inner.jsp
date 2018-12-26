<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>

<div class="col-sm-12 col-md-12" style="padding:15px 15px 0px 15px;margin-bottom:0px;display:none;" data-iframe="true">
	 <div class="tab-header" id="top-inner-navbar">
	 </div>
</div>
<script type="text/javascript">
	$(function(){
		var storage = window.sessionStorage;
		var urlStack = storage.getItem('urlStack');
		if (isEmpty(urlStack)) {// 当栈不存在时
			urlStack = [];
		} else {
			urlStack = eval('(' + urlStack + ')');
		}
		// 设置导航栏
		setTopInnerNavbar(urlStack);
	});
	
	/** 设置内嵌页面顶部导航 */
	function setTopInnerNavbar(menu){
		if(isEmptyObject(menu)){
			var storage = window.sessionStorage;
			menu = eval('(' + storage.getItem('urlStack') + ')');
		}
		var menuHtml = '<span  class="tab-title margin-left-5" style="font-size: 16px;">'+menu[menu.length-1].name+'</span>';
		menuHtml += '<div class="tab-header-line"></div>';
		for ( var i=1;i<=menu.length;i++) {
			if(menu.length == i){
				menuHtml += '<span class="new-navbar-span disabled">'+ menu[i-1].name + '</span>';	
			}else{
				if(isEmpty(menu[i-1].url))
					menuHtml += '<span class="new-navbar-span disabled">'+ menu[i-1].name + '</span>&nbsp;<span class="new-navbar-span disabled">></span>&nbsp;';	
				else
					menuHtml += '<span class="new-navbar-span hand" onclick="window.location.href=\''+ menu[i-1].url+'\'">'+ menu[i-1].name + '</span>&nbsp;<span class="new-navbar-span">></span>&nbsp;';
			}
		}
		$("#top-inner-navbar").html("");
		$("#top-inner-navbar").html(menuHtml);
	}
</script>
