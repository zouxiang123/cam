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
<title>电子病历</title>
</head>
<body>
    <div class="u-head-text mt-12 ml-12">
        <div class="content" id="tabsDiv">
            <span data-permission-key="CKD_filter_list" data-baseurl='${ctx }' data-url="sysOwner=${sysOwner}"
                data-target="CKD_filter_list" data-fixed="1" data-refresh="1"><a href="javascript:void(0);">肾脏病筛查</a></span>
            <span data-permission-key="CKD_patient_filter_list" data-baseurl='${ctx }' data-url="sysOwner=${sysOwner}"
                data-target="CKD_patient_filter_list" data-fixed="1" data-refresh="1"><a href="javascript:void(0);">筛查结果</a></span>
            <span data-permission-key="CKD_filter_rule_list" data-baseurl='${ctx }' data-url="sysOwner=${sysOwner}"
                data-target="CKD_filter_rule_list" data-fixed="1" data-refresh="1"><a href="javascript:void(0);">筛查设置</a></span>
            <span data-permission-key="CKD_patient_filter_report" data-baseurl='${ctx }' data-url="sysOwner=${sysOwner}"
                data-target="CKD_patient_filter_report" data-fixed="1" data-refresh="1"><a href="javascript:void(0);">筛查统计</a></span>                        
        </div>
    </div>
    <div id="tabsBodyDiv"></div>
    <div class="hide" data-tabdiv style="width: 100%;" id="basicIframeDiv">
        <iframe src="" frameborder="no" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
    </div>
    <script type="text/javascript" src="${ctx}/assets/js/common/tab_nav.js"></script>
    <script type="text/javascript">
        $(function() {            
            $("#tabsDiv").find("[data-permission-key]:not(.hide)").each(function() {               
                var url = getPermissionUrlByKey($(this).attr("data-permission-key"));
                url = $(this).data("baseurl") + "/" + url + ".shtml";
                if(!isEmpty($(this).attr("data-url"))){
                    url = url + "?" + encodeURI($(this).attr("data-url"));
                }
                $(this).attr("data-url", url);
                $(this).removeAttr("data-permission-key");
                $(this).removeAttr("data-baseurl");
            });
            tab_nav.init("standard");
        });
    </script>
</body>
</html>
