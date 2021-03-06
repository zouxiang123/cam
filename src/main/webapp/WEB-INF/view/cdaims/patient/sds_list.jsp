<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head_standard.jsp"%>
<title>抑郁自评量表</title>
</head>
<body>
<jsp:include page="../../common/head_theme.jsp" flush="true"></jsp:include>
<div class="frame-content">
    <input id="patientId" type="hidden" value="${patient.id }">
    <input id="patientName" type="hidden" value="${patient.name }">
    <input id="patientSex" type="hidden" value="${patient.sex }">
    <div class="u-list mt-10">
        <div class="u-text-r" id="sds_list_queryDiv">
            <label class="nutrition-action">
                <button type="button" class="u-btn-blue" onclick="sds_list.edit()">新增</button>
                <button type="button" data-show="#sds_list_queryDialog" class="u-btn">查询设置</button>
                <div class="u-prompt-box" id="sds_list_queryDialog" top-right style="top: 44px;right:0px;">
                    <div class="query-set">
                        <div class="u-list">时间：
                            <input type="text" name="startDateStr" readonly="readonly" datepicker>
                            <span class="fc-black_5"> 至 </span>
                            <input type="text" name="endDateStr" readonly="readonly" datepicker>
                        </div>
                        <div class="u-border-t u-text-r pt-8 mt-8">
                            <button type="button" class="u-btn" data-hide="#sds_list_queryDialog">取消</button>
                            <button type="button" class="u-btn-blue" data-hide="#sds_list_queryDialog" onclick="sds_list.getList();" fill>查询</button>
                        </div>
                    </div>
                </div>
            </label>
        </div>
    </div>
     <div class="somatometry nutrition" id="sds_list_div">
        <div id="sds_list_chart" style="height: 250px"></div>
        <table class="u-table u-table-bordered mt-20">
            <thead>
            <tr>
                <th class="xtt-12">时间</th>
                <th class="xtt-10">评分</th>
                <th class="">说明</th>
                <th class="xtt-10">操作</th>
            </tr>
            </thead>
            <tbody id="sds_list_tbody"></tbody>
        </table>
    </div>
</div>
<script type="text/javascript" src="${ctx }/assets/js/ckd/patient/sds_list.js?version=${version}"></script>
<script type="text/javascript">
$("#sds_list_chart").css("width", $(window).width());
</script>
</body>
</html>