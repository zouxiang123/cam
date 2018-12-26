<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head_standard.jsp"%>
<title>药品观察记录</title>
</head>
<body>
<div class="mt-12 position-relative">
    <div style="height:23px;">        
        <div class="cursor-pointer" data-permission-key="CKD_drugs_record" onclick="ckd_drugs_record_list.addOrEdit(${patient.id });">
            <div class="ml-20">
                <i class="icon-add icon-round-add fs-12"></i>
                <i class="icon-round fs-24 position-absolute fc-blue"></i>
            </div>
            <span class="fw-bold newpagebutton">新增药品观察记录</span>
        </div>               
    </div>
    <input type="hidden" value="${patient.name }"  id="patientName">
    <input type="hidden" value="${patient.id }"  id="patientId">    
    <div id="recordList"></div>
    <jsp:include page="../../common/iframe_dialog.jsp"></jsp:include>
</div>
</body>
<script type="text/javascript" src="${ctx }/assets/js/ckd/patient/ckd_drugs_record_list.js?version=${version}"></script>
<script type="text/javascript">
$(function() {
    ckd_drugs_record_list.init();
});
</script>
</html>
