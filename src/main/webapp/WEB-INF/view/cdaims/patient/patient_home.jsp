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
<title>患者首页</title>
</head>
<body>
    <div class="static-head-er1 u-clearfix bottom-line-8 pb-6" id="tabsDiv">
        <ul>
            <li title="患者详情" data-permission-key="CM_patient_detail" data-baseurl=''  data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">患者详情</a>
            </li>
            <li title="诊断信息" data-permission-key="CM_diagnosis_view" data-baseurl=''  data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">诊断信息</a>
            </li>
            <li title="慢病信息" data-permission-key="CKD_info" data-baseurl=''  data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">心理评估</a>
            </li>
            <li title="化验信息" data-permission-key="CM_patient_assay_record" data-baseurl=''  data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">化验信息</a>
            </li>
            <li title="随访记录" data-permission-key="FU_record_list" data-baseurl=''  data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">随访记录</a>
            </li>
            <li title="营养评估" data-permission-key="CM_nu_list" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">营养评估</a>
            </li>
            <li title="转归" data-permission-key="CM_propaganda_patient_list" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">宣教信息</a>
            </li>
            <li title="转归" data-permission-key="CM_patient_outcome_record" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">转归</a>
            </li> 
            <li title="院外信息" data-permission-key="CM_nu_out_list" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">院外信息</a>
            </li>
            <li title="用药医嘱" data-permission-key="CM_drug_mo_List" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">用药医嘱</a>
            </li>
            <li title="治疗分析" data-permission-key="CKD_treatment" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">治疗分析</a>
            </li>
            <li title="药品观察记录" data-permission-key="CKD_drugs_record_list" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">药品观察记录</a>
            </li>
            <li title="用药记录" data-permission-key="CKD_medical_record_list" data-baseurl='' data-param="patientId=${patient.id }" >
                <a href="javascript:void(0);">用药记录</a>
            </li>
        </ul>
    </div>
    <div id="basicIframeDiv">
        <iframe src="" frameborder="no" width="100%" marginwidth="0" marginheight="0" scrolling="yes" allowtransparency="yes"></iframe>
    </div>
    <script type="text/javascript">
        $(function() {
            var offset = $("#basicIframeDiv").offset();
            $("#basicIframeDiv").find("iframe").css({
                position : "fixed",
                top : offset.top,
                left : offset.left,
                height : $(window).height() - offset.top,
                width : $(window).width() - offset.left
            });
            //get url form permission
            $("#tabsDiv").find("[data-permission-key]:not(.hide)").on("click",function() {
                var iframeEl = $("#basicIframeDiv").find("iframe");
                $(this).addClass("active").siblings().removeClass("active");
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
            $("#tabsDiv").find("[data-permission-key]:not(.hide):first").click();
        });
    </script>
</body>
</html>