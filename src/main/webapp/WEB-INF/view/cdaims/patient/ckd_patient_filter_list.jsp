<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>  
  <title>筛查结果</title>
  <%@ include file="../../common/head_standard.jsp"%>  
  <style>
  *{
    color: #484848;
  }
  .u-menu > div:first-child > span > a {
    max-width: 100px;
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
  
  button[type="button"].xtt-red.xtt-text {
    color: #F75B5B;
  }
  
  button[type="button"].xtt-blue.xtt-text {
    color: #31AAFF;
  }
</style>
</head>
<body>
  <div class="xtt">
    <div class="mr-12 ml-12 mt-10">      
      <div class="static-head-er1 u-clearfix position-relative">
        <ul>
          <li style="margin-left: 0px;width: 60px;" class="active" data-code="0">筛查患者</li>
          <li style="width: 60px" data-code="1">关注患者</li>
          <li style="width: 70px" data-code="2">已删除患者</li>
        </ul>
      </div>
    </div>    
    <div class="grayline"></div>
    <div class="line-height-40 ml-12 mr-12 mt-6" id="pubHead">
      <input type="text" placeholder="搜索姓名" id="patientSearch">
      <button type="button" class="u-float-r  mt-4 btn-delete">批量删除</button>
      <button type="button" class="u-float-r  mt-4 btn-care">批量关注</button>
    </div>
    <!-- 筛查患者 -->
    <div class="xtt ml-12 mr-12 mt-10" id="page1">
     <div class="u-table-fixed">
      <div class="u-table-fixed-head">
        <table class="u-table u-table-bordered">
          <thead>
            <tr>
             <th class="xtt-4">
               <label class="u-checkbox" >
                <input type="checkbox" name="che" id="ischeckAll">
                <span class="icon-checkbox"></span>
              </label>
            </th>
            <th class="xtt-12"> 筛查日期</th>
            <th class="xtt-8">姓名</th>
            <th class="xtt-14">身份证号</th>
            <th class="xtt-7">性别</th>
            <th class="xtt-7">年龄</th>
            <th>筛查规则名</th>
            <th class="xtt-12">最近就诊科室</th>
            <th class="xtt-12">就诊医生</th>
            <th class="xtt-12">操作</th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="u-table-fixed-body" id="table1">
      <table class="u-table u-table-bordered" style="table-layout: fixed;">       
          <tbody id="tableBody"></tbody>
   </table>
 </div>
</div>
</div>
<!-- 筛查患者 -->
</div>
<div id="pagingDiv" style="position: fixed;bottom: -4px;left: 30%"></div>
<script src="${ctx }/assets/js/ckd/patient/ckd_patient_filter_list.js?version=${version}"></script>
</body>
</html>
