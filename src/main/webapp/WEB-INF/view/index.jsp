<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript">
    var loadingShow = true;
</script>
<%@ include file="common/head_standard.jsp"%>
<title>学透通®慢病智能系统</title>
</head>
<body onresize="resizeFrame()">
    <div class="u-side-nav" data-skin="${login_user.skin}" onclick="Navigation('.u-side-nav')">
        <div class="u-nav-head new-nav-item" id="main-close"></div>
        <ul class="nav-content u-clear-scroll">
            <li data-baseurl='' data-permission-key="CKD_emr" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-emr"></i>电子病历
                </div>
            </li>
            <li data-baseurl='' data-permission-key="FU_schedule_template" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-news"></i>随访模板
                </div>
            </li>
            <li data-baseurl='' data-permission-key="CKD_report" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-statistics"></i>统计报表
                </div>
            </li>
            <li data-baseurl='' data-permission-key="CM_propaganda" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-education"></i>健康宣教
                </div>
            </li>
            <li data-baseurl='' data-permission-key="CKD_filter" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-screening"></i>慢病筛查
                </div>
            </li>
            <li data-baseurl='' data-permission-key="patient_assay_remind" data-permissionurl>
                <div class="new-nav-item" index="1">
                    <i class="icon-monitor"></i>数据监测
                </div>
            </li>
        </ul>
        <div class="u-user" data-show="#settingId">
            <img src="${ctx}/images${login_user.imagePath }" alt="" style="vertical-align: middle;"> ${login_user.name }
        </div>
        <div class="u-settingTion othHide" id="settingId">
            <ul>
                <li data-baseurl='' data-openurl="system/accountSetting.shtml">
                    <a href="javascript:void(0);" class="account-setting"><i class="icon-setting"></i>账号设置</a>
                </li>
                <li><a href="javascript:showAboutUs();" class="nav-about"><i class="icon-about"></i>关于我们</a></li>
                <%-- <li data-baseurl='' data-openurl="feedback.shtml">
                    <a href="javascript:void(0);" class="feedback"><i class="icon-feedback"></i>意见反馈</a>
                </li> --%>
                <li onclick="setUpSkin()"><i class="icon-skin fs-16"></i>选择皮肤</li>
                <li onclick="logout();"><i class="icon-exit"></i>退出系统</li>
            </ul>
        </div>
    </div>
    <div style="padding: 0px 15px;">
        <iframe id="frameBody" src="" style="position: fixed;" frameborder="no" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
    </div>
    <div id="sidebar-tip" class="side-tip-show"></div>
    <div id="scroll-top" class="scroll-top"></div>
    <jsp:include page="common/about_us.jsp"></jsp:include>
    <script type="text/javascript" src="${ctx }/assets/js/index.js?version=${version}""></script>
</body>
</html>
