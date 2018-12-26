<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
  <%@ include file="../../common/head_standard.jsp"%>
  <%@ include file="../../common/head_theme.jsp"%>
  <title>筛查统计</title>  
  <style>
  *{
    color: #484848;
  }
  .u-table-fixed-body td{
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .static-head-er1 > ul > li{
    margin-left: 32px;
    padding-left: 0;
  }
  .xtt .icon-caret-top,.xtt .icon-caret-bottom{
    position: absolute;
    left:90px;

  }
</style>
</head>
<body>
<jsp:include page="../../common/report_datepick_new2.jsp" flush="true"></jsp:include>
  <div class="xtt">
    <div class="mr-12 ml-12 mt-10">      
      <div class="static-head-er1 u-clearfix position-relative">
        <ul>
          <li style="margin-left: 0px;" class="active" data-code="1">筛选病患分类</li>
          <li data-code="2">转入统计</li>
        </ul>
      </div>
    </div>
    <div class="grayline"></div>
    <div class="line-height-40 ml-12 mr-12 mt-6" id="pubHead">
      <button type="button" class="u-float-r  mt-4" data-show="#promptDialog">报表设置</button>
      <button type="button" class="u-float-r  mt-4" id="download">报表下载</button>
    </div>
    <!-- 报表设置 -->
    <div class="u-prompt-box mt-12" top-right style="right: 12px;display: none;" id="promptDialog">
        <div style="max-height: 400px;" class="pr-10 overflow-auto mb-10" id="reportListQuery">
            <div class="u-xt-12" id="ReportListDate">
              <span>选择时间：</span>
                <input type="text" class="mr-8" name="startDateStr" id="startDateStr" readonly="readonly" style="width: 126px" datepicker>至
                <input type="text" name="endDateStr" id="endDateStr" readonly="readonly" class="ml-8" style="width: 126px" datepicker>
            </div>            
        </div>
        <div style="max-height: 400px;width:300px;;display:none;" class="pr-10 overflow-auto mb-10" id="outComeListQuery">            
            <div class="u-xt-12" >
              <span>选择时间：</span>
                <input type="text" class="mr-8" name="yearStr" id="yearStr" readonly="readonly" style="width: 50%" datepicker>                
            </div>
            <div class="u-xt-12 mt-12" id="search_select">               
               <span>疾病名称：</span>
               <label class="u-select" style="width: 50%" id="select_disgnosis">              
                </label>
            </div>
        </div>
        <div class="text-right pt-12 mr-10 bt-line">
            <button type="button" class="" data-hide="#promptDialog">取消</button>
            <button type="button" class="u-btn-blue" fill data-hide="#promptDialog" id="queryInfo">确定</button>
        </div>
    </div>
    <!-- 报表设置 -->
    <!-- 筛选病患分类 -->
    <div class="xtt ml-12 mr-12 mt-10" id="page1">
    <div class="table-bar">
            <label class="u-checkbox u-float-r" style="position: relative; top: 12px; margin-right: 34px; z-index: 10;"> <input
                type="checkbox" name="checkMedical" id="showData" checked> <span class="icon-checkbox"></span> 显示数据
            </label>
            <div id="qualitybar" style="top: -18px; min-height: 260px; height: 260px;"></div>
        </div>
    <!-- table -->
    <div class="u-table-fixed">
        <div class="u-table-fixed-head">
          <table class="u-table u-table-bordered">
              <thead>
                <tr>
                  <th class="xt-5">筛查规则名</th>
                  <th>患者人数</th>
                  <th class="xt-5">占比</th>
                </tr>
              </thead>
          </table>
        </div>
        <div class="u-table-fixed-body">
          <table class="u-table u-table-bordered">
            <tbody id="report_list">
            </tbody>
          </table>
        </div>
    </div>
    </div>
<!-- 筛选病患分类 -->
<!-- 转入统计 -->
  <div class="xtt ml-12 mr-12 mt-10 u-display-none" id="page2">
    <div class="table-bar">
        <div id="qualitybar1" class="qualitybar"></div>
    </div>
        <!-- table -->
    <div class="u-table-fixed">
        <div class="u-table-fixed-head">
          <table class="u-table u-table-bordered">
              <thead>
                <tr>
                  <th class="xt-4">筛查规则名</th>
                  <th class="xt-4">筛查人数</th>
                  <th class="xt-4">关注人数</th>
                  <th class="xt-4">转入人数</th>
                  <th>转入转化率</th>
                </tr>
              </thead>
          </table>
        </div>
        <div class="u-table-fixed-body">
          <table class="u-table u-table-bordered">
            <tbody id="outComeList">              
            </tbody>
          </table>
        </div>
    </div>
  </div>
<!-- 转入统计 -->
</div>
<script src="${ctx }/assets/js/ckd/patient/ckd_patient_filter_report.js?version=${version}"></script>
</body>
</html>
