<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript">
    var loadingShow = true;
</script>
<%@ include file="../../common/head_standard.jsp"%>
<title>学透通®慢病智能系统</title>
</head>
<body onresize="resizeFrame()">
    <div class="u-side-nav" data-skin="${login_user.skin}" onclick="Navigation('.u-side-nav')">
        <div class="u-nav-head new-nav-item" id="main-close"></div>
        <ul class="nav-content u-clear-scroll">
            <li data-openurl="system/searchUser.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>用户管理</div>
            </li>
            <li data-openurl="system/searchRole.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>权限管理</div>
            </li>
            <li data-openurl="system/dictionary/maintain.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>字典维护</div>
            </li>
            <li data-openurl="system/param/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>系统参数</div>
            </li>
            <li data-openurl="system/logList.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>系统日志</div>
            </li>
            <li data-openurl="fuFormTemplate/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>随访表单模板</div>
            </li>
            <li data-openurl="cmFormulaConf/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>公式配置</div>
            </li>
            <li data-openurl="cacheRefresh/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>缓存刷新</div>
            </li>
            <li data-openurl="excel/dataImport.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>数据导入</div>
            </li>
            <li data-openurl="system/template/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>模板配置</div>
            </li>
            <li data-openurl="/assay/assayConf/view.shtml">
                <div class="new-nav-item"><i class="icon-page"></i>化验相关配置</div>
            </li>
        </ul>
        <div class="u-user" data-show="#settingId">
            <img src="${ctx}/images${login_user.imagePath }" alt="" style="vertical-align: middle;"> ${login_user.name }
        </div>
        <div class="u-settingTion othHide" id="settingId">
            <ul>
                <li data-baseurl='' data-openurl="system/accountSetting.shtml" >
                    <a href="javascript:void(0);" class="account-setting"><i class="icon-setting"></i>账号设置</a>
                </li>
                <li><a href="javascript:showAboutUs();" class="nav-about"><i class="icon-about"></i>关于我们</a></li>
                <%-- <li data-baseurl='${COMMON_SERVER_ADDR}' data-openurl="feedback.shtml" >
                    <a href="javascript:void(0);" class="feedback"><i class="icon-feedback"></i>意见反馈</a>
                </li> --%>
                <li onclick="setUpSkin()"><i class="icon-skin fs-16"></i>选择皮肤</li>
                <li onclick="logout();"><i class="icon-exit"></i>退出系统</li>
            </ul>
        </div>
    </div>
    <div style="width:100%;padding: 0px 15px;">
        <iframe id="frameBody" src="" style="position: fixed;padding: 10px 0px 0px 10px;" frameborder="no" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
    </div>
    <div id="sidebar-tip" class="side-tip-show"></div>
    <div id="scroll-top" class="scroll-top"></div>
    <jsp:include page="../../common/about_us.jsp"></jsp:include>
    <script type="text/javascript" src="${ctx }/assets/js/ckd/conf/conf_index.js?version=${version}""></script>
</body>
</html>
