<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ taglib uri="http://java.sun.com/jsp/jstl/core" prefix="c"%>
<c:set var="ctx" value="${pageContext.request.contextPath }"></c:set>
<!DOCTYPE html>
<html>
<head>
<%@ include file="../../common/head_standard.jsp"%>
<script src="${ctx }/assets/js/common/selectSearch.js?version=${version}"></script>
<script src="${ctx }/framework/jquery/jquery.fastLiveFilter.js"></script>
<title>筛查设置</title>
</head>
<body>
<div class="pl-12 pr-12 pt-10">
    <button type="button" class="u-btn-blue" onclick="ckd_filter_rule_list.edit();">新增</button>
</div>   
<div style="border-bottom: 0px !important;" class="bed-head xtt" >
        <div class="mt-8">
            <div class="u-table-fixed">
                <div class="u-table-fixed-head">
                    <table class="u-table u-table-bordered">
                        <thead>
                            <tr>                                
                                <th style="width:20%">筛查规则名</th>
                                <th style="width:70%">规则描述</th>                                                             
                                <th style="width:10%">操作</th>
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
        </div>        
</body>
<jsp:include page="../../ckd/patient/ckd_filter_rule_edit.jsp"></jsp:include>
<script src="${ctx }/assets/js/ckd/patient/ckd_filter_rule_list.js?version=${version}"></script>
<script>
$(function(){
    ckd_filter_rule_list.init();
});
</script>
</html>
