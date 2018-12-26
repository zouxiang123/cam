<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<script type="text/javascript">
    var loadingShow = false;
</script>
<jsp:include page="../../common/head_standard.jsp"></jsp:include>
<body onresize="resizeFrame();">
    <div class="xtt">
        <div class="static-head-er1 u-clearfix" id="topReportNav">
            <ul>
                <li data-baseurl='${ctx }' onclick="getReportOpenUrl(this);" data-permission-key="CM_assay_report">化验项统计</li>
                <li data-baseurl='${ctx }' onclick="getReportOpenUrl(this);" data-permission-key="CM_patient_report">患者基本信息</li>
                <li data-baseurl='${ctx }' onclick="getReportOpenUrl(this);" data-permission-key="CM_patient_outcome_report">转归患者</li>
                <li data-baseurl='${ctx }' onclick="getReportOpenUrl(this);" data-permission-key="CM_propaganda_report">宣教统计</li>
                <li data-baseurl='${ctx }' onclick="getReportOpenUrl(this);" data-permission-key="CM_diagnosis_report">原发病统计</li>
            </ul>
        </div>
        <div class="grayline"></div>
        <div style="padding: 0px; with: 100%; height: 100%">
            <iframe id="doctorFrameBody" style="width: 100%;" frameborder="no" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
        </div>
    </div>
<script>
    /** 获取跳转url链接并打开url,同时更改标题栏标题 */
    function getReportOpenUrl(element) {
        $(element).addClass("active").siblings().removeClass("active");
        var permissionObj = getPermissionObjByKey($(element).attr("data-permission-key"));
        var clickText = $(element).text();
        if (!isEmptyObject(permissionObj)) {
            var url = "";
            if (!isEmpty(permissionObj.url)) {
                url = permissionObj.url;
            } else {
                url = getPermissionUrlByParentCode(permissionObj.code);
            }
            if (!isEmpty(url)) {
                url = $(element).data("baseurl") + "/" + url + ".shtml";
                replaceUrlStackLast(permissionObj.name, url);
                $("#doctorFrameBody").attr("src", url);
            }
        }
    }
    
    function resizeFrame() {
        $("#doctorFrameBody").height($(window).height() - $("#doctorFrameBody").offset().top - 10);
    }

    $(function() {
        resizeFrame();
        $("#topReportNav li:visible:eq(0)").click();
    });
</script>
</body>
</html>
