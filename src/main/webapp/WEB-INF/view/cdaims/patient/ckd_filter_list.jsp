<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head_standard.jsp"%>
<title>患者信息</title>
</head>
<body>   
<div style="border-bottom: 0px !important;" class="bed-head xtt" >        
        <div class="mt-12 pb-12 bottom-line-8 pl-12 pr-12" id="filter_list_queryDiv">             
            <div class="u-list">报告时间：
                <input type="text" name="startDateStr" id="startDateStr" readonly="readonly" datepicker>
                <span class="fc-black_5"> 至 </span>
                <input type="text" name="endDateStr" id="endDateStr" readonly="readonly" datepicker>                
                <label class="icon-input mr-24"> <input type="text" placeholder="诊断結果简搜" vanish="" id="patientSearch">
                </label>
            </div>                        
        </div>           
        <div class="mt-8">
            <div class="u-table-fixed">
                <div class="u-table-fixed-head">
                    <table class="u-table u-table-bordered">
                        <thead>
                            <tr>                                
                                <th style="width:5%">姓名</th>
                                <th style="width:3%">性别</th>
                                <th style="width:3%">年龄</th>
                                <th style="width:4%">就诊号</th>
                                <th style="width:9%">身份证号</th>
                                <th style="width:6%">联系方式</th>
                                <th style="width:18%">诊断结果</th>
                                <th style="width:5%">诊断编码</th>                         
                                <th style="width:8%">入院科室</th>
                                <th style="width:5%">出院科室</th>                                
                                <th style="width:6%">报告时间</th>
                                <th style="width:8%">操作</th>
                            </tr>
                        </thead>
                    </table>
                </div>
                <div class="u-table-fixed-body" id="main" style="max-height: 768px;">
                    <table class="u-table u-table-bordered">
                        <tbody id="tableBody">                           
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
        <div id="pagingDiv" style="position: fixed;bottom: -4px;left: 30%"></div>        
</body>
<script src="${ctx }/assets/js/ckd/patient/ckd_filter_list.js?version=${version}"></script>
</html>
