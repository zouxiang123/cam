<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<div class="col-sm-2 col-md-1 sidebar" style="width: 172px;top:45px;"> 
	<ul class="nav nav-sidebar new-sidebar" id="admin_left_nav">
		<li id="userListNavId" data-type="user"><a href="${ctx }/system/commonConf/view.shtml?type=user"><span class="nav-label">用户管理</span></a></li>
		<li id="roleListNavId" data-type="role"><a href="${ctx }/system/commonConf/view.shtml?type=role"><span class="nav-label">权限管理</span></a></li>
		<li id="logNavId" data-type="log"><a href="${ctx }/system/commonConf/view.shtml?type=log"><span class="nav-label">日志管理</span></a></li>
		<li id="sysParamNavId" data-type="sysParam"><a href="${ctx }/system/commonConf/view.shtml?type=sysParam"><span class="nav-label">系统参数</span></a></li>
		<li id="dictionaryMaintainNavId" data-type="dict"><a href="${ctx }/system/commonConf/view.shtml?type=dict"><span class="nav-label">字典维护</span></a></li>
		<li id="formTemplateNavId" data-type="formTemplate"><a href="${ctx }/system/commonConf/view.shtml?type=formTemplate"><span class="nav-label">随访表单模板</span></a></li>
		<li id="formulaNavId" data-type="formula"><a href="${ctx }/system/commonConf/view.shtml?type=formula"><span class="nav-label">公式配置</span></a></li>
		<li id="cacheNavId" data-type="cache"><a href="${ctx }/system/commonConf/view.shtml?type=cache"><span class="nav-label">缓存刷新</span></a></li>
		<li id="importNavId" data-type="import"><a href="${ctx }/system/commonConf/view.shtml?type=import"><span class="nav-label">数据导入</span></a></li>
		<li id="templateNavId" data-type="template"><a href="${ctx }/system/commonConf/view.shtml?type=template"><span class="nav-label">模板配置</span></a></li>
		<li id="assayConfNavId" data-type="assayConf"><a href="${ctx }/assay/assayConf/adminView.shtml?type=assayConf"><span class="nav-label">化验相关配置</span></a></li>
        <li id="complicationDictConfNavId"><a href="${ctx }/pdComplicationDict/confView.shtml"><span class="nav-label">并发症配置</span></a></li>
	</ul>
</div>
