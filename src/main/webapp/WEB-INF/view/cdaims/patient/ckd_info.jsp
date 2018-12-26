<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<script type="text/javascript">var loadingShow = false;</script>
<%@ include file="../../common/head_standard.jsp"%>
<title>心理评估</title>
</head>
<body>
  <div class="mt-12 pb-2" id="btnsDiv">
    <button type="button" class="ml-12 mr-10" data-permission-key="CKD_sas_list"  data-baseurl='' data-param="patientId=${patientId }" >焦虑自评量表(SAS)</button>
    <button type="button" class="ml-12 mr-10" data-permission-key="CKD_sds_list"  data-baseurl='' data-param="patientId=${patientId }" >抑郁自评量表(SDS)</button>
  </div>
  <div id="iframeDiv">
    <iframe src="" frameborder="no" width="100%" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
  </div>
    <jsp:include page="../../common/iframe_dialog.jsp" flush="true"></jsp:include>
</body>
<script type="text/javascript">
$(function() {
    var offset = $("#iframeDiv").offset();
    $("#iframeDiv").find("iframe").css({
        position : "fixed",
        top : offset.top,
        left : offset.left,
        height : $(window).height() - offset.top,
        width : $(window).width() - offset.left
    });
    //get url form permission
    $("#btnsDiv").find("[data-permission-key]:not(.hide)").on("click",function() {
        var iframeEl = $("#iframeDiv").find("iframe");
        $(this).addClass("u-btn-blue").siblings().removeClass("u-btn-blue");
        var iframeDocument = iframeEl[0].contentDocument || iframeEl[0].contentWindow.document;
        iframeDocument.documentElement.innerHTML = "";
        var key = $(this).attr("data-permission-key");
        var baseUrl = convertEmpty($(this).data("baseurl"));
        var openUrl = ctx + "/openUrl.shtml?baseUrl=" + encodeURIComponent(baseUrl) + "&key=" + encodeURIComponent(key);
        var param = $(this).data("param");
        if (!isEmpty(param)) {
            openUrl += '&param=' + encodeURIComponent(param);
        }
        iframeEl.attr("src",openUrl);
    });
    $("#btnsDiv").find("[data-permission-key]:not(.hide)").eq(0).click();
});
</script>
</html>
